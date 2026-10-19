/**
 * OREOS DELICACIES - Default Seed Data
 * Curated for Oreofe Abisola's Bakery & Pastry Confectionery
 * 100% Real Product Photos & Exact Prices directly from the Owner
 */

export const DEFAULT_SITE_SETTINGS = {
  business_name: "OREOS DELICACIES",
  tagline: "Exceptional Cake and Pastries",
  owner_name: "Oreofe Abisola",
  phone: "09154667248",
  whatsapp: "2347033396558",
  whatsapp_display: "07033396558",
  tiktok_handle: "@oreosdelicacies",
  tiktok_url: "https://www.tiktok.com/@oreosdelicacies",
  address: "Isolu, near Cornerstone Gym Center and Isolu Car Wash, FUNAAB, Abeokuta, Ogun State",
  google_maps_embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15820.635824985223!2d3.407421!3d7.199623!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103a4b6cb9f64bf3%3A0x6b876d2994a73752!2sFederal%20University%20of%20Agriculture%2C%20Abeokuta!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng",
  google_maps_directions: "https://www.google.com/maps/dir/?api=1&destination=Isolu+FUNAAB+Abeokuta+Ogun+State",
  hours_weekday: "Monday - Saturday: 8:00 AM – 8:00 PM",
  hours_sunday: "Sunday: 10:00 AM – 6:00 PM",
  weekday_open_hour: 8,
  weekday_close_hour: 20,
  sunday_open_hour: 10,
  sunday_close_hour: 18,
  announcement_banner: "✨ Fresh batches baking now! Place your WhatsApp order for fast delivery across Abeokuta & FUNAAB.",
  announcement_active: true,
  about_text: "Oreofe Abisola is a passionate pastry chef and culinary artist based in Abeokuta, Ogun State. Renowned across FUNAAB and Abeokuta for her famous signature eggrolls, Oreofe brings artisan craftsmanship, hygienic baking standards, and heartwarming flavor to every single treat. From bespoke celebration tiered cakes to velvety milky donuts, fudgy brownies, and crunchy jarred delights, OREOS DELICACIES turns everyday moments into sweet, unforgettable celebrations."
};

export const DEFAULT_CATEGORIES = [
  { id: "cat-eggrolls-snacks", name: "Eggrolls & Snacks", icon: "croissant", order: 1 },
  { id: "cat-cakes", name: "Cakes", icon: "cake", order: 2 },
  { id: "cat-surprise-boxes", name: "Surprise & Treat Boxes", icon: "gift", order: 3 },
  { id: "cat-donuts-sweets", name: "Donuts & Sweet Treats", icon: "cookie", order: 4 },
  { id: "cat-parfaits", name: "Parfaits", icon: "ice-cream", order: 5 },
  { id: "cat-jars-crunchies", name: "Jars & Crunchies", icon: "box", order: 6 }
];

export const DEFAULT_DELIVERY_AREAS = [
  { id: "area-walkin", name: "Walk-in (Isolu Store)", fee: 0, time_estimate: "Instant / Ready for Pickup" },
  { id: "area-isolu", name: "Isolu", fee: 400, time_estimate: "15 - 25 mins" },
  { id: "area-accord", name: "Accord", fee: 500, time_estimate: "20 - 30 mins" },
  { id: "area-oluwo", name: "Oluwo", fee: 500, time_estimate: "25 - 35 mins" },
  { id: "area-zoo", name: "Zoo", fee: 500, time_estimate: "20 - 30 mins" },
  { id: "area-harmony", name: "Harmony", fee: 700, time_estimate: "30 - 45 mins" },
  { id: "area-school-gate", name: "School Gate", fee: 700, time_estimate: "25 - 40 mins" },
  { id: "area-agbede", name: "Agbede", fee: 800, time_estimate: "30 - 50 mins" },
  { id: "area-kofesu", name: "Kofesu", fee: 800, time_estimate: "35 - 55 mins" },
  { id: "area-camp", name: "Camp", fee: 1000, time_estimate: "30 - 50 mins" }
];

