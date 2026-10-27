/* ============ SITE SETTINGS: edit these ============ */
window.SITE = {
  name: 'Sarah Duschka',
  email: 'sarahdhomes4sale@gmail.com',   // all searches and enquiries are delivered here
  phone: '707-533-6390',
  addr: '1675 S Main St, Lakeport, CA',
  dre: '02150007',
  fb: 'https://www.facebook.com/profile.php?id=100069912642756'
};
window.$ = (s, c = document) => c.querySelector(s);
window.$$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ============ SAMPLE LISTINGS: replace with real properties ============
   Images: replace the files in /images/listings/ using the same file names (id-1.jpg ... id-4.jpg),
   or change the paths below. type: house | apartment | condo | land. status: sale | rent. */
const mk = (id, title, addr, city, type, status, price, beds, baths, sqft, year, feat, desc, tag, acres) => ({
  id, title, addr, city, type, status, price, beds, baths, sqft, year, feat, desc, tag, acres,
  img: [1, 2, 3, 4].map(n => `images/listings/${id}-${n}.jpg`)
});
window.LISTINGS = [
  mk('lakeview-estate', 'Lakeview Estate', '120 Lakeshore Drive', 'Lakeport', 'house', 'sale', 1285000, 4, 3.5, 3800, 2019, ['Lake view', 'Pool', 'Garage', 'Fireplace'], 'A light-filled modern home above the water with vaulted ceilings, a chef\u2019s kitchen, a wraparound deck and a heated pool. Every room frames the view.', 'Featured'),
  mk('oak-hill-ranch', 'Oak Hill Ranch Home', '4410 Oak Hill Road', 'Kelseyville', 'house', 'sale', 749000, 3, 2, 2400, 2008, ['Garden', 'Garage', 'Fireplace', 'Pet friendly'], 'Single-level country living on a quiet lot with mature oaks, a covered patio and a detached workshop.', 'Featured'),
  mk('clearlake-cottage', 'Clearlake Cottage', '16463 33rd Avenue', 'Clearlake', 'house', 'sale', 329000, 3, 2, 1450, 1994, ['Garden', 'Garage', 'Pet friendly'], 'A bright, move-in-ready cottage with an open living area, a spacious yard and an attached garage.', 'New'),
  mk('waterfront-retreat', 'Waterfront Retreat', '88 Shoreline Way', 'Clearlake Oaks', 'house', 'sale', 612000, 3, 2.5, 2100, 2005, ['Waterfront', 'Lake view', 'Garage'], 'Wake up to the lake. Private dock access, an open-plan kitchen and a deck made for long summer evenings.', 'Waterfront'),
  mk('downtown-loft', 'Downtown Loft Apartment', '210 Main Street, Unit 4', 'Lakeport', 'apartment', 'rent', 1850, 1, 1, 780, 2016, ['Pet friendly', 'Lake view'], 'A stylish loft-style apartment steps from shops and the waterfront, with high ceilings and in-unit laundry.', 'For rent'),
  mk('garden-court-apt', 'Garden Court Apartment', '55 Garden Court, Unit 2', 'Clearlake', 'apartment', 'rent', 1500, 2, 1, 920, 2012, ['Garden', 'Pet friendly'], 'A calm two-bedroom ground-floor apartment with a private patio and covered parking.', 'For rent'),
  mk('lakeside-two-bed', 'Lakeside Two-Bed Apartment', '9 Lucerne Harbor Road, Unit 6', 'Lucerne', 'apartment', 'rent', 1725, 2, 2, 1010, 2018, ['Lake view', 'Garage'], 'A modern two-bedroom, two-bath apartment with a balcony overlooking the lake and secure parking.', 'New'),
  mk('harbor-view-condo', 'Harbor View Condo', '300 Harbor Lane, Unit 12', 'Lakeport', 'condo', 'sale', 389000, 2, 2, 1250, 2010, ['Lake view', 'Garage', 'Pool'], 'A low-maintenance condo in a gated community with a shared pool, covered parking and a sunny balcony.', ''),
  mk('ridgetop-acreage', 'Ridgetop Acreage', 'Ridgetop Road (APN on request)', 'Lower Lake', 'land', 'sale', 175000, 0, 0, 0, 0, ['Lake view'], 'Build your dream estate on over 40 acres of open, usable land with long-distance views and road access.', 'Land', 40)
];
