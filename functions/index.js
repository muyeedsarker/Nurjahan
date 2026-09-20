const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

initializeApp();
const db = getFirestore();

function requireAdmin(request) {
  if (!request.auth || request.auth.token.admin !== true) {
    throw new HttpsError('permission-denied', 'Admin access required.');
  }
}

function screenPaymentInput({ method, senderPhone, trxId, packageAmount }) {
  const sender = String(senderPhone || '').replace(/[^0-9+]/g, '');
  const trx = String(trxId || '').trim().toUpperCase();
  const amount = Number(packageAmount || 0);
  const checks = {
    method: ['bkash','nagad'].includes(String(method || '').toLowerCase()),
    senderFormat: /^(?:\\+?8801|01)\\d{9}$/.test(sender),
    trxFormat: /^[A-Z0-9-]{6,40}$/.test(trx),
    amount: [399,1999].includes(amount)
  };
  const passed = Object.values(checks).filter(Boolean).length;
  return { status: passed === 4 ? 'screened' : 'flagged', score: Math.round((passed / 4) * 100), checks, providerVerified: false };
}

exports.reviewPayment = onCall(
  { enforceAppCheck: true, consumeAppCheckToken: true },
  async (request) => {
    requireAdmin(request);
    const { paymentId, action } = request.data || {};
    if (!paymentId || !['approved', 'rejected'].includes(action)) {
      throw new HttpsError('invalid-argument', 'Payment ID বা action সঠিক নয়।');
    }

    const paymentRef = db.collection('payments').doc(String(paymentId));

    return db.runTransaction(async (tx) => {
      const paymentSnap = await tx.get(paymentRef);
      if (!paymentSnap.exists) throw new HttpsError('not-found', 'Payment পাওয়া যায়নি।');
      const payment = paymentSnap.data();
      if (payment.status !== 'pending') {
        throw new HttpsError('failed-precondition', 'এই Payment আর Pending নেই।');
      }

      const trx = String(payment.trxId || '').trim().toUpperCase();
      const packageName = String(payment.packageName || 'Premium');
      const packageAmount = Number(payment.packageAmount || payment.amount || 399);
      const isEcommerce = packageName === 'E-commerce' && packageAmount === 1999;
      const method = String(payment.method || '').trim().toLowerCase();
      if (!trx || !['bkash', 'nagad'].includes(method)) {
        throw new HttpsError('invalid-argument', 'Payment method বা Transaction ID সঠিক নয়।');
      }

      const keyId = Buffer.from(`${method}:${trx}`).toString('base64url').slice(0, 150);
      const keyRef = db.collection('paymentTrxKeys').doc(keyId);

      if (action === 'rejected') {
        tx.update(paymentRef, {
          status: 'rejected',
          reviewedAt: FieldValue.serverTimestamp(),
          reviewedBy: request.auth.uid
        });
        tx.set(keyRef, {
          paymentId: String(paymentId),
          method,
          trxId: trx,
          status: 'rejected',
          rejectedAt: FieldValue.serverTimestamp()
        }, { merge: true });
        return { ok: true, status: 'rejected' };
      }
      const keySnap = await tx.get(keyRef);
      if (keySnap.exists) {
        const key = keySnap.data();
        if (key.paymentId !== String(paymentId) && key.status === 'approved') {
          throw new HttpsError('already-exists', 'এই bKash/Nagad Transaction ID আগে Approved হয়েছে।');
        }
        if (key.paymentId !== String(paymentId) && key.status === 'pending') {
          throw new HttpsError('already-exists', 'এই Transaction ID অন্য একটি Pending Payment-এ ব্যবহার হয়েছে।');
        }
      }

      tx.set(keyRef, {
        paymentId: String(paymentId),
        method,
        trxId: trx,
        status: 'approved',
        approvedAt: FieldValue.serverTimestamp()
      }, { merge: true });

      tx.update(paymentRef, {
        status: 'approved',
        reviewedAt: FieldValue.serverTimestamp(),
        reviewedBy: request.auth.uid
      });

      if (payment.websiteId) {
        tx.update(db.collection('websites').doc(String(payment.websiteId)), {
          status: 'live',
          paid: true,
          subscriptionStatus: 'active',
          billing: isEcommerce ? 'one-time' : 'monthly',
          monthlyAmount: isEcommerce ? 0 : 399,
          packageAmount,
          supportPeriod: isEcommerce ? '1-year' : null,
          paidAt: FieldValue.serverTimestamp(),
          nextPaymentDue: isEcommerce ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          updatedAt: FieldValue.serverTimestamp()
        });
      }
      return { ok: true, status: 'approved', websiteId: payment.websiteId || null, packageName, packageAmount, billing: isEcommerce ? 'one-time' : 'monthly' };
    });
  }
);

