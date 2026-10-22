/**
 * OREOS DELICACIES - Pastry Empire Style Application Script
 * Handles: Hero Slideshow, Carousel, Products, Delivery, Gallery, Reviews, Enquiry
 */

import { store } from './store.js';
import { cart } from './cart.js';

// ========================================
// 1. HERO SLIDESHOW
// ========================================
function initHeroSlideshow() {
  const slides = document.querySelectorAll('.hero-slideshow .slide');
  if (slides.length === 0) return;
  
  let currentSlide = 0;
  
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
  }
  
  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }, 5000);
}

// ========================================
// 2. THUMBNAIL CAROUSEL
// ========================================
function initCarousel() {
  const track = document.getElementById('carousel-track');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  
  if (!track || !prevBtn || !nextBtn) return;
  
  let scrollAmount = 0;
  const itemWidth = 116; // 100px + 16px gap
  
  prevBtn.addEventListener('click', () => {
    scrollAmount = Math.max(0, scrollAmount - itemWidth * 3);
    track.style.transform = `translateX(-${scrollAmount}px)`;
  });
  
  nextBtn.addEventListener('click', () => {
    const maxScroll = track.scrollWidth - track.parentElement.offsetWidth;
    scrollAmount = Math.min(maxScroll, scrollAmount + itemWidth * 3);
    track.style.transform = `translateX(-${scrollAmount}px)`;
  });

  // Auto-scroll carousel
  let autoScrollInterval = setInterval(() => {
    const maxScroll = track.scrollWidth - track.parentElement.offsetWidth;
    scrollAmount += itemWidth;
    if (scrollAmount > maxScroll) scrollAmount = 0;
    track.style.transform = `translateX(-${scrollAmount}px)`;
  }, 4000);

  // Pause on hover
  track.parentElement.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
  track.parentElement.addEventListener('mouseleave', () => {
    autoScrollInterval = setInterval(() => {
      const maxScroll = track.scrollWidth - track.parentElement.offsetWidth;
      scrollAmount += itemWidth;
      if (scrollAmount > maxScroll) scrollAmount = 0;
      track.style.transform = `translateX(-${scrollAmount}px)`;
    }, 4000);
  });

  // Lightbox on thumbnail click
  const carouselItems = document.querySelectorAll('.carousel-item');
  carouselItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) openLightbox(img.src);
    });
  });
}

