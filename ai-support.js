import { getAI, getGenerativeModel, GoogleAIBackend } from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-ai.js';
import { db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js';

const ai = getAI(db.app, { backend: new GoogleAIBackend() });
const model = getGenerativeModel(ai, {
  model: 'gemini-3.8-flash',
  systemInstruction: `You are Nurjahan.com's Bengali customer support AI. Answer politely in simple Bengali, with short clear steps. You help customers create websites, choose Free or Premium plans, understand the Premium price of ৳399/month, payment submission, domain/hosting questions, website customization, mobile issues and common troubleshooting. AI support is available to both Free and Premium customers. Never invent payment approval, domain registration, hosting provisioning, refunds, or account changes. Never ask the customer to call the owner for ordinary questions. If a matter requires human/admin action (for example payment verification, refund, account ownership, security incident, custom domain provisioning, or a problem you cannot solve), clearly say that it has been marked for Admin review and create an escalation when the app requests it. Do not request passwords, OTPs, card PINs, or other secrets. Do not claim that a website is live unless the system explicitly provides that status.`
});

const SUPPORT_CONTEXT = `Nurjahan.com service facts:
- Free plan: ৳0; website creation, preview, basic customize, mobile responsive and AI support.
- Premium plan: ৳399/month; live website, Nurjahan hosting infrastructure, customizable website, SSL/HTTPS, mobile responsive, AI support and priority support.
- Customers do not need to buy separate hosting for the Nurjahan hosting plan.
- Custom domain registration/renewal may cost separately.
- Premium payment is manually submitted and verified by Admin.
- Do not reveal private admin data or payment account details unless the page explicitly displays them.`;

export async function askNurjahanAI(message, history = []) {
  const clean = String(message || '').trim();
  if (!clean) return 'আপনার প্রশ্নটি লিখুন। আমি সাহায্য করছি।';
  const recent = history.slice(-8).map(x => `${x.role === 'user' ? 'গ্রাহক' : 'AI'}: ${x.text}`).join('\n');
  const prompt = `${SUPPORT_CONTEXT}\n\nConversation:\n${recent}\n\nগ্রাহকের নতুন প্রশ্ন:\n${clean}`;
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function createSupportTicket(message, conversation = [], metadata = {}) {
  const clean = String(message || '').trim();
  if (!clean) throw new Error('প্রশ্ন পাওয়া যায়নি।');
  const ref = await addDoc(collection(db, 'supportTickets'), {
    message: clean,
    conversation: conversation.slice(-12),
    source: 'ai-customer-support',
    status: 'pending',
    ...metadata,
    createdAt: serverTimestamp()
  });
  return ref.id;
}