exports.submitPayment = onCall(
  { enforceAppCheck: true, consumeAppCheckToken: true },
  async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'Sign in required.');
    const data = request.data || {};
    const websiteId = String(data.websiteId || '').trim();
    const websiteName = String(data.websiteName || '').trim();
    const websiteSnap = await db.collection('websites').doc(websiteId).get();
    if (!websiteSnap.exists || websiteSnap.data().ownerId !== request.auth.uid) {
      throw new HttpsError('permission-denied', 'এই Website আপনার Account-এর নয়।');
    }
    const domain = String(data.domain || '').trim();
    const method = String(data.method || '').trim();
    const senderPhone = String(data.senderPhone || '').trim();
    const trxId = String(data.trxId || '').trim().toUpperCase();
    const packageName = String(data.packageName || 'Premium').trim();
    const packageAmount = Number(data.packageAmount || 0);
    const billing = String(data.billing || '').trim();
    const validPackage = (packageName === 'Premium' && packageAmount === 399 && billing === 'monthly') || (packageName === 'E-commerce' && packageAmount === 1999 && billing === 'one-time');
    if (!websiteId || !websiteName || !senderPhone || !trxId || !validPackage || !['bKash','Nagad'].includes(method)) {
      throw new HttpsError('invalid-argument', 'Payment তথ্য সঠিক নয়।');
    }
    const keyId = Buffer.from(`${method.toLowerCase()}:${trxId}`).toString('base64url').slice(0, 150);
    const keyRef = db.collection('paymentTrxKeys').doc(keyId);
    const paymentRef = db.collection('payments').doc();
    const screening = screenPaymentInput({ method, senderPhone, trxId, packageAmount });
    await db.runTransaction(async (tx) => {
      const keySnap = await tx.get(keyRef);
      if (keySnap.exists) {
        const key = keySnap.data();
        if (key.status !== 'rejected') {
          throw new HttpsError('already-exists', 'এই Transaction ID আগে ব্যবহার করা হয়েছে।');
        }
      }
      tx.set(keyRef, {
        paymentId: paymentRef.id,
        method: method.toLowerCase(),
        trxId,
        status:'pending',
        createdAt:FieldValue.serverTimestamp()
      });
      tx.set(paymentRef, {
        websiteId, websiteName, domain, packageName, packageAmount,
        billing, method, senderPhone, trxId, amount:packageAmount,
        status:'pending',
        paymentVerificationStatus:'pending_provider_verification',
        aiScreening: screening,
        createdAt:FieldValue.serverTimestamp()
      });
    });
    return { ok:true, id:paymentRef.id, status:'pending', verificationStatus:'pending_provider_verification', aiScreening: screening };
  }
);

