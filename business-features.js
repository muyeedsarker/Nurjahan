// Nurjahan.com — reusable business feature presets
// These presets describe UI-ready capabilities; real payment/order/booking backends must be connected separately.
const PRODUCT_FEATURES=['product-photo','price','discount','stock','sku','category','search','filter','cart','checkout','delivery','order-status','reviews','coupon','wishlist','call','whatsapp'];
const SERVICE_FEATURES=['services','service-price','booking','appointment','gallery','reviews','location','call','whatsapp','contact-form'];
const CONTENT_FEATURES=['articles','categories','search','share','gallery','comments','newsletter','seo'];
export const BUSINESS_FEATURES={
 Electronics:{icon:'📱',kind:'product',features:PRODUCT_FEATURES,sections:['Hero','Categories','Featured Products','Offers','Products','Why Choose Us','Reviews','Contact']},
 Electrical:{icon:'💡',kind:'product',features:PRODUCT_FEATURES,sections:['Hero','Product Categories','Featured Products','Offers','Products','Brands','Contact']},
 'Mobile & Gadget':{icon:'📱',kind:'product',features:PRODUCT_FEATURES,sections:['Hero','Brands','Featured Gadgets','Products','Offers','Reviews','Contact']},
 Computer:{icon:'💻',kind:'product',features:PRODUCT_FEATURES,sections:['Hero','Computer Categories','Featured Products','Accessories','Offers','Reviews','Contact']},
 'Fashion & Clothing':{icon:'👕',kind:'product',features:PRODUCT_FEATURES,sections:['Hero','Collections','New Arrivals','Products','Offers','Size Guide','Reviews','Contact']},
 Cosmetics:{icon:'💄',kind:'product',features:PRODUCT_FEATURES,sections:['Hero','Beauty Categories','Featured Products','Products','Offers','Reviews','Contact']},
 Grocery:{icon:'🧺',kind:'product',features:PRODUCT_FEATURES,sections:['Hero','Categories','Daily Deals','Products','Delivery','Offers','Reviews','Contact']},
 'General Store':{icon:'🛒',kind:'product',features:PRODUCT_FEATURES,sections:['Hero','Categories','Featured Products','Products','Offers','Delivery','Contact']},
 Furniture:{icon:'🛋️',kind:'product',features:PRODUCT_FEATURES,sections:['Hero','Collections','Featured Furniture','Products','Gallery','Offers','Delivery','Contact']},
 Hardware:{icon:'🔧',kind:'product',features:PRODUCT_FEATURES,sections:['Hero','Categories','Featured Products','Products','Brands','Offers','Contact']},
 'Auto Parts':{icon:'🚗',kind:'product',features:PRODUCT_FEATURES,sections:['Hero','Vehicle Categories','Parts Search','Featured Parts','Products','Offers','Contact']},
 Pharmacy:{icon:'💊',kind:'service-product',features:[...PRODUCT_FEATURES,'health-info','prescription-note'],sections:['Hero','Health Services','Featured Products','Products','Health Information','Contact']},
 Restaurant:{icon:'🍽️',kind:'restaurant',features:['menu','food-photo','price','offers','cart','checkout','delivery','order-status','table-booking','reviews','location','call','whatsapp'],sections:['Hero','Menu Categories','Popular Items','Full Menu','Offers','Delivery','Table Booking','Reviews','Contact']},
 Bakery:{icon:'🥐',kind:'restaurant',features:['menu','food-photo','price','offers','cart','checkout','delivery','order-status','reviews','location','call','whatsapp'],sections:['Hero','Best Sellers','Menu','Offers','Delivery','Reviews','Contact']},
 Doctor:{icon:'👨‍⚕️',kind:'service',features:SERVICE_FEATURES,sections:['Profile','Specialties','Services','Appointment','Chamber','Reviews','Contact']},
 Clinic:{icon:'🏥',kind:'service',features:SERVICE_FEATURES,sections:['Hero','Departments','Doctors','Services','Appointment','Facilities','Contact']},
 Lawyer:{icon:'⚖️',kind:'service',features:SERVICE_FEATURES,sections:['Profile','Practice Areas','Services','Appointment','Case Process','Reviews','Contact']},
 Education:{icon:'🎓',kind:'service-content',features:[...SERVICE_FEATURES,...CONTENT_FEATURES],sections:['Hero','Courses','Teachers','Admission','Notice','Gallery','Reviews','Contact']},
 Travel:{icon:'✈️',kind:'service-product',features:[...SERVICE_FEATURES,'package-price','search','booking'],sections:['Hero','Destinations','Packages','Offers','Booking','Gallery','Reviews','Contact']},
 Hotel:{icon:'🏨',kind:'service',features:[...SERVICE_FEATURES,'room-list','room-price','booking'],sections:['Hero','Rooms','Facilities','Offers','Booking','Gallery','Reviews','Contact']},
 Fitness:{icon:'🏋️',kind:'service',features:[...SERVICE_FEATURES,'membership','class-schedule'],sections:['Hero','Programs','Trainers','Schedule','Membership','Reviews','Contact']},
 'Real Estate':{icon:'🏠',kind:'listing',features:['property-photo','price','location','search','filter','property-details','lead-form','call','whatsapp','map'],sections:['Hero','Property Search','Featured Properties','Listings','Areas','Why Us','Contact']},
 'News / Blog':{icon:'📰',kind:'content',features:CONTENT_FEATURES,sections:['Hero','Latest Posts','Categories','Featured Story','Popular Posts','Newsletter','Contact']},
 Creator:{icon:'🎥',kind:'content',features:[...CONTENT_FEATURES,'video','social-links','sponsor'],sections:['Hero','About','Featured Work','Videos','Gallery','Social Links','Contact']},
 Organization:{icon:'🏢',kind:'organization',features:['about','notice','services','events','gallery','documents','members','contact-form','location'],sections:['Hero','About','Notice','Services','Events','Gallery','Documents','Contact']},
 Personal:{icon:'👤',kind:'portfolio',features:['about','portfolio','skills','gallery','social-links','contact-form'],sections:['Hero','About','Skills','Portfolio','Gallery','Contact']}
};
export function getBusinessFeatures(type){return BUSINESS_FEATURES[type]||{icon:'🌐',kind:'custom',features:[...SERVICE_FEATURES,...PRODUCT_FEATURES,...CONTENT_FEATURES],sections:['Hero','About','Services','Products','Gallery','Reviews','Contact']};}