export const DEFAULT_MENU_ITEMS = [
  // ==========================================
  // 1. EGGROLLS & SNACKS
  // ==========================================
  {
    id: "item-signature-eggroll",
    category_id: "cat-eggrolls-snacks",
    name: "Oreofe's Signature Eggroll",
    description: "Real photo from our kitchen! The crown jewel of Oreos Delicacies. Golden, crispy-sweet pastry dough crust wrapped around a seasoned whole boiled egg center.",
    image: "assets/images/real-eggroll-700.jpg",
    is_featured: true,
    is_signature: true,
    is_sold_out: false,
    order: 1,
    variants: [
      { name: "Single Piece", price: 700 },
      { name: "Pack of 3", price: 2000 },
      { name: "Pack of 5 (Best Value)", price: 3300 },
      { name: "Party Pack of 10", price: 6500 }
    ]
  },
  {
    id: "item-meat-pie",
    category_id: "cat-eggrolls-snacks",
    name: "Classic Golden Meat Pie",
    description: "Real photo from our kitchen! Flaky, golden shortcrust pastry generously packed with savory minced beef, potatoes, and tender carrots. Baked fresh daily.",
    image: "assets/images/real-meat-pie.jpg",
    is_featured: true,
    is_sold_out: false,
    order: 2,
    variants: [
      { name: "Single Meat Pie", price: 1200 },
      { name: "Box of 4 Meat Pies", price: 4800 },
      { name: "Box of 8 Meat Pies", price: 9600 }
    ]
  },
  {
    id: "item-meat-pie-filling",
    category_id: "cat-eggrolls-snacks",
    name: "Hearty Minced Beef Meat Pie",
    description: "Real photo showing our rich filling! Golden flaky pastry bursting with seasoned minced beef, carrots, and soft potatoes with savory herbs.",
    image: "assets/images/real-meat-pie-filling-1200.jpg",
    is_featured: true,
    is_sold_out: false,
    order: 3,
    variants: [
      { name: "Single Meat Pie", price: 1200 },
      { name: "Box of 4 Meat Pies", price: 4800 }
    ]
  },
  {
    id: "item-snacks-box",
    category_id: "cat-eggrolls-snacks",
    name: "Celebration Snacks & Pastry Mega Box",
    description: "Real photo of our party carton! Loaded with golden meat pies, fluffy baked buns, crispy puff-puff, spring rolls, samosas, peppered chicken, and a mini celebration cake.",
    image: "assets/images/real-snacks-box-25k.jpg",
    is_featured: true,
    is_sold_out: false,
    order: 4,
    variants: [
      { name: "Celebration Snacks Mega Carton", price: 25000 }
    ]
  },

  // ==========================================
  // 2. CAKES
  // ==========================================
  {
    id: "item-cake-bento-2layer",
    category_id: "cat-cakes",
    name: "Size 5\" Bento Cake (Two Layer Luxury)",
    description: "Real photo from our bakery! Double-height size 5 celebration cake dressed in silky vanilla buttercream ruffles, delicate black satin ribbons, edible gold pearls, and custom gold 'Happy Birthday' topper.",
    image: "assets/images/real-bento-2layer-18k.jpg",
    is_featured: true,
    is_sold_out: false,
    order: 5,
    variants: [
      { name: "Size 5\" Two Layer Cake", price: 18000 }
    ]
  },
  {
    id: "item-cake-size6",
    category_id: "cat-cakes",
    name: "Celebration Cake (Size 6\" Layer)",
    description: "Real photo from our bakery! Pristine white frosted celebration cake decorated with yellow rosettes, dainty green leaves, and custom yellow cursive text (e.g. 'happy birthday Mowa').",
    image: "assets/images/real-cake-size6-15k.jpg",
    is_featured: true,
    is_sold_out: false,
    order: 6,
    variants: [
      { name: "Size 6\" Layer Cake", price: 15000 }
    ]
  },
  {
    id: "item-cake-size8",
    category_id: "cat-cakes",
    name: "Celebration Cake (Size 8\" One Layer)",
    description: "Real photo from our bakery! Custom decorated celebration cake with vanilla/coffee rosettes, Oreo cookies, golden salted pretzels, chocolate drizzle, and custom piped message.",
    image: "assets/images/real-cake-size8-30k.jpg",
    is_featured: true,
    is_sold_out: false,
    order: 7,
    variants: [
      { name: "Size 8\" One Layer", price: 30000 },
      { name: "Size 8\" Double Layer", price: 42000 }
    ]
  },
  {
    id: "item-cake-size10",
    category_id: "cat-cakes",
    name: "Celebration Cake (Size 10\" One Layer)",
    description: "Real photo from our bakery! Exquisite single-layer pink celebration cake garnished with sweet maraschino cherries, golden pretzels, chocolate drizzle, and delicate rosettes.",
    image: "assets/images/real-cake-size10.jpg",
    is_featured: true,
    is_sold_out: false,
    order: 8,
    variants: [
      { name: "Size 10\" One Layer", price: 50000 },
      { name: "Size 10\" Double Layer", price: 68000 }
    ]
  },
  {
    id: "item-bento-cake",
    category_id: "cat-cakes",
    name: "Bento Box Cake (Clamshell)",
    description: "Real photo from our shop! Chic 4-inch mini minimalist cake with black ribbon bows, cute heart motifs, and custom message in an eco-friendly clamshell box.",
    image: "assets/images/real-bento-cake-10k.jpg",
    is_featured: true,
    is_sold_out: false,
    order: 9,
    variants: [
      { name: "Single Bento Box Cake", price: 10000 }
    ]
  },
  {
    id: "item-bento-cupcake",
    category_id: "cat-cakes",
    name: "Bento Cake with Cupcakes Combo",
    description: "Real photo from our shop! Handcrafted custom pink celebration bento cake served with 2 matching piped rosette cupcakes with red heart toppers.",
    image: "assets/images/real-bento-cupcake.jpg",
    is_featured: true,
    is_sold_out: false,
    order: 10,
    variants: [
      { name: "Bento + 2 Cupcakes Combo", price: 14000 },
      { name: "Bento + 4 Cupcakes Deluxe", price: 17500 }
    ]
  },
  {
    id: "item-foil-cake",
    category_id: "cat-cakes",
    name: "Fresh Oven Foil Cake",
    description: "Real photo from our kitchen! Freshly baked golden sponge loaf cake in food-grade foil baking pans with red velvet swirl toppings.",
    image: "assets/images/real-foil-cake-2500.jpg",
    is_featured: true,
    is_sold_out: false,
    order: 11,
    variants: [
      { name: "Single Foil Cake (Loaf Tray)", price: 2500 },
      { name: "Duo Foil Cakes Pack", price: 4800 }
    ]
  },
  {
    id: "item-uniced-cake",
    category_id: "cat-cakes",
    name: "Fresh Oven Uniced Sponge Cake",
    description: "Real photo from our kitchen! Golden baked, tender round vanilla sponge cakes fresh out of the oven. Fluffy, melt-in-your-mouth texture, ready for home dessert or tea time.",
    image: "assets/images/real-uniced-cake-4k.jpg",
    is_featured: true,
    is_sold_out: false,
    order: 12,
    variants: [
      { name: "Single Uniced Sponge Cake", price: 4000 },
      { name: "Trio Pack of 3 Cakes", price: 11500 }
    ]
  },
  {
    id: "item-cake-parfait",
    category_id: "cat-cakes",
    name: "Cake Parfait Glass Tumbler",
    description: "Real photo from our bakery! Clear cup layered with moist sponge cake crumble, whipped cream, chocolate cake layer, and colorful rainbow sprinkles.",
    image: "assets/images/real-cake-parfait-2500.jpg",
    is_featured: true,
    is_sold_out: false,
    order: 13,
    variants: [
      { name: "Cake Parfait Cup (2500)", price: 2500 },
      { name: "Duo Cake Parfait Pack", price: 4800 }
    ]
  },

  // ==========================================
  // 3. SURPRISE & TREAT BOXES
  // ==========================================
  {
    id: "item-treat-box-wine",
    category_id: "cat-surprise-boxes",
    name: "Deluxe Treat Box (Wine & Bento Cake)",
    description: "Real photo from our shop! Luxury white gift box featuring a custom iced mini bento cake, a bottle of premium Veleta non-alcoholic wine, Lush cookies, chocolate snack bars, and greeting card.",
    image: "assets/images/real-treat-box-14k.jpg",
    is_featured: true,
    is_sold_out: false,
    order: 14,
    variants: [
      { name: "Deluxe Wine & Bento Box Set", price: 14000 }
    ]
  },
  {
    id: "item-treat-box-juice",
    category_id: "cat-surprise-boxes",
    name: "Sweetheart Treat Box (Chivita Juice & Bento)",
    description: "Real photo from our shop! Romantic gift box containing a custom pink frosted bento cake ('Let me raise a toast to the girl I love the most'), Chivita Active Citrus juice, chocolates, and an 'I Love You' greeting card.",
    image: "assets/images/real-treat-box-chivita-13k.jpg",
    is_featured: true,
    is_sold_out: false,
    order: 15,
    variants: [
      { name: "Sweetheart Juice & Bento Box Set", price: 13000 }
    ]
  },
  {
    id: "item-balloon-treat",
    category_id: "cat-surprise-boxes",
    name: "Hot Air Balloon Luxury Treat Box",
    description: "Real photo from our shop! Spectacular celebratory gift with a clear balloon filled with pink heart balloons, premium non-alcoholic Eva wine, chocolates, and cookies in our signature pink gift box.",
    image: "assets/images/real-balloon-treat-35k.jpg",
    is_featured: true,
    is_sold_out: false,
    order: 16,
    variants: [
      { name: "Hot Air Balloon Treat Box (Complete Set)", price: 35000 }
    ]
  },
  {
    id: "item-money-box-love",
    category_id: "cat-surprise-boxes",
    name: "I Love You Luxury Money Box Surprise",
    description: "Real photo of our luxury surprise gift! Custom 'I ❤️ U' arrangement filled with rolled crisp currency notes, a deep red rose, romantic framed personal photos, and love letter.",
    image: "assets/images/real-money-box-100k.jpg",
    is_featured: true,
    is_sold_out: false,
    order: 17,
    variants: [
      { name: "I Love You Money Box Set", price: 100000 }
    ]
  },

  // ==========================================
  // 4. DONUTS & SWEET TREATS
  // ==========================================
  {
    id: "item-milky-donut-box",
    category_id: "cat-donuts-sweets",
    name: "Oreos Creamy Milky Stuffed Donuts",
    description: "Real photo from our kitchen! Pillowy soft golden donuts packed with rich creamy milk filling and dusted in sweet milk powder snow. Served fresh in handy protective clamshell packs.",
    image: "assets/images/real-milky-donut-3500.jpg",
    is_featured: true,
    is_sold_out: false,
    order: 18,
    variants: [
      { name: "Clamshell Pack (3500)", price: 3500 },
      { name: "Duo Pack of 2 Containers", price: 6800 }
    ]
  },
  {
    id: "item-donuts",
    category_id: "cat-donuts-sweets",
    name: "Golden Sugar-Dusted Donuts",
    description: "Real photo from our bakery! Ultra-soft, pillowy yeast donuts fried to a golden hue and generously dusted with granulated sugar snow.",
    image: "assets/images/real-donut-700.jpg",
    is_featured: true,
    is_sold_out: false,
    order: 19,
    variants: [
      { name: "Single Sugar Donut", price: 700 },
      { name: "Box of 4 Donuts", price: 2800 },
      { name: "Box of 6 Donuts", price: 4000 },
      { name: "Party Box of 12", price: 7800 }
    ]
  },
  {
    id: "item-banana-bread",
    category_id: "cat-donuts-sweets",
    name: "Fresh Artisan Banana Bread (Raisins & Cashews)",
    description: "Real photo from our kitchen! Moist, fragrant banana bread loaf studded with sweet plump raisins and roasted cashew nuts, individually wrapped to seal in oven freshness.",
    image: "assets/images/real-banana-bread-3k.jpg",
    is_featured: true,
    is_sold_out: false,
    order: 20,
    variants: [
      { name: "Single Banana Bread Loaf (3K)", price: 3000 },
      { name: "Duo Loaf Pack", price: 5800 }
    ]
  },
  {
    id: "item-brownies",
    category_id: "cat-donuts-sweets",
    name: "Fudgy Belgian Chocolate Brownies",
    description: "Real photo from our kitchen! Rich, dense, ultra-fudgy Belgian dark chocolate brownie squares with a shiny crinkle top and melt-in-the-mouth center.",
    image: "assets/images/real-brownies-2500.jpg",
    is_featured: true,
    is_sold_out: false,
    order: 21,
    variants: [
      { name: "Single Fudgy Brownie Box", price: 2500 },
      { name: "Pack of 4 Fudgy Brownies", price: 4800 },
      { name: "Box of 8 Fudgy Brownies", price: 9000 }
    ]
  },
  {
    id: "item-cupcakes",
    category_id: "cat-donuts-sweets",
    name: "Fresh Oven-Baked Cupcake",
    description: "Real photo from our bakery! Soft, fluffy golden sponge cupcakes baked fresh every morning and individually packaged for maximum hygiene.",
    image: "assets/images/real-cupcakes.jpg",
    is_featured: true,
    is_sold_out: false,
    order: 22,
    variants: [
      { name: "Single Cupcake", price: 500 },
      { name: "Pack of 4 Cupcakes", price: 2000 },
      { name: "Pack of 6 Cupcakes", price: 3000 },
      { name: "Party Box of 12 Cupcakes", price: 6000 }
    ]
  },

  // ==========================================
  // 5. PARFAITS
  // ==========================================
  {
    id: "item-fruit-parfait",
    category_id: "cat-parfaits",
    name: "Fresh Greek Fruit Parfait (Regular Cup)",
    description: "Real photo from our kitchen! Tall clear cup with dome lid and official Oreos Delicacies label. Packed with creamy Greek yoghurt, seasonal fresh fruits, and crunchy roasted granola.",
    image: "assets/images/real-fruit-parfait-4k.jpg",
    is_featured: true,
    is_sold_out: false,
    order: 23,
    variants: [
      { name: "Regular Parfait Cup (4K)", price: 4000 },
      { name: "Jumbo Parfait Cup", price: 6000 }
    ]
  },
  {
    id: "item-mini-fruit-parfait",
    category_id: "cat-parfaits",
    name: "Mini Fruit Parfait (Snack Tub)",
    description: "Real photo of our snack cup! Convenient grab-and-go tub of creamy fruit parfait topped with fresh fruits and granola crunch.",
    image: "assets/images/real-mini-parfait-2500.jpg",
    is_featured: true,
    is_sold_out: false,
    order: 24,
    variants: [
      { name: "Mini Fruit Parfait Tub", price: 2500 }
    ]
  },

  // ==========================================
  // 6. JARS & CRUNCHIES
  // ==========================================
  {
    id: "item-peanuts-jar",
    category_id: "cat-jars-crunchies",
    name: "Gourmet Roasted Peanuts (Sealed Pouch)",
    description: "Real photo of our branded snack pouches! Crisp, golden roasted groundnuts seasoned to perfection with our official 'Oreos Delicacies & Surprise' label.",
    image: "assets/images/real-peanuts-1k.jpg",
    is_featured: true,
    is_sold_out: false,
    order: 25,
    variants: [
      { name: "Single Pouch (1K)", price: 1000 },
      { name: "Pack of 3 Pouches", price: 2800 },
      { name: "Pack of 6 Pouches", price: 5500 }
    ]
  },
  {
    id: "item-plantain-chips-jar",
    category_id: "cat-jars-crunchies",
    name: "Crispy Golden Plantain Chips (Sealed Jar)",
    description: "Real photo of our branded jar! Sealed fresh with our official 'Oreos Delicacies & Surprise' label and tamper proof band. Thin, ultra-crispy, golden ripe plantain chips.",
    image: "assets/images/real-plantain-chips-3500.jpg",
    is_featured: true,
    is_sold_out: false,
    order: 26,
    variants: [
      { name: "Medium Sealed Jar (3500)", price: 3500 },
      { name: "Small Sealed Jar", price: 2000 }
    ]
  },
  {
    id: "item-plantain-chips-mega",
    category_id: "cat-jars-crunchies",
    name: "Mega Plantain Chips Jumbo Container",
    description: "Real photo of our jumbo container! Family & party size with our round Oreos Delicacies label. Packed to the brim with crispy seasoned plantain chips.",
    image: "assets/images/real-plantain-chips-mega-9k.jpg",
    is_featured: true,
    is_sold_out: false,
    order: 27,
    variants: [
      { name: "Mega Jumbo Container (9K)", price: 9000 }
    ]
  }
];