// ========================================
// 3. FEATURED PRODUCTS GRID
// ========================================
// 3. FEATURED PRODUCTS GRID (with + / − Stepper & Add to Cart)
// ========================================
function renderProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  
  const items = store.getMenuItems();
  
  if (items.length === 0) return;

  // Show featured items first, then others
  const sorted = [...items].sort((a, b) => {
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;
    return (a.order || 99) - (b.order || 99);
  });

  const cartItems = cart.getItems();

  grid.innerHTML = sorted.map(item => {
    const hasMultipleVariants = item.variants && item.variants.length > 1;
    const firstVariant = item.variants?.[0] || { name: 'Standard', price: 0 };
    const price = formatPrice(firstVariant.price);
    const isSoldOut = item.is_sold_out;

    // Calculate how many of this item are currently in the cart
    const inCartCount = cartItems
      .filter(ci => ci.itemId === item.id)
      .reduce((sum, ci) => sum + (ci.quantity || 1), 0);
    
    const badge = item.is_signature
      ? '<span class="product-card-badge"><i class="ph-fill ph-fire" style="color:#FFA07A; margin-right:3px;"></i> Signature</span>'
      : item.is_featured
        ? '<span class="product-card-badge"><i class="ph-fill ph-star" style="color:#F5A623; margin-right:3px;"></i> Popular</span>'
        : isSoldOut
          ? '<span class="product-card-badge" style="background:#888;">Sold Out</span>'
          : '';

    const stars = `
      <div class="product-card-stars">
        ${Array(5).fill(0).map(() => `<i class="ph-fill ph-star" style="color:#F5A623; font-size:12px;"></i>`).join('')}
      </div>
    `;

    // Variant selector HTML
    let variantHtml = '';
    if (hasMultipleVariants) {
      variantHtml = `
        <div class="product-variant-wrapper">
          <label for="variant-select-${item.id}" class="sr-only">Select size</label>
          <select class="product-variant-select" id="variant-select-${item.id}" data-item-id="${item.id}">
            ${item.variants.map((v, i) => `
              <option value="${v.name}" data-price="${v.price}" ${i === 0 ? 'selected' : ''}>
                ${v.name} - ${formatPrice(v.price)}
              </option>
            `).join('')}
          </select>
        </div>
      `;
    } else {
      variantHtml = `
        <div class="product-variant-wrapper">
          <span class="product-single-variant">${firstVariant.name}</span>
        </div>
      `;
    }

    return `
      <div class="product-card" id="product-${item.id}" data-item-id="${item.id}">
        <div class="product-card-image">
          <img src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.src='assets/images/real-cake-size10.jpg'">
          ${badge}
        </div>
        <div class="product-card-info">
          <div>
            <h3>${item.name}</h3>
            <div class="product-category">${getCategoryName(item.category_id)}</div>
            ${stars}
            ${variantHtml}
          </div>
          <div class="product-card-bottom">
            <div class="product-price-row">
              <div class="product-price-box">
                <span class="product-price-label">Price</span>
                <span class="product-price" id="price-display-${item.id}">${price}</span>
              </div>
              <div class="card-in-cart-indicator">
                <span class="in-cart-pill ${inCartCount > 0 ? '' : 'hidden'}" id="in-cart-pill-${item.id}">
                  <i class="ph-bold ph-check" style="font-size:0.75rem; margin-right:2px;"></i> <span id="in-cart-qty-${item.id}">${inCartCount}</span> in Cart
                </span>
              </div>
            </div>

            <div class="product-card-actions-row">
              <div class="card-stepper" title="Choose quantity to add or reduce">
                <button 
                  type="button" 
                  class="card-step-btn card-minus-btn" 
                  data-item-id="${item.id}" 
                  aria-label="Decrease quantity" 
                  title="Reduce quantity"
                  ${isSoldOut ? 'disabled' : ''}
                ><i class="ph-bold ph-minus"></i></button>
                <span class="card-qty-display" id="card-qty-${item.id}" data-item-id="${item.id}">1</span>
                <button 
                  type="button" 
                  class="card-step-btn card-plus-btn" 
                  data-item-id="${item.id}" 
                  aria-label="Increase quantity" 
                  title="Increase quantity"
                  ${isSoldOut ? 'disabled' : ''}
                ><i class="ph-bold ph-plus"></i></button>
              </div>

              <button 
                type="button" 
                class="product-add-btn ${isSoldOut ? 'disabled' : ''}" 
                data-item-id="${item.id}"
                ${isSoldOut ? 'disabled' : ''}
                title="${isSoldOut ? 'Sold Out' : `Add ${item.name} to Cart`}"
              >
                <i class="ph-bold ph-shopping-cart" style="font-size:0.95rem; margin-right:3px;"></i>
                <span class="btn-text">${isSoldOut ? 'Sold Out' : 'Add to Cart'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Attach Variant Selector change listeners (updates dynamic price display)
  grid.querySelectorAll('.product-variant-select').forEach(select => {
    select.addEventListener('change', (e) => {
      const itemId = e.target.getAttribute('data-item-id');
      const selectedOption = e.target.options[e.target.selectedIndex];
      const newPrice = selectedOption ? Number(selectedOption.getAttribute('data-price')) : 0;
      const priceDisplay = document.getElementById(`price-display-${itemId}`);
      if (priceDisplay && !isNaN(newPrice)) {
        priceDisplay.textContent = formatPrice(newPrice);
      }
    });
  });

  // Attach Stepper Minus (-) Button Click Listeners (reduces pending qty or in-cart qty)
  grid.querySelectorAll('.card-minus-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const itemId = e.currentTarget.getAttribute('data-item-id');
      const item = store.getMenuItems().find(i => i.id === itemId);
      if (!item || item.is_sold_out) return;

      const qtyDisplay = document.getElementById(`card-qty-${itemId}`);
      let currentQty = parseInt(qtyDisplay?.textContent || '1', 10);

      if (currentQty > 1) {
        currentQty -= 1;
        if (qtyDisplay) qtyDisplay.textContent = currentQty.toString();
      } else {
        // If pending qty is at 1, check if item exists in cart to allow direct reduction
        const variantSelect = document.getElementById(`variant-select-${itemId}`);
        let variantName = '';
        if (variantSelect) {
          variantName = variantSelect.value;
        } else if (item.variants && item.variants.length > 0) {
          variantName = item.variants[0].name;
        } else {
          variantName = 'Standard';
        }

        const cartItemId = `${item.id}__${variantName}`;
        const existingInCart = cart.getItems().find(ci => ci.cartItemId === cartItemId);
        
        if (existingInCart) {
          cart.updateQuantity(cartItemId, -1);
          showToast(`🛒 Reduced 1× ${item.name} (${variantName}) in your cart.`);
          syncAllCardsInCartBadges();
        } else {
          showToast('Quantity is at minimum (1).');
        }
      }
    });
  });

  // Attach Stepper Plus (+) Button Click Listeners (increases quantity)
  grid.querySelectorAll('.card-plus-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const itemId = e.currentTarget.getAttribute('data-item-id');
      const item = store.getMenuItems().find(i => i.id === itemId);
      if (!item || item.is_sold_out) return;

      const qtyDisplay = document.getElementById(`card-qty-${itemId}`);
      let currentQty = parseInt(qtyDisplay?.textContent || '1', 10);

      if (currentQty < 99) {
        currentQty += 1;
        if (qtyDisplay) qtyDisplay.textContent = currentQty.toString();
      }
    });
  });

  // Attach Add to Cart button click listeners
  grid.querySelectorAll('.product-add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const button = e.currentTarget;
      const itemId = button.getAttribute('data-item-id');
      const item = store.getMenuItems().find(i => i.id === itemId);
      if (!item || item.is_sold_out) return;

      const qtyDisplay = document.getElementById(`card-qty-${itemId}`);
      const quantityToAdd = Math.max(1, parseInt(qtyDisplay?.textContent || '1', 10));

      const variantSelect = document.getElementById(`variant-select-${itemId}`);
      let variantName = '';
      if (variantSelect) {
        variantName = variantSelect.value;
      } else if (item.variants && item.variants.length > 0) {
        variantName = item.variants[0].name;
      } else {
        variantName = 'Standard';
      }

      // Add to cart with chosen quantity
      cart.addItem(item, variantName, quantityToAdd);

      // Button micro-animation feedback
      const btnText = button.querySelector('.btn-text');
      const originalText = btnText ? btnText.textContent : 'Add to Cart';
      button.classList.add('added-success');
      if (btnText) btnText.textContent = `✓ Added ${quantityToAdd}!`;
      
      setTimeout(() => {
        button.classList.remove('added-success');
        if (btnText) btnText.textContent = originalText;
      }, 1200);

      // Reset card pending qty back to 1
      if (qtyDisplay) qtyDisplay.textContent = '1';

      syncAllCardsInCartBadges();

      showToast(`🛒 Added ${quantityToAdd}× ${item.name} (${variantName}) to your cart!`);
    });
  });
}

/**
 * Synchronize live in-cart quantity badges on all product cards
 */
function syncAllCardsInCartBadges() {
  const items = cart.getItems();
  const allCards = document.querySelectorAll('.product-card');

  allCards.forEach(card => {
    const itemId = card.getAttribute('data-item-id');
    if (!itemId) return;

    const inCartPill = document.getElementById(`in-cart-pill-${itemId}`);
    const inCartQty = document.getElementById(`in-cart-qty-${itemId}`);

    // Sum all variants for this item
    const totalQty = items
      .filter(ci => ci.itemId === itemId)
      .reduce((sum, ci) => sum + (ci.quantity || 1), 0);

    if (inCartPill && inCartQty) {
      if (totalQty > 0) {
        inCartQty.textContent = totalQty.toString();
        inCartPill.classList.remove('hidden');
      } else {
        inCartPill.classList.add('hidden');
      }
    }
  });
}

function getCategoryName(categoryId) {
  const categories = store.getCategories();
  const cat = categories.find(c => c.id === categoryId);
  return cat ? cat.name : '';
}

function formatPrice(amount) {
  return '₦' + new Intl.NumberFormat('en-NG').format(amount);
}

// ========================================
// 5. GALLERY GRID
// ========================================
function renderGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;
  
  // Use all product images as gallery items
  const images = [
    { src: 'assets/images/real-cake-size10.jpg', alt: 'Celebration Cake' },
    { src: 'assets/images/real-bento-2layer-18k.jpg', alt: 'Bento Cake' },
    { src: 'assets/images/real-eggroll-700.jpg', alt: 'Signature Eggroll' },
    { src: 'assets/images/real-meat-pie.jpg', alt: 'Golden Meat Pie' },
    { src: 'assets/images/real-cupcakes.jpg', alt: 'Decorated Cupcakes' },
    { src: 'assets/images/real-donut-700.jpg', alt: 'Milky Donut' },
    { src: 'assets/images/real-treat-box-14k.jpg', alt: 'Luxury Treat Box' },
    { src: 'assets/images/real-cake-size8-30k.jpg', alt: '8-inch Celebration Cake' },
    { src: 'assets/images/real-money-box-100k.jpg', alt: 'Money Box Cake' },
    { src: 'assets/images/real-fruit-parfait-4k.jpg', alt: 'Fruit Parfait' },
    { src: 'assets/images/real-brownies-2500.jpg', alt: 'Fudgy Brownies' },
    { src: 'assets/images/real-plantain-chips-jar.jpg', alt: 'Plantain Chips' },
    { src: 'assets/images/hero-spread.jpg', alt: 'Fresh Pastries' },
    { src: 'assets/images/real-snacks-box-25k.jpg', alt: 'Snacks Box' },
    { src: 'assets/images/real-bento-cake-10k.jpg', alt: 'Bento Cake' },
    { src: 'assets/images/real-foil-cake-2500.jpg', alt: 'Foil Cake' },
  ];
  
  grid.innerHTML = images.map(img => `
    <div class="gallery-item" onclick="window.__openLightbox('${img.src}')">
      <img src="${img.src}" alt="${img.alt}" loading="lazy">
    </div>
  `).join('');
}

// ========================================
// 6. TESTIMONIALS / CUSTOMER REVIEWS MARQUEE
// ========================================
function renderReviews() {
  const grid = document.getElementById('reviews-grid');
  if (!grid) return;
  
  const REVIEWS_KEY = 'oreos_reviews_v6';
  const savedReviews = store.get(REVIEWS_KEY, []);
  
  const baseReviews = (savedReviews && savedReviews.length > 0) ? savedReviews : getStaticReviewsList();

  // Duplicate for seamless infinite loop in marquee
  const marqueeReviews = [...baseReviews, ...baseReviews];
  
  grid.innerHTML = marqueeReviews.map(review => {
    const name = review.customer_name || review.name || review.author || 'Happy Customer';
    const text = review.comment || review.text || '';
    const location = review.location || 'Abeokuta';
    const rating = review.rating || 5;
    const initial = name.trim().charAt(0).toUpperCase() || 'O';

    const starsHtml = Array(rating).fill(0)
      .map(() => '<i class="ph-fill ph-star" style="color:#F5A623; font-size:13px;"></i>')
      .join('');

    return `
      <div class="testimonial-card">
        <span class="quote-icon"><i class="ph-duotone ph-quotes"></i></span>
        <div class="stars">${starsHtml}</div>
        <p>"${text}"</p>
        <div class="author">
          <div class="author-avatar">${initial}</div>
          <div class="author-info">
            <strong>${name}</strong>
            <span>${location}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Mobile Touch Pause & Resume
  const wrapper = document.getElementById('testimonials-marquee-wrapper');
  if (wrapper) {
    wrapper.addEventListener('touchstart', () => {
      grid.style.animationPlayState = 'paused';
    }, { passive: true });
    wrapper.addEventListener('touchend', () => {
      grid.style.animationPlayState = 'running';
    }, { passive: true });
  }
}

function getStaticReviewsList() {
  return [
    {
      name: "Ayomide S.",
      location: "Camp, FUNAAB",
      rating: 5,
      text: "Oreofe's eggrolls (₦700), meat pies (₦1,200), and fresh fruit parfait (₦4,000) are my absolute favorites! The food is so clean and delicious."
    },
    {
      name: "Mrs. Folashade Adeleke",
      location: "Isolu, Abeokuta",
      rating: 5,
      text: "The Size 5 Two Layer Cake (₦18,000) with ribbon bows was so neat and elegant! And the ₦14,000 Treat Box made my sister's birthday unforgettable."
    },
    {
      name: "Dera M.",
      location: "Abeokuta",
      rating: 5,
      text: "The Celebration Snacks Mega Box (₦25,000) was the star of our anniversary party! Fresh meat pies, buns, puff-puff and chicken. 10/10 service!"
    },
    {
      name: "Dr. Babatunde K.",
      location: "FUNAAB Staff Quarters",
      rating: 5,
      text: "The ₦3,500 Milky Donuts and ₦3,000 Banana Bread are our department favorites every Friday. Fresh, soft, and delicious!"
    },
    {
      name: "Temitope A.",
      location: "Camp, FUNAAB",
      rating: 5,
      text: "The eggrolls are incredible! Best I've ever tasted in Abeokuta. Crispy on the outside, perfect seasoning inside. My hostel mates are addicted!"
    },
    {
      name: "Bola Ogunmola",
      location: "Isolu, Abeokuta",
      rating: 5,
      text: "Ordered a 3-tier birthday cake and it was absolutely stunning! The taste was even better than it looked. Oreofe is truly gifted."
    },
    {
      name: "Chioma Eze",
      location: "Harmony, FUNAAB",
      rating: 5,
      text: "The treat box I ordered for Valentine's was breathtaking. Beautiful packaging, delicious pastries. My girlfriend was so impressed. Thank you Oreos!"
    },
    {
      name: "Adewale K.",
      location: "Camp, Abeokuta",
      rating: 5,
      text: "Fast delivery to Camp, fresh donuts that melted in my mouth. The milky donut pack was perfect for our hostel movie night. Will definitely order again!"
    }
  ];
}

// ========================================
// 7. LIGHTBOX
// ========================================
function openLightbox(src) {
  const modal = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  if (!modal || !img) return;
  
  img.src = src;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const modal = document.getElementById('lightbox-modal');
  if (!modal) return;
  
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Expose to global for inline handlers
window.__openLightbox = openLightbox;

// ========================================
// 8. ENQUIRY FORM -> WHATSAPP
// ========================================
function initEnquiryForm() {
  const form = document.getElementById('event-enquiry-form');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = form.querySelector('#enquiry-name')?.value || '';
    const phone = form.querySelector('#enquiry-phone')?.value || '';
    const eventType = form.querySelector('#enquiry-event')?.value || '';
    const details = form.querySelector('#enquiry-details')?.value || '';
    
    const message = `🎂 *Custom Cake Enquiry - OREOS DELICACIES*\n\n👤 Name: ${name}\n📞 Phone: ${phone}\n🎉 Event: ${eventType}\n📝 Details: ${details}\n\nSent from oreosdelicacies.com`;
    
    const whatsappUrl = `https://wa.me/2347033396558?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    showToast('✅ Opening WhatsApp with your enquiry...');
    form.reset();
  });
}

// ========================================
// 9. MOBILE MENU
// ========================================
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('mobile-menu-close');
  const menu = document.getElementById('mobile-menu');
  if (!menu) return;
  
  if (btn) {
    btn.addEventListener('click', () => {
      menu.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      menu.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
  
  // Close on link click
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// ========================================
// 10. GOODIES BAG / BULK ORDER DRAWER CONTROLLER
// ========================================
function initCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  const closeBtn = document.getElementById('close-cart-btn');
  const emptyBrowseBtn = document.getElementById('empty-browse-btn');
  const areaSelect = document.getElementById('cart-area-select');
  const checkoutBtn = document.getElementById('cart-checkout-btn');
  const clearBtn = document.getElementById('cart-clear-btn');
  const itemsList = document.getElementById('cart-items-list');
  const newOrderBtn = document.getElementById('confirm-new-order-btn');

  function openCartDrawer() {
    if (!drawer || !backdrop) return;
    drawer.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    renderCartDrawerUI();
  }

  function closeCartDrawer() {
    if (!drawer || !backdrop) return;
    drawer.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Expose to global window
  window.__openCartDrawer = openCartDrawer;
  window.__closeCartDrawer = closeCartDrawer;

  // Triggers
  document.getElementById('cart-btn')?.addEventListener('click', openCartDrawer);
  document.getElementById('mobile-cart-trigger')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('mobile-menu')?.classList.remove('active');
    openCartDrawer();
  });
  document.getElementById('mobile-bag-trigger')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('mobile-menu')?.classList.remove('active');
    openCartDrawer();
  });
  document.getElementById('hero-cart-trigger')?.addEventListener('click', openCartDrawer);
  document.getElementById('hero-bag-trigger')?.addEventListener('click', openCartDrawer);
  document.getElementById('footer-cart-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    openCartDrawer();
  });
  document.getElementById('floating-cart-trigger')?.addEventListener('click', openCartDrawer);

  closeBtn?.addEventListener('click', closeCartDrawer);
  backdrop?.addEventListener('click', closeCartDrawer);
  emptyBrowseBtn?.addEventListener('click', () => {
    closeCartDrawer();
    document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' });
  });

  // Populate Delivery Areas dropdown once
  populateCartAreas();

  // On Area Change
  areaSelect?.addEventListener('change', (e) => {
    cart.setSelectedArea(e.target.value);
    renderCartDrawerUI();
  });

  // Clear Cart
  clearBtn?.addEventListener('click', () => {
    cart.clearCart();
    showToast('Your shopping cart has been cleared.');
  });

  // Quantity Stepper and Item Deletion via Event Delegation
  itemsList?.addEventListener('click', (e) => {
    const stepBtn = e.target.closest('.cart-step-btn');
    if (stepBtn) {
      const cartId = stepBtn.getAttribute('data-cart-id');
      const delta = parseInt(stepBtn.getAttribute('data-delta'), 10) || 0;
      cart.updateQuantity(cartId, delta);
      return;
    }

    const deleteBtn = e.target.closest('.cart-item-delete');
    if (deleteBtn) {
      const cartId = deleteBtn.getAttribute('data-cart-id');
      cart.removeItem(cartId);
      showToast('Item removed from cart.');
      return;
    }
  });

  // Checkout Button (Validates & Dispatches to WhatsApp)
  checkoutBtn?.addEventListener('click', () => {
    const nameInput = document.getElementById('cart-customer-name');
    const phoneInput = document.getElementById('cart-customer-phone');
    const notesInput = document.getElementById('cart-customer-notes');

    const name = nameInput?.value || '';
    const phone = phoneInput?.value || '';
    const notes = notesInput?.value || '';

    if (!name.trim()) {
      showToast('⚠️ Please enter your full name for the order.');
      nameInput?.focus();
      return;
    }

    if (!phone.trim()) {
      showToast('⚠️ Please enter your phone / WhatsApp number.');
      phoneInput?.focus();
      return;
    }

    try {
      const result = cart.processWhatsAppOrder(name, phone, notes);

      // Switch to Confirmation Screen
      const activeView = document.getElementById('cart-active-view');
      const confirmationView = document.getElementById('cart-confirmation-view');
      const cartFooter = document.getElementById('cart-footer');

      if (activeView) activeView.classList.add('hidden');
      if (cartFooter) cartFooter.classList.add('hidden');
      if (confirmationView) confirmationView.classList.remove('hidden');

      // Fill in Confirmation details
      const confirmOrderId = document.getElementById('confirm-order-id');
      const confirmName = document.getElementById('confirm-customer-name');
      const confirmPhone = document.getElementById('confirm-customer-phone');
      const confirmArea = document.getElementById('confirm-area-name');
      const confirmFee = document.getElementById('confirm-delivery-fee');
      const confirmNotes = document.getElementById('confirm-address-notes');
      const confirmTotal = document.getElementById('confirm-total-amount');
      const confirmItemsList = document.getElementById('confirm-items-list');
      const reopenBtn = document.getElementById('confirm-reopen-whatsapp-btn');

      if (confirmOrderId) confirmOrderId.textContent = `Order #${result.order.id}`;
      if (confirmName) confirmName.textContent = result.customerName;
      if (confirmPhone) confirmPhone.textContent = result.customerPhone;
      if (confirmArea) confirmArea.textContent = result.area.name;
      if (confirmFee) confirmFee.textContent = result.deliveryFee === 0 ? 'FREE (Store Pickup)' : formatPrice(result.deliveryFee);
      if (confirmNotes) confirmNotes.textContent = result.customerNotes || 'None specified';
      if (confirmTotal) confirmTotal.textContent = formatPrice(result.total);

      if (confirmItemsList) {
        confirmItemsList.innerHTML = result.items.map(item => `
          <div class="confirm-item-row">
            <span>${item.quantity}× ${item.name} (${item.variant})</span>
            <strong>${formatPrice(item.price * item.quantity)}</strong>
          </div>
        `).join('');
      }

      if (reopenBtn) {
        reopenBtn.href = result.whatsappUrl;
      }

      // Open WhatsApp in new tab
      window.open(result.whatsappUrl, '_blank');
      showToast('🎉 Bulk order placed! Opening WhatsApp with your order...');
    } catch (err) {
      showToast(`⚠️ ${err.message}`);
    }
  });

  // Start New Order Button on Confirmation Screen
  newOrderBtn?.addEventListener('click', () => {
    const activeView = document.getElementById('cart-active-view');
    const confirmationView = document.getElementById('cart-confirmation-view');
    if (confirmationView) confirmationView.classList.add('hidden');
    if (activeView) activeView.classList.remove('hidden');
    
    // Clear inputs
    const nameInput = document.getElementById('cart-customer-name');
    const phoneInput = document.getElementById('cart-customer-phone');
    const notesInput = document.getElementById('cart-customer-notes');
    if (nameInput) nameInput.value = '';
    if (phoneInput) phoneInput.value = '';
    if (notesInput) notesInput.value = '';

    renderCartDrawerUI();
    closeCartDrawer();
  });
}

