export const NURJAHAN_FEATURES = {
  product: ['Product Photo','Product Name','Price','Discount','SKU / Code','Stock','Category','Search','Filter','Cart','Checkout','Order Status','Reviews','Offers / Coupons','Delivery Area','Delivery Charge','WhatsApp / Call'],
  service: ['Service List','Price / From Price','Gallery','Booking / Appointment','Schedule','Customer Enquiry','Reviews','Location / Map','Call','WhatsApp'],
  restaurant: ['Menu','Food Photo','Price','Offers','Online Order','Delivery','Delivery Area','Table Booking','Reviews','Location'],
  professional: ['Profile','Services','Experience','Portfolio','Appointment','Contact','Location','FAQ','Social Links'],
  content: ['Articles','Categories','Search','Featured Content','Gallery','Social Share','Comments','Newsletter'],
  organization: ['About','Services','Notice','Events','Gallery','Documents','Contact','Location','Donation Info'],
  marketing: ['SEO Title','Meta Description','Social Preview','Facebook Share','Offer Banner','Coupon','Call To Action'],
  communication: ['AI Chat','Customer Enquiry','Support Ticket','Call','WhatsApp','Messenger','Contact Form'],
  platform: ['Responsive Design','Fast Loading','HTTPS/SSL Ready','Theme Switcher','Mobile Navigation','Preview','Save','Publish']
};

export const NURJAHAN_BUSINESS_PRESETS = {
  'Electronics': ['product','marketing','communication','platform'],
  'Electrical': ['product','marketing','communication','platform'],
  'Mobile & Gadget': ['product','marketing','communication','platform'],
  'Computer': ['product','marketing','communication','platform'],
  'Fashion & Clothing': ['product','marketing','communication','platform'],
  'Cosmetics & Beauty': ['product','marketing','communication','platform'],
  'Grocery': ['product','marketing','communication','platform'],
  'General Store': ['product','marketing','communication','platform'],
  'Furniture': ['product','communication','platform'],
  'Hardware': ['product','communication','platform'],
  'Auto Parts': ['product','communication','platform'],
  'Pharmacy': ['product','service','communication','platform'],
  'Restaurant': ['restaurant','marketing','communication','platform'],
  'Doctor / Clinic': ['professional','service','communication','platform'],
  'Hotel': ['service','marketing','communication','platform'],
  'Travel': ['service','marketing','communication','platform'],
  'Education': ['service','content','communication','platform'],
  'Lawyer / Professional': ['professional','communication','platform'],
  'Real Estate': ['product','service','marketing','communication','platform'],
  'NGO / Organization': ['organization','content','communication','platform'],
  'News / Blog': ['content','marketing','communication','platform'],
  'Creator / Media': ['content','marketing','communication','platform'],
  'Personal / Portfolio': ['professional','content','communication','platform'],
  'Local Service': ['service','marketing','communication','platform'],
  'Other': ['service','marketing','communication','platform']
};

export function getBusinessFeatures(type='Other') {
  const groups = NURJAHAN_BUSINESS_PRESETS[type] || NURJAHAN_BUSINESS_PRESETS.Other;
  return [...new Set(groups.flatMap(g => NURJAHAN_FEATURES[g] || []))];
}

// AI → Builder bridge. The Builder already imports this catalog, so no large index.html rewrite is needed.
function applySavedAIIntent(){
  const raw=localStorage.getItem('nurjahanBuilderIntent');
  if(!raw)return;
  try{
    const intent=JSON.parse(raw)||{};
    const select=document.getElementById('type');
    if(select){
      const target=intent.type==='Other'?'অন্যান্য':intent.type;
      const option=[...select.options].find(o=>o.value===target||o.textContent.trim()===target);
      if(option){
        select.value=option.value;
        select.dispatchEvent(new Event('change',{bubbles:true}));
      }
    }
    const name=document.getElementById('name');
    if(name && !name.value && intent.type && intent.type!=='Other') name.value=intent.type+' Website';
    const desc=document.getElementById('description');
    if(desc && !desc.value && intent.query) desc.value=intent.query;
    localStorage.removeItem('nurjahanBuilderIntent');
  }catch(e){console.warn('AI Builder intent ignored',e)}
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',applySavedAIIntent,{once:true});
else applySavedAIIntent();
