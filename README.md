# OREOS DELICACIES 🧁

> **"Exceptional Cake and Pastries"**  
> Founded & Crafted by **Oreofe Abisola** — Abeokuta, Ogun State, Nigeria.

A complete, mobile-first, professional web application with a real-time ordering system and secure staff admin portal for **OREOS DELICACIES**, famous for her signature golden eggrolls, bespoke celebration cakes, milky donuts, fruit parfaits, and crunchy jarred treats.

---

## 🌟 Key Features

### 1. Public Storefront (Mobile-First Single Page Application)
- **Sticky Glassmorphism Header:** Features the luxury OREOS DELICACIES logo, quick navigation links, shopping cart badge with live count, and a real-time Nigerian opening hours badge (`Africa/Lagos` timezone).
- **Hero Section:** Prominent headline *"Exceptional Cake and Pastries"*, background bakery showcase, and direct *"Order on WhatsApp"* and *"View Menu"* buttons.
- **Signature Highlight (Oreofe's Famous Eggroll):** Dedicated spotlight on Abeokuta's favorite eggroll with golden pastry crust, seasoned boiled egg center, pack size selector (Single, Pack of 3, Pack of 5, Party Pack of 10), and one-click quick ordering.
- **Interactive Menu Catalog:**
  - Category filters: *Eggrolls and Snacks*, *Cakes*, *Donuts and Sweet Treats*, *Parfaits*, *Jars and Crunchies*.
  - Live instant search.
  - Multi-size variant support for every item (e.g. 6", 8", 10", 12", 14" cake sizes, small/medium/large jars) with dynamic price calculation in Nigerian Naira (₦).
  - Status badges (*Signature*, *Popular*, *Sold Out Today*).
- **How to Order in 3 Simple Steps:** Clear, customer-friendly visual guide.
- **Delivery Areas & Fees Table:** Live delivery pricing pulled from database (Walk-in Free, Isolu ₦400, Accord ₦500, Oluwo ₦500, Zoo ₦500, Harmony ₦700, School Gate ₦700, Agbede ₦800, Kofesu ₦800, Camp ₦1,000).
- **Event & Custom Cake Enquiry Form:** Specialized booking form for birthdays, weddings, bridal showers, and corporate finger food platters.
- **About Us:** Inspiring story of Oreofe Abisola, her culinary journey, and her high hygienic standards.
- **Pastry Gallery & Lightbox:** Image grid with fullscreen zoom modal.
- **Customer Testimonials:** Star ratings and genuine feedback from Abeokuta foodies and students.
- **Store Location & Google Map:** Embedded Google Map of Isolu near FUNAAB with interactive *"Get Directions"* button, direct phone call, WhatsApp, and TikTok links.
- **Cart & WhatsApp Checkout:**
  - Drawer slide-out on both mobile and desktop.
  - Live subtotal, delivery fee calculation based on selected area, and grand total.
  - Generates a pre-formatted WhatsApp message dispatched to `2347033396558`.
  - Automatically records order in the database with status `pending`.
- **Floating WhatsApp Button:** Pulsating quick-access button with live online status.

### 2. Secure Admin Portal (`/admin.html`)
- **Protected Access:** Single owner/admin account with email & password login and forgot password modal. No public sign-up.
- **Live Dashboard:** Quick metrics for Total Items, Sold Out Items, Pending Orders, Custom Enquiries, and Total Revenue.
- **Menu Manager:** Add, edit, and delete items. Upload photos (from device as Base64 or image URL), adjust any variant price, toggle *"Sold out / Available"*, and reorder items.
- **Category Manager:** Add, rename, or delete categories.
- **Delivery Fee Manager:** Add new areas or update fees with instant reflection on the public site.
- **Orders & Enquiries Tracker:** Filter WhatsApp orders and event enquiries by status (`pending`, `confirmed`, `delivered`, `cancelled`) with customer contact details and quick status updates.
- **Gallery & Reviews Managers:** Manage showcase photos and customer testimonials.
- **Site Settings & Cloud Sync:** Update phone, WhatsApp number, opening hours, TikTok, and about text. Optional Supabase cloud synchronization and JSON backup export.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** HTML5, Modern Modular JavaScript (ES Modules), Tailwind CSS (responsive design system with custom brand tokens).
- **Typography:** Playfair Display (Luxury Serif Headings), Poppins (Accents), Inter (Clean Body Text).
- **Icons:** Phosphor Icons (Duotone, Bold, Regular, Fill).
- **Data Layer (`js/store.js`):** Reactive architecture supporting instant local persistence (`localStorage`) out of the box, with optional real-time cloud sync to **Supabase**.
- **Real-time Timezone:** Evaluated using `Intl.DateTimeFormat` with Nigerian timezone (`Africa/Lagos`) to show accurate store open/closed states.

---

## 🚀 Running Locally

To run the project locally using Python's built-in HTTP server:

```bash
# Navigate to the project directory
cd oreos-delicacies

# Start the local development server on port 8000
python -m http.server 8000
```

Now open your browser:
- **Public Website:** [http://localhost:8000/index.html](http://localhost:8000/index.html)
- **Staff Admin Portal:** [http://localhost:8000/admin.html](http://localhost:8000/admin.html)

---

## 🔐 Admin Portal Credentials

- **Default Email:** `admin@oreosdelicacies.com`
- **Default Password:** `OreosAdmin2025!`
- *(Credentials can be customized or reset inside the portal)*

---

## ☁️ Setting Up Supabase Database (Optional)

OREOS DELICACIES works immediately in offline/local storage mode without any configuration. To connect a Supabase cloud database:

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Open `supabase/schema.sql` from this repository, copy all contents, and click **Run**.
4. Copy your **Project URL** and **Anon Public Key** from *Settings > API*.
5. In the OREOS DELICACIES Admin Portal, go to **Site Settings > Supabase Database Sync**, paste the URL and Key, and click **Test Connection** and **Save**.
All menu items, prices, delivery rates, and orders will now sync to Supabase!

---

## 📞 Brand Contacts

- **Phone:** 09154667248
- **WhatsApp:** 07033396558 (International: +2347033396558)
- **TikTok:** [@oreosdelicacies](https://www.tiktok.com/@oreosdelicacies)
- **Address:** Isolu, near Cornerstone Gym Center and Isolu Car Wash, FUNAAB, Abeokuta, Ogun State