exports.submitOrder = onCall(
  { enforceAppCheck: true, consumeAppCheckToken: true },
  async (request) => {
    const data = request.data || {};
    const websiteId = String(data.websiteId || '').trim();
    const name = String(data.name || '').trim();
    const phone = String(data.phone || '').trim();
    const address = String(data.address || '').trim();
    const items = Array.isArray(data.items) ? data.items.slice(0, 50) : [];
    if (!websiteId || !name || !phone || !address || !items.length) {
      throw new HttpsError('invalid-argument', 'অর্ডারের তথ্য অসম্পূর্ণ।');
    }
    if (name.length > 120 || phone.length > 30 || address.length > 500) {
      throw new HttpsError('invalid-argument', 'অর্ডারের তথ্যের দৈর্ঘ্য সঠিক নয়।');
    }
    const cleanItems = items.map(x => ({
      name: String(x?.name || '').trim().slice(0, 200),
      price: Number(x?.price || 0),
      qty: Math.max(1, Math.min(99, Number(x?.qty || 1)))
    })).filter(x => x.name && Number.isFinite(x.price) && x.price >= 0);
    if (!cleanItems.length) throw new HttpsError('invalid-argument', 'পণ্যের তথ্য সঠিক নয়।');
    const total = cleanItems.reduce((sum, x) => sum + x.price * x.qty, 0);
    if (!Number.isFinite(total) || total > 10000000) throw new HttpsError('invalid-argument', 'অর্ডারের মোট মূল্য সঠিক নয়।');
    const websiteSnap = await db.collection('websites').doc(websiteId).get();
    if (!websiteSnap.exists || websiteSnap.data().status !== 'live') {
      throw new HttpsError('failed-precondition', 'এই ওয়েবসাইটটি এখনো Live নয়।');
    }
    const ref = await db.collection('orders').add({
      websiteId, name, phone, address, items: cleanItems, total,
      status: 'pending', source: 'live-ecommerce',
      createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp()
    });
    return { ok: true, id: ref.id, status: 'pending', total };
  }
);

exports.createSupportTicket = onCall(
  { enforceAppCheck: true, consumeAppCheckToken: true },
  async (request) => {
    const data = request.data || {};
    const message = String(data.message || '').trim();
    const websiteId = String(data.websiteId || '').trim().slice(0, 120);
    if (message.length > 4000) throw new HttpsError('invalid-argument', 'বার্তাটি খুব বড়।');
    if (!message) throw new HttpsError('invalid-argument', 'প্রশ্ন পাওয়া যায়নি।');
    const ref = await db.collection('supportTickets').add({
      websiteId,
      message: message.slice(0, 4000),
      conversation: Array.isArray(data.conversation) ? data.conversation.slice(-12) : [],
      source: 'ai-customer-support',
      status: 'pending',
      metadata: data.metadata && typeof data.metadata === 'object' ? data.metadata : {},
      createdAt: FieldValue.serverTimestamp()
    });
    return { ok: true, id: ref.id };
  }
);

exports.listSupportTickets = onCall(
  { enforceAppCheck: true, consumeAppCheckToken: true },
  async (request) => {
    requireAdmin(request);
    const snap = await db.collection('supportTickets').orderBy('createdAt','desc').limit(100).get();
    return { ok:true, tickets:snap.docs.map(d=>({id:d.id,...d.data(),createdAt:d.data().createdAt?.toDate?.()?.toISOString()||null})) };
  }
);

exports.reviewSupportTicket = onCall(
  { enforceAppCheck: true, consumeAppCheckToken: true },
  async (request) => {
    requireAdmin(request);
    const id=String(request.data?.ticketId||'').trim();
    const status=String(request.data?.status||'').trim();
    if(!id || !['pending','resolved','closed'].includes(status)) throw new HttpsError('invalid-argument','Support status সঠিক নয়।');
    const ref=db.collection('supportTickets').doc(id);
    const snap=await ref.get();
    if(!snap.exists) throw new HttpsError('not-found','Support ticket পাওয়া যায়নি।');
    await ref.update({status,reviewedAt:FieldValue.serverTimestamp(),reviewedBy:request.auth.uid});
    return {ok:true,id,status};
  }
);