export const DEFAULT_GALLERY = [
  {
    id: "gal-1",
    title: "Size 5\" Bento 2-Layer Cake (₦18,000)",
    caption: "Luxury 2-layer bento cake with black ribbon bows, gold pearls, and ruffles.",
    image: "assets/images/real-bento-2layer-18k.jpg",
    category: "Cakes"
  },
  {
    id: "gal-2",
    title: "Deluxe Treat Box with Wine (₦14,000)",
    caption: "Celebration gift box with Veleta wine, iced bento cake, and gourmet sweets.",
    image: "assets/images/real-treat-box-14k.jpg",
    category: "Surprise"
  },
  {
    id: "gal-3",
    title: "Sweetheart Treat Box with Juice (₦13,000)",
    caption: "Pink frosted bento cake with Chivita juice and greeting card.",
    image: "assets/images/real-treat-box-chivita-13k.jpg",
    category: "Surprise"
  },
  {
    id: "gal-4",
    title: "Celebration Snacks Mega Box (₦25,000)",
    caption: "Loaded party box with meat pies, buns, puff-puff, spring rolls, samosas, chicken, and mini cake.",
    image: "assets/images/real-snacks-box-25k.jpg",
    category: "Snacks"
  },
  {
    id: "gal-5",
    title: "Fresh Artisan Banana Bread (₦3,000)",
    caption: "Moist banana loaf topped with raisins and cashew nuts.",
    image: "assets/images/real-banana-bread-3k.jpg",
    category: "Treats"
  },
  {
    id: "gal-6",
    title: "Fresh Uniced Sponge Cakes (₦4,000)",
    caption: "Golden round baked sponge cakes fresh from our oven.",
    image: "assets/images/real-uniced-cake-4k.jpg",
    category: "Cakes"
  },
  {
    id: "gal-7",
    title: "Creamy Milky Stuffed Donuts (₦3,500)",
    caption: "Pillowy donuts stuffed with creamy milk filling and dusted with sweet milk snow.",
    image: "assets/images/real-milky-donut-3500.jpg",
    category: "Treats"
  },
  {
    id: "gal-8",
    title: "Hearty Beef Meat Pies (₦1,200)",
    caption: "Cut open view showing our savory minced beef, carrots, and potatoes filling.",
    image: "assets/images/real-meat-pie-filling-1200.jpg",
    category: "Snacks"
  },
  {
    id: "gal-9",
    title: "Size 6\" Celebration Cake (₦15,000)",
    caption: "'happy birthday Mowa' cake decorated with yellow rosettes and leaf piping.",
    image: "assets/images/real-cake-size6-15k.jpg",
    category: "Cakes"
  },
  {
    id: "gal-10",
    title: "Size 8\" One Layer Cake (₦30,000)",
    caption: "'Happy Birthday Dera' cake with Oreos, pretzels, and chocolate drip.",
    image: "assets/images/real-cake-size8-30k.jpg",
    category: "Cakes"
  },
  {
    id: "gal-11",
    title: "Size 10\" One Layer Cake (₦50,000)",
    caption: "Celebration cake adorned with fresh cherries, pretzels, chocolate drizzle, and rosettes.",
    image: "assets/images/real-cake-size10.jpg",
    category: "Cakes"
  },
  {
    id: "gal-12",
    title: "I Love You Money Box (₦100,000)",
    caption: "Luxury surprise gift with rolled currency notes, rose, love letter, and photo memories.",
    image: "assets/images/real-money-box-100k.jpg",
    category: "Surprise"
  },
  {
    id: "gal-13",
    title: "Hot Air Balloon Treat Box (₦35,000)",
    caption: "Showstopping balloon structure with Eva wine, treats, chocolates, and custom ribbon.",
    image: "assets/images/real-balloon-treat-35k.jpg",
    category: "Surprise"
  },
  {
    id: "gal-14",
    title: "Fresh Greek Fruit Parfait (₦4,000)",
    caption: "Greek yoghurt layered with strawberries, kiwi, and crunchy roasted granola in dome cup.",
    image: "assets/images/real-fruit-parfait-4k.jpg",
    category: "Parfaits"
  },
  {
    id: "gal-15",
    title: "Mini Fruit Parfait (₦2,500)",
    caption: "Convenient snack tub with fruits, yoghurt, and crunchy granola.",
    image: "assets/images/real-mini-parfait-2500.jpg",
    category: "Parfaits"
  },
  {
    id: "gal-16",
    title: "Cake Parfait Glass Cup (₦2,500)",
    caption: "Moist sponge crumble, whipped cream, chocolate layer, and sprinkles.",
    image: "assets/images/real-cake-parfait-2500.jpg",
    category: "Cakes"
  },
  {
    id: "gal-17",
    title: "Gourmet Roasted Peanuts (₦1,000)",
    caption: "Sealed pouch with official Oreos Delicacies label.",
    image: "assets/images/real-peanuts-1k.jpg",
    category: "Jars"
  },
  {
    id: "gal-18",
    title: "Oreofe's Signature Eggroll (₦700)",
    caption: "Abeokuta's famous eggrolls fried golden with savory boiled egg center.",
    image: "assets/images/real-eggroll-700.jpg",
    category: "Signature"
  },
  {
    id: "gal-19",
    title: "Golden Sugar Donuts (₦700)",
    caption: "Pillowy soft donuts dusted with sweet sugar crystals.",
    image: "assets/images/real-donut-700.jpg",
    category: "Treats"
  },
  {
    id: "gal-20",
    title: "Fresh Oven Foil Cake (₦2,500)",
    caption: "Golden loaf cake baked in handy foil tray with red velvet swirl.",
    image: "assets/images/real-foil-cake-2500.jpg",
    category: "Cakes"
  },
  {
    id: "gal-21",
    title: "Bento Box Cake 'I love you' (₦10,000)",
    caption: "Chic white bento cake with black ribbon bows and heart motifs in takeaway clamshell.",
    image: "assets/images/real-bento-cake-10k.jpg",
    category: "Cakes"
  },
  {
    id: "gal-22",
    title: "Bento + Cupcake Combo (₦14,000)",
    caption: "Personalized 'Happy Birthday Babe' bento cake with 2 matching rosette cupcakes.",
    image: "assets/images/real-bento-cupcake.jpg",
    category: "Cakes"
  },
  {
    id: "gal-23",
    title: "Fudgy Chocolate Brownies (₦2,500)",
    caption: "Decadent dark chocolate brownies with crinkle crust, freshly baked in our kitchen.",
    image: "assets/images/real-brownies-2500.jpg",
    category: "Treats"
  },
  {
    id: "gal-24",
    title: "Plantain Chips Medium Jar (₦3,500)",
    caption: "Authentic sealed jar of crispy golden plantain chips with official Oreos Delicacies label.",
    image: "assets/images/real-plantain-chips-3500.jpg",
    category: "Jars"
  },
  {
    id: "gal-25",
    title: "Mega Plantain Chips Container (₦9,000)",
    caption: "Jumbo party-sized container packed with delicious crunchy plantain chips.",
    image: "assets/images/real-plantain-chips-mega-9k.jpg",
    category: "Jars"
  },
  {
    id: "gal-26",
    title: "Fresh Golden Meat Pies (₦1,200)",
    caption: "Flaky golden crust fresh from our oven, generously stuffed with seasoned minced beef.",
    image: "assets/images/real-meat-pie.jpg",
    category: "Snacks"
  },
  {
    id: "gal-27",
    title: "Fresh Oven Cupcakes (₦500)",
    caption: "Soft, golden cupcakes baked daily and hygienically wrapped for instant enjoyment.",
    image: "assets/images/real-cupcakes.jpg",
    category: "Treats"
  }
];