function populateCartAreas() {
  const select = document.getElementById('cart-area-select');
  if (!select) return;

  const areas = store.getDeliveryAreas();
  select.innerHTML = areas.map(area => {
    const feeText = area.fee === 0 ? 'FREE Store Pickup' : `₦${new Intl.NumberFormat('en-NG').format(area.fee)}`;
    return `
      <option value="${area.id}">
        ${area.name} — ${feeText} (${area.time_estimate || '20-40 mins'})
      </option>
    `;
  }).join('');

  select.value = cart.selectedAreaId || areas[0]?.id;
}

function renderCartDrawerUI() {
  const items = cart.getItems();
  const count = cart.getItemCount();
  const subtotal = cart.getSubtotal();
  const deliveryFee = cart.getDeliveryFee();
  const grandTotal = cart.getTotal();
  const selectedArea = cart.getSelectedArea();

  // Badges update
  const badges = [
    document.getElementById('cart-count'),
    document.getElementById('cart-count-inline'),
    document.getElementById('mobile-cart-count'),
    document.getElementById('hero-cart-count'),
    document.getElementById('floating-item-count')
  ];

  badges.forEach(badge => {
    if (!badge) return;
    badge.textContent = count.toString();
    if (badge.id === 'floating-item-count') {
      badge.textContent = `${count} ${count === 1 ? 'item' : 'items'}`;
    }
    if (badge.id === 'cart-count') {
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  });

  // Floating Cart Bar at bottom
  const floatingBar = document.getElementById('floating-cart-bar');
  const floatingTotal = document.getElementById('floating-total-amount');
  if (floatingBar) {
    if (count > 0) {
      floatingBar.classList.add('active');
      document.body.classList.add('has-floating-cart');
      if (floatingTotal) floatingTotal.textContent = formatPrice(subtotal);
    } else {
      floatingBar.classList.remove('active');
      document.body.classList.remove('has-floating-cart');
    }
  }

  // Empty state vs Loaded state
  const emptyState = document.getElementById('cart-empty-state');
  const loadedContent = document.getElementById('cart-content-loaded');
  const footer = document.getElementById('cart-footer');

  if (count === 0) {
    emptyState?.classList.remove('hidden');
    loadedContent?.classList.add('hidden');
    footer?.classList.add('hidden');
  } else {
    emptyState?.classList.add('hidden');
    loadedContent?.classList.remove('hidden');
    footer?.classList.remove('hidden');

    // Render items list
    const itemsList = document.getElementById('cart-items-list');
    if (itemsList) {
      itemsList.innerHTML = items.map(item => `
        <div class="cart-item-card" data-cart-id="${item.cartItemId}">
          <img src="${item.image || 'assets/images/real-cake-size10.jpg'}" alt="${item.name}" class="cart-item-thumb" onerror="this.src='assets/images/real-cake-size10.jpg'">
          <div class="cart-item-info">
            <h4 class="cart-item-name">${item.name}</h4>
            <div class="cart-item-variant">${item.variantName}</div>
            <div class="cart-item-pricing">${formatPrice(item.unitPrice * item.quantity)} <small>(${formatPrice(item.unitPrice)} ea)</small></div>
          </div>
          <div class="cart-item-stepper">
            <button type="button" class="stepper-btn cart-step-btn" data-cart-id="${item.cartItemId}" data-delta="-1" aria-label="Decrease quantity">
              <i class="ph-bold ph-minus"></i>
            </button>
            <span class="stepper-qty">${item.quantity}</span>
            <button type="button" class="stepper-btn cart-step-btn" data-cart-id="${item.cartItemId}" data-delta="1" aria-label="Increase quantity">
              <i class="ph-bold ph-plus"></i>
            </button>
          </div>
          <button type="button" class="cart-item-delete" data-cart-id="${item.cartItemId}" title="Remove ${item.name}">
            <i class="ph-bold ph-trash" style="font-size:1.1rem;"></i>
          </button>
        </div>
      `).join('');
    }

    // Subtotal strip
    const subtotalDisplay = document.getElementById('cart-subtotal-display');
    if (subtotalDisplay) subtotalDisplay.textContent = formatPrice(subtotal);

    // Delivery Area banner
    const bannerFee = document.getElementById('banner-area-fee');
    const bannerTime = document.getElementById('banner-area-time');
    if (bannerFee) {
      bannerFee.textContent = deliveryFee === 0 ? 'Fee: FREE Store Pickup' : `Fee: ${formatPrice(deliveryFee)}`;
    }
    if (bannerTime) {
      bannerTime.textContent = `Estimated arrival: ${selectedArea.time_estimate || '20 - 40 mins'}`;
    }

    // Summary lines
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryFee = document.getElementById('summary-delivery-fee');
    const summaryGrandTotal = document.getElementById('summary-grand-total');
    const summaryCount = document.getElementById('summary-item-count');
    const checkoutLabel = document.getElementById('checkout-btn-label');

    if (summarySubtotal) summarySubtotal.textContent = formatPrice(subtotal);
    if (summaryFee) summaryFee.textContent = deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee);
    if (summaryGrandTotal) summaryGrandTotal.textContent = formatPrice(grandTotal);
    if (summaryCount) summaryCount.textContent = `(${count} ${count === 1 ? 'treat' : 'treats'})`;
    if (checkoutLabel) {
      checkoutLabel.textContent = `Send Bulk Order on WhatsApp (${count} items • ${formatPrice(grandTotal)})`;
    }
  }

  // Always sync in-cart badges on product cards
  syncAllCardsInCartBadges();
}