exports.listOrders = onCall(
  { enforceAppCheck: true, consumeAppCheckToken: true },
  async (request) => {
    requireAdmin(request);
    const snap = await db.collection('orders').orderBy('createdAt','desc').limit(100).get();
    return { ok:true, orders:snap.docs.map(d=>({id:d.id,...d.data(),createdAt:d.data().createdAt?.toDate?.()?.toISOString()||null,updatedAt:d.data().updatedAt?.toDate?.()?.toISOString()||null})) };
  }
);

exports.reviewOrder = onCall(
  { enforceAppCheck: true, consumeAppCheckToken: true },
  async (request) => {
    requireAdmin(request);
    const id=String(request.data?.orderId||'').trim();
    const status=String(request.data?.status||'').trim();
    if(!id || !['pending','processing','shipped','delivered','cancelled'].includes(status)) throw new HttpsError('invalid-argument','অর্ডারের status সঠিক নয়।');
    const ref=db.collection('orders').doc(id);
    const snap=await ref.get();
    if(!snap.exists) throw new HttpsError('not-found','অর্ডার পাওয়া যায়নি।');
    await ref.update({status,reviewedAt:FieldValue.serverTimestamp(),reviewedBy:request.auth.uid,updatedAt:FieldValue.serverTimestamp()});
    return {ok:true,id,status};
  }
);

exports.submitTrainingApplication = onCall(
  { enforceAppCheck: true, consumeAppCheckToken: true },
  async (request) => {
    const data = request.data || {};
    const websiteId = String(data.websiteId || '').trim();
    const course = String(data.course || '').trim();
    const name = String(data.name || '').trim();
    const phone = String(data.phone || '').trim();
    const address = String(data.address || '').trim();
    if (!websiteId || !course || !name || !phone) {
      throw new HttpsError('invalid-argument', 'ভর্তি আবেদনের তথ্য অসম্পূর্ণ।');
    }
    if (name.length > 120 || phone.length > 30 || address.length > 500 || course.length > 200) {
      throw new HttpsError('invalid-argument', 'আবেদনের তথ্যের দৈর্ঘ্য সঠিক নয়।');
    }
    const websiteSnap = await db.collection('websites').doc(websiteId).get();
    if (!websiteSnap.exists || websiteSnap.data().status !== 'live') {
      throw new HttpsError('failed-precondition', 'এই প্রশিক্ষণ ওয়েবসাইটটি এখনো Live নয়।');
    }
    const ref = await db.collection('trainingApplications').add({
      websiteId, course, name, phone, address,
      status: 'pending', source: 'live-training-form',
      createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp()
    });
    return { ok: true, id: ref.id, status: 'pending' };
  }
);

exports.listTrainingApplications = onCall(
  { enforceAppCheck: true, consumeAppCheckToken: true },
  async (request) => {
    requireAdmin(request);
    const snap = await db.collection('trainingApplications').orderBy('createdAt','desc').limit(100).get();
    return { ok: true, applications: snap.docs.map(d => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate?.()?.toISOString() || null, updatedAt: d.data().updatedAt?.toDate?.()?.toISOString() || null })) };
  }
);

exports.reviewTrainingApplication = onCall(
  { enforceAppCheck: true, consumeAppCheckToken: true },
  async (request) => {
    requireAdmin(request);
    const id = String(request.data?.applicationId || '').trim();
    const status = String(request.data?.status || '').trim();
    if (!id || !['accepted', 'rejected'].includes(status)) throw new HttpsError('invalid-argument', 'আবেদনের তথ্য সঠিক নয়।');
    const ref = db.collection('trainingApplications').doc(id);
    const snap = await ref.get();
    if (!snap.exists) throw new HttpsError('not-found', 'আবেদন পাওয়া যায়নি।');
    await ref.update({ status, reviewedAt: FieldValue.serverTimestamp(), reviewedBy: request.auth.uid, updatedAt: FieldValue.serverTimestamp() });
    return { ok: true, id, status };
  }
);
