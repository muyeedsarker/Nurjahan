// Nurjahan.com — lightweight AI-to-Builder intent bridge
// Converts common Bengali/English customer requests into safe Builder presets.
const TYPES={
 Electronics:['electronics','ইলেকট্রনিক','মোবাইল','গ্যাজেট','টিভি'],Electrical:['electrical','ইলেকট্রিক','লাইট','ফ্যান','সুইচ'], 'Mobile & Gadget':['mobile','মোবাইল','gadget','গ্যাজেট'],Computer:['computer','কম্পিউটার','laptop','ল্যাপটপ'], 'Fashion & Clothing':['fashion','ফ্যাশন','clothing','পোশাক','শাড়ি','পাঞ্জাবি'], 'Cosmetics & Beauty':['cosmetic','কসমেটিক','beauty','বিউটি','skincare','স্কিন'],Grocery:['grocery','মুদি','খাদ্য'],Furniture:['furniture','ফার্নিচার'],Hardware:['hardware','হার্ডওয়্যার','tools','টুলস'], 'Auto Parts':['auto parts','গাড়ির পার্ট','মোটরসাইকেল'],Pharmacy:['pharmacy','ফার্মেসি','ওষুধ'],Restaurant:['restaurant','রেস্টুরেন্ট','food','খাবার','মেনু'], 'Doctor / Clinic':['doctor','ডাক্তার','clinic','ক্লিনিক','চেম্বার'],Hotel:['hotel','হোটেল','room','রুম'],Travel:['travel','ট্রাভেল','tour','ভ্রমণ'],Education:['education','শিক্ষা','school','স্কুল','college','কলেজ'], 'Real Estate':['real estate','রিয়েল এস্টেট','property','জমি','ফ্ল্যাট'], 'News / Blog':['news','নিউজ','blog','ব্লগ'], 'Creator / Media':['creator','মিডিয়া','video','ভিডিও'], 'NGO / Organization':['ngo','organization','সংগঠন','প্রতিষ্ঠান']};
const FEATURES={store:['online order','order','অর্ডার','shop','store','কার্ট','cart'],booking:['booking','appointment','অ্যাপয়েন্টমেন্ট','বুকিং'],gallery:['gallery','গ্যালারি','ছবি','photo'],blog:['blog','ব্লগ','article','নিউজ'],map:['map','location','লোকেশন','ঠিকানা'],contact:['contact','যোগাযোগ','call','ফোন','whatsapp'],seo:['seo','google search','সার্চ'],delivery:['delivery','ডেলিভারি'],faq:['faq','প্রশ্নোত্তর']};
function hit(text,words){return words.some(w=>text.includes(w))}
export function analyzeBuilderRequest(text=''){
 const q=String(text).toLowerCase().trim();
 let type='Other';
 for(const [name,words] of Object.entries(TYPES)){if(hit(q,words)){type=name;break}}
 const features=Object.entries(FEATURES).filter(([,words])=>hit(q,words)).map(([k])=>k);
 return {type,features,query:text};
}
export function applyBuilderIntent(intent){localStorage.setItem('nurjahanBuilderIntent',JSON.stringify({...intent,createdAt:Date.now()}));location.href='index.html#builder';}