export const DEFAULT_REVIEWS = [
  {
    id: "rev-1",
    customer_name: "Ayomide S.",
    location: "Camp, FUNAAB",
    rating: 5,
    comment: "Oreofe's eggrolls (₦700), meat pies (₦1,200), and fresh fruit parfait (₦4,000) are my absolute favorites! The food is so clean and delicious.",
    date: "2026-09-12",
    is_active: true
  },
  {
    id: "rev-2",
    customer_name: "Mrs. Folashade Adeleke",
    location: "Isolu, Abeokuta",
    rating: 5,
    comment: "The Size 5 Two Layer Cake (₦18,000) with ribbon bows was so neat and elegant! And the ₦14,000 Treat Box made my sister's birthday unforgettable.",
    date: "2026-09-28",
    is_active: true
  },
  {
    id: "rev-3",
    customer_name: "Dera M.",
    location: "Abeokuta",
    rating: 5,
    comment: "The Celebration Snacks Mega Box (₦25,000) was the star of our anniversary party! Fresh meat pies, buns, puff-puff and chicken. 10/10 service!",
    date: "2026-10-02",
    is_active: true
  },
  {
    id: "rev-4",
    customer_name: "Dr. Babatunde K.",
    location: "FUNAAB Staff Quarters",
    rating: 5,
    comment: "The ₦3,500 Milky Donuts and ₦3,000 Banana Bread are our department favorites every Friday. Fresh, soft, and delicious!",
    date: "2026-10-04",
    is_active: true
  }
];