// ========================================
// 10. STICKY HEADER & HERO CURTAIN SCROLL EFFECT
// ========================================
function initScrollEffects() {
  const header = document.getElementById('site-header');
  const heroSection = document.getElementById('home');
  const heroContent = document.querySelector('.hero-content');
  const heroSlideshow = document.getElementById('hero-slideshow');
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Header elevation shadow
    if (header) {
      header.classList.toggle('scrolled', scrollY > 30);
    }

    // Hero curtain parallax fade
    if (heroSection && heroContent) {
      const heroHeight = heroSection.offsetHeight || 500;
      if (scrollY <= heroHeight) {
        const progress = Math.min(1, Math.max(0, scrollY / heroHeight));
        heroContent.style.opacity = (1 - progress * 1.4).toString();
        heroContent.style.transform = `translateY(-${progress * 40}px)`;
        if (heroSlideshow) {
          heroSlideshow.style.transform = `scale(${1 - progress * 0.03})`;
        }
      } else {
        heroContent.style.opacity = '0';
      }
    }
  }, { passive: true });
}

// ========================================
// 11. LIGHTBOX CLOSE HANDLERS
// ========================================
function initLightbox() {
  const closeBtn = document.getElementById('lightbox-close');
  const modal = document.getElementById('lightbox-modal');
  
  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }
  
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeLightbox();
    });
  }
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

