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
      const method = String(payment.method || '').trim().toLowerCase();
      if (!trx || !['bkash', 'nagad'].includes(method)) {
        throw new HttpsError('invalid-argument', 'Payment method বা Transaction ID সঠিক নয়।');
      }

      if (action === 'rejected') {
        tx.update(paymentRef, {
          status: 'rejected',
          reviewedAt: FieldValue.serverTimestamp(),
          reviewedBy: request.auth.uid
        });
        return { ok: true, status: 'rejected' };
      }

      const keyId = Buffer.from(`${method}:${trx}`).toString('base64url').slice(0, 150);
      const keyRef = db.collection('paymentTrxKeys').doc(keyId);
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
          billing: 'monthly',
          monthlyAmount: 399,
          paidAt: FieldValue.serverTimestamp(),
          nextPaymentDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          updatedAt: FieldValue.serverTimestamp()
        });
      }
      return { ok: true, status: 'approved', websiteId: payment.websiteId || null };
    });
  }
);

exports.submitPayment = onCall(
  { enforceAppCheck: true, consumeAppCheckToken: true },
  async (request) => {
    const data = request.data || {};
    const websiteId = String(data.websiteId || '').trim();
    const websiteName = String(data.websiteName || '').trim();
    const domain = String(data.domain || '').trim();
    const method = String(data.method || '').trim();
    const senderPhone = String(data.senderPhone || '').trim();
    const trxId = String(data.trxId || '').trim().toUpperCase();
    if (!websiteId || !websiteName || !senderPhone || !trxId || !['bKash','Nagad'].includes(method)) {
      throw new HttpsError('invalid-argument', 'Payment তথ্য সঠিক নয়।');
    }
    const keyId = Buffer.from(`${method.toLowerCase()}:${trxId}`).toString('base64url').slice(0, 150);
    const keyRef = db.collection('paymentTrxKeys').doc(keyId);
    const paymentRef = db.collection('payments').doc();
    await db.runTransaction(async (tx) => {
      const keySnap = await tx.get(keyRef);
      if (keySnap.exists) {
        throw new HttpsError('already-exists', 'এই Transaction ID আগে ব্যবহার করা হয়েছে।');
      }
      tx.set(keyRef, {
        paymentId: paymentRef.id,
        method: method.toLowerCase(),
        trxId,
        status:'pending',
        createdAt:FieldValue.serverTimestamp()
      });
      tx.set(paymentRef, {
        websiteId, websiteName, domain, packageName:'Premium', packageAmount:399,
        billing:'monthly', method, senderPhone, trxId, amount:399,
        status:'pending', createdAt:FieldValue.serverTimestamp()
      });
    });
    return { ok:true, id:paymentRef.id, status:'pending' };
  }
);

exports.createSupportTicket = onCall(
  { enforceAppCheck: true, consumeAppCheckToken: true },
  async (request) => {
    const data = request.data || {};
    const message = String(data.message || '').trim();
    if (message.length > 4000) throw new HttpsError('invalid-argument', 'বার্তাটি খুব বড়।');
    if (!message) throw new HttpsError('invalid-argument', 'প্রশ্ন পাওয়া যায়নি।');
    const ref = await db.collection('supportTickets').add({
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