export const DEFAULT_ORDERS = [
  {
    id: "ORD-9485",
    customer_name: "Toluwani Adeyemi",
    customer_phone: "08034567890",
    delivery_area: "Camp",
    delivery_fee: 1000,
    items: [
      { name: "Deluxe Treat Box (Wine & Bento Cake)", variant: "Deluxe Wine & Bento Box Set", quantity: 1, price: 14000 },
      { name: "Oreos Creamy Milky Stuffed Donuts", variant: "Clamshell Pack (3500)", quantity: 1, price: 3500 }
    ],
    subtotal: 17500,
    total: 18500,
    notes: "Please write 'Happy Birthday Sweetheart' on the bento card.",
    status: "pending",
    created_at: "2026-10-19T09:30:00Z"
  },
  {
    id: "ORD-9484",
    customer_name: "Chukwuma Obi",
    customer_phone: "08123456789",
    delivery_area: "Walk-in (Isolu Store)",
    delivery_fee: 0,
    items: [
      { name: "Size 5\" Bento Cake (Two Layer Luxury)", variant: "Size 5\" Two Layer Cake", quantity: 1, price: 18000 },
      { name: "Fresh Greek Fruit Parfait (Regular Cup)", variant: "Regular Parfait Cup (4K)", quantity: 2, price: 4000 }
    ],
    subtotal: 26000,
    total: 26000,
    notes: "Picking up by 4:30 PM. Please include gold candle.",
    status: "confirmed",
    created_at: "2026-10-18T16:15:00Z"
  }
];

export const DEFAULT_ENQUIRIES = [
  {
    id: "ENQ-104",
    customer_name: "Eniola Williams",
    customer_phone: "08198765432",
    event_type: "Birthday Celebration",
    event_date: "2026-11-20",
    guest_count: "50 guests",
    details: "Need the Size 5 Two Layer cake (₦18,000), 20 Fruit Parfaits (₦4,000 each) and 30 meat pies.",
    status: "pending",
    created_at: "2026-10-18T11:00:00Z"
  }
];