// ========================================
// 12. TOAST NOTIFICATION
// ========================================
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ========================================
// 13. INTERACTIVE FEATURE STEPS CONTROLLER
// (Matches the FeatureSteps React component demo)
// ========================================
function initFeatureSteps() {
  const stepItems = document.querySelectorAll('.step-item');
  const visualCards = document.querySelectorAll('.visual-card');
  const section = document.getElementById('how-to-order');
  
  if (stepItems.length === 0 || visualCards.length === 0) return;
  
  let currentStep = 0;
  let progress = 0;
  let isPaused = false;
  const intervalMs = 100;
  const autoPlayDuration = 3500; // 3.5 seconds per step
  const progressIncrement = 100 / (autoPlayDuration / intervalMs);
  
  function updateStepsUI() {
    stepItems.forEach((item, index) => {
      const badgeIcon = item.querySelector('.step-badge-icon');
      const progressBar = item.querySelector('.step-progress-bar');
      
      const isActive = index === currentStep;
      const isCompleted = index < currentStep;
      
      item.classList.toggle('active', isActive);
      item.classList.toggle('completed', isCompleted);
      
      if (badgeIcon) {
        if (index <= currentStep) {
          badgeIcon.textContent = '✓';
        } else {
          badgeIcon.textContent = (index + 1).toString();
        }
      }
      
      if (progressBar) {
        if (isActive) {
          progressBar.style.width = `${progress}%`;
        } else if (isCompleted) {
          progressBar.style.width = '100%';
        } else {
          progressBar.style.width = '0%';
        }
      }
    });
    
    visualCards.forEach((card, index) => {
      card.classList.toggle('active', index === currentStep);
    });
  }
  
  // Timer loop
  setInterval(() => {
    if (isPaused) return;
    
    if (progress < 100) {
      progress += progressIncrement;
      const activeBar = stepItems[currentStep]?.querySelector('.step-progress-bar');
      if (activeBar) {
        activeBar.style.width = `${progress}%`;
      }
    } else {
      progress = 0;
      currentStep = (currentStep + 1) % stepItems.length;
      updateStepsUI();
    }
  }, intervalMs);
  
  // Interactive click on any step
  stepItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      currentStep = index;
      progress = 0;
      updateStepsUI();
    });
  });
  
  // Pause on hover
  if (section) {
    section.addEventListener('mouseenter', () => { isPaused = true; });
    section.addEventListener('mouseleave', () => { isPaused = false; });
  }
  
  // Initial render
  updateStepsUI();
}

// ========================================
// INITIALIZE ALL
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  initHeroSlideshow();
  initCarousel();
  renderProducts();
  renderGallery();
  renderReviews();
  initEnquiryForm();
  initMobileMenu();
  initScrollEffects();
  initLightbox();
  initFeatureSteps();
  initCartDrawer();
  renderCartDrawerUI();
  cart.subscribe(() => renderCartDrawerUI());
  
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});
