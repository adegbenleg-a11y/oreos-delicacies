/**
 * OREOS DELICACIES - Main Public Application Script
 * Powered by DataStore, CartManager, and Lucide Icons
 */

import { store } from './store.js';
import { cart } from './cart.js';

// DOM Elements
const elements = {
  mobileMenuBtn: document.getElementById('mobile-menu-btn'),
  mobileMenu: document.getElementById('mobile-menu'),
  cartToggleBtns: document.querySelectorAll('.cart-toggle-btn'),
  cartBadgeEls: document.querySelectorAll('.cart-badge'),
  cartDrawer: document.getElementById('cart-drawer'),
  cartBackdrop: document.getElementById('cart-backdrop'),
  closeCartBtn: document.getElementById('close-cart-btn'),
  cartItemsList: document.getElementById('cart-items-list'),
  cartEmptyState: document.getElementById('cart-empty-state'),
  cartSubtotal: document.getElementById('cart-subtotal'),
  cartDeliveryFee: document.getElementById('cart-delivery-fee'),
  cartTotal: document.getElementById('cart-total'),
  cartAreaSelect: document.getElementById('cart-area-select'),
  cartCustomerName: document.getElementById('cart-customer-name'),
  cartCustomerPhone: document.getElementById('cart-customer-phone'),
  cartCustomerNotes: document.getElementById('cart-customer-notes'),
  cartCheckoutBtn: document.getElementById('cart-checkout-btn'),

  // Menu Elements
  categoryPills: document.getElementById('category-pills'),
  menuSearchInput: document.getElementById('menu-search-input'),
  menuGrid: document.getElementById('menu-grid'),
  menuEmptyState: document.getElementById('menu-empty-state'),

  // Delivery Table
  deliveryTableBody: document.getElementById('delivery-table-body'),

  // Event Enquiry Form
  eventForm: document.getElementById('event-enquiry-form'),

  // Gallery & Lightbox
  galleryGrid: document.getElementById('gallery-grid'),
  lightboxModal: document.getElementById('lightbox-modal'),
  lightboxImg: document.getElementById('lightbox-img'),
  lightboxCaption: document.getElementById('lightbox-caption'),
  lightboxCloseBtn: document.getElementById('lightbox-close-btn'),

  // Reviews
  reviewsGrid: document.getElementById('reviews-grid'),

  // Live status badges
  navStatusBadge: document.getElementById('nav-status-badge'),
  heroStatusBadge: document.getElementById('hero-status-badge'),
  contactStatusBadge: document.getElementById('contact-status-badge'),

  // Toast Container
  toastContainer: document.getElementById('toast-container')
};

// Application State
let currentCategory = 'all';
let currentSearch = '';
let currentGalleryIndex = 0;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  initLiveHours();
  initNavbar();
  renderCategories();
  renderMenu();
  renderDeliveryAreas();
  renderGallery();
  renderReviews();
  initCart();
  initEventForm();
  initLightbox();

  // Subscribe to store updates (instant re-render if admin edits data)
  store.subscribe((key) => {
    if (key.includes('menu') || key.includes('categories')) {
      renderCategories();
      renderMenu();
    }
    if (key.includes('delivery')) {
      renderDeliveryAreas();
      populateCartAreas();
    }
    if (key.includes('gallery')) {
      renderGallery();
    }
    if (key.includes('reviews')) {
      renderReviews();
    }
    if (key.includes('settings')) {
      initLiveHours();
    }
  });

  // Re-check Nigerian hours every 60 seconds
  setInterval(initLiveHours, 60000);

  // Initialize Lucide icons if available
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

/**
 * Toast Notification System
 */
export function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  
  let iconHtml = '✨';
  if (type === 'error') iconHtml = '⚠️';
  if (type === 'cart') iconHtml = '🛍️';

  toast.innerHTML = `<span>${iconHtml}</span><span class="flex-1">${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/**
 * Real-time Nigerian Time & Opening Hours Status
 */
function initLiveHours() {
  const status = store.getNigerianTimeStatus();

  const updateBadge = (el) => {
    if (!el) return;
    if (status.isOpen) {
      el.innerHTML = `
        <span class="relative flex h-2.5 w-2.5">
          <span class="ping-indicator absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span class="text-xs font-semibold text-emerald-800">${status.badgeText}</span>
      `;
      el.className = 'inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 shadow-sm';
    } else {
      el.innerHTML = `
        <span class="inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
        <span class="text-xs font-semibold text-rose-800">${status.badgeText}</span>
      `;
      el.className = 'inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 shadow-sm';
    }
  };

  updateBadge(elements.navStatusBadge);
  updateBadge(elements.heroStatusBadge);
  updateBadge(elements.contactStatusBadge);
}

/**
 * Navbar & Mobile Menu (4 Core Sections + Others Dropdown)
 */
function initNavbar() {
  // Mobile menu toggle
  if (elements.mobileMenuBtn && elements.mobileMenu) {
    elements.mobileMenuBtn.addEventListener('click', () => {
      elements.mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when clicking nav links
    const mobileLinks = elements.mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        elements.mobileMenu.classList.add('hidden');
      });
    });

    // Mobile "Others" Accordion toggle
    const mobileOthersBtn = document.getElementById('mobile-others-btn');
    const mobileOthersList = document.getElementById('mobile-others-list');
    const mobileOthersChevron = document.getElementById('mobile-others-chevron');

    if (mobileOthersBtn && mobileOthersList) {
      mobileOthersBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = mobileOthersList.classList.toggle('hidden');
        if (mobileOthersChevron) {
          mobileOthersChevron.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(180deg)';
        }
      });
    }
  }

  // Desktop "Others" Dropdown click & hover support
  const desktopOthersDropdown = document.getElementById('desktop-others-dropdown');
  const desktopOthersBtn = document.getElementById('desktop-others-btn');
  const desktopOthersMenu = document.getElementById('desktop-others-menu');

  if (desktopOthersDropdown && desktopOthersBtn && desktopOthersMenu) {
    // Click toggle
    desktopOthersBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = desktopOthersMenu.classList.contains('opacity-100');
      if (isOpen) {
        desktopOthersMenu.classList.remove('opacity-100', 'visible', 'scale-100');
        desktopOthersMenu.classList.add('opacity-0', 'invisible', 'scale-95');
      } else {
        desktopOthersMenu.classList.remove('opacity-0', 'invisible', 'scale-95');
        desktopOthersMenu.classList.add('opacity-100', 'visible', 'scale-100');
      }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!desktopOthersDropdown.contains(e.target)) {
        desktopOthersMenu.classList.remove('opacity-100', 'visible', 'scale-100');
        desktopOthersMenu.classList.add('opacity-0', 'invisible', 'scale-95');
      }
    });

    // Close on link click inside dropdown
    desktopOthersMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        desktopOthersMenu.classList.remove('opacity-100', 'visible', 'scale-100');
        desktopOthersMenu.classList.add('opacity-0', 'invisible', 'scale-95');
      });
    });
  }

  // Scroll shadow effect
  const navbar = document.getElementById('main-navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar?.classList.add('shadow-md');
    } else {
      navbar?.classList.remove('shadow-md');
    }
  });
}

/**
 * Render Category Filter Buttons
 */
function renderCategories() {
  if (!elements.categoryPills) return;
  const categories = store.getCategories();
  const allItems = store.getMenuItems('all');

  let html = `
    <button 
      class="category-btn px-5 py-2.5 rounded-full text-sm font-semibold transition-smooth ${currentCategory === 'all' ? 'bg-[#E03166] text-white shadow-md' : 'bg-white text-gray-700 hover:bg-rose-50 border border-gray-200'}"
      data-category="all"
    >
      All Treats (${allItems.length})
    </button>
  `;

  categories.forEach(cat => {
    const count = allItems.filter(i => i.category_id === cat.id).length;
    const isActive = currentCategory === cat.id;
    html += `
      <button 
        class="category-btn px-5 py-2.5 rounded-full text-sm font-semibold transition-smooth ${isActive ? 'bg-[#E03166] text-white shadow-md' : 'bg-white text-gray-700 hover:bg-rose-50 border border-gray-200'}"
        data-category="${cat.id}"
      >
        ${cat.name} (${count})
      </button>
    `;
  });

  elements.categoryPills.innerHTML = html;

  // Add click handlers
  elements.categoryPills.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentCategory = btn.dataset.category;
      renderCategories();
      renderMenu();
    });
  });

  // Search input
  if (elements.menuSearchInput) {
    elements.menuSearchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      renderMenu();
    });
  }
}

/**
 * Render Menu Grid Cards
 */
function renderMenu() {
  if (!elements.menuGrid) return;
  const items = store.getMenuItems(currentCategory, currentSearch);

  if (items.length === 0) {
    elements.menuGrid.innerHTML = '';
    elements.menuEmptyState?.classList.remove('hidden');
    return;
  }

  elements.menuEmptyState?.classList.add('hidden');

  let cardsHtml = '';

  items.forEach(item => {
    const defaultVariant = item.variants && item.variants.length > 0 ? item.variants[0] : { name: 'Standard', price: 0 };
    const priceDisplay = defaultVariant.price > 0 ? store.formatNaira(defaultVariant.price) : 'Contact for price';

    // Variant Options dropdown if multiple variants
    let variantsDropdownHtml = '';
    if (item.variants && item.variants.length > 1) {
      const options = item.variants.map((v, i) => 
        `<option value="${v.name}" data-price="${v.price}">${v.name} - ${v.price > 0 ? store.formatNaira(v.price) : 'Contact'}</option>`
      ).join('');

      variantsDropdownHtml = `
        <div class="mb-3">
          <label class="block text-xs font-semibold text-gray-500 mb-1">Select Size / Option:</label>
          <select class="variant-select w-full bg-rose-50/50 border border-rose-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#E03166]">
            ${options}
          </select>
        </div>
      `;
    } else {
      variantsDropdownHtml = `
        <div class="mb-3 text-xs text-rose-600 font-semibold bg-rose-50 px-2.5 py-1.5 rounded-lg inline-block">
          ${defaultVariant.name}
        </div>
      `;
    }

    cardsHtml += `
      <div class="bg-white rounded-3xl overflow-hidden border border-rose-100/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group relative" data-item-id="${item.id}">
        
        <!-- Image Container -->
        <div class="relative h-56 w-full overflow-hidden bg-rose-50">
          <img 
            src="${item.image || 'assets/images/hero-spread.jpg'}" 
            alt="${item.name}" 
            loading="lazy"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onerror="this.src='https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=80'"
          />
          
          <!-- Badges -->
          <div class="absolute top-3 left-3 flex flex-col gap-1.5">
            ${item.is_signature ? `<span class="px-3 py-1 rounded-full text-xs font-bold bg-[#E03166] text-white shadow-md flex items-center gap-1">⭐ Signature</span>` : ''}
            ${item.is_featured && !item.is_signature ? `<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500 text-white shadow-sm">Popular</span>` : ''}
          </div>

          ${item.is_sold_out ? `
            <div class="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
              <span class="px-4 py-1.5 bg-rose-600 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                Sold Out Today
              </span>
            </div>
          ` : ''}
        </div>

        <!-- Content -->
        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 class="font-heading text-lg font-bold text-gray-900 group-hover:text-[#E03166] transition-colors line-clamp-1 mb-1.5">
              ${item.name}
            </h3>
            <p class="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">
              ${item.description || 'Freshly made with premium ingredients by Oreofe Abisola.'}
            </p>

            ${variantsDropdownHtml}
          </div>

          <!-- Bottom Price & Action -->
          <div class="pt-3 border-t border-rose-100 flex items-center justify-between gap-3">
            <div>
              <span class="text-[11px] font-semibold text-gray-400 block uppercase tracking-wider">Price</span>
              <span class="item-price-display font-heading text-xl font-bold text-[#E03166]">
                ${priceDisplay}
              </span>
            </div>

            <button 
              type="button"
              class="add-to-cart-btn px-4 py-2.5 rounded-2xl font-semibold text-xs transition-smooth flex items-center gap-1.5 ${item.is_sold_out ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#E03166] hover:bg-[#C2185B] text-white shadow-sm hover:shadow-md active:scale-95'}"
              ${item.is_sold_out ? 'disabled' : ''}
            >
              <span>Add to Order</span>
              <span>+</span>
            </button>
          </div>

        </div>

      </div>
    `;
  });

  elements.menuGrid.innerHTML = cardsHtml;

  // Setup variant dropdown change handlers & Add-to-cart click handlers
  elements.menuGrid.querySelectorAll('[data-item-id]').forEach(card => {
    const itemId = card.dataset.itemId;
    const item = store.getMenuItemById(itemId);
    if (!item) return;

    const variantSelect = card.querySelector('.variant-select');
    const priceDisplay = card.querySelector('.item-price-display');
    const addBtn = card.querySelector('.add-to-cart-btn');

    if (variantSelect) {
      variantSelect.addEventListener('change', () => {
        const selectedOption = variantSelect.selectedOptions[0];
        const price = parseFloat(selectedOption.dataset.price || '0');
        priceDisplay.textContent = price > 0 ? store.formatNaira(price) : 'Contact for price';
      });
    }

    if (addBtn && !item.is_sold_out) {
      addBtn.addEventListener('click', () => {
        let chosenVariantName = item.variants[0]?.name || 'Standard';
        if (variantSelect) {
          chosenVariantName = variantSelect.value;
        }

        cart.addItem(item, chosenVariantName, 1);
        showToast(`Added ${item.name} (${chosenVariantName}) to your order!`, 'cart');
        openCartDrawer();
      });
    }
  });

  if (window.lucide) window.lucide.createIcons();
}

/**
 * Render Delivery Areas Table
 */
function renderDeliveryAreas() {
  if (!elements.deliveryTableBody) return;
  const areas = store.getDeliveryAreas();

  let rowsHtml = '';
  areas.forEach(area => {
    const isFree = area.fee === 0;
    rowsHtml += `
      <tr class="hover:bg-rose-50/40 transition-colors border-b border-rose-100/60">
        <td class="py-3 px-4 font-medium text-gray-900 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full ${isFree ? 'bg-emerald-500' : 'bg-[#E03166]'}"></span>
          <span>${area.name}</span>
        </td>
        <td class="py-3 px-4 font-bold ${isFree ? 'text-emerald-600' : 'text-[#E03166]'}">
          ${isFree ? 'FREE' : store.formatNaira(area.fee)}
        </td>
        <td class="py-3 px-4 text-xs text-gray-500">
          ${area.time_estimate || '20 - 40 mins'}
        </td>
      </tr>
    `;
  });

  elements.deliveryTableBody.innerHTML = rowsHtml;
}

/**
 * Cart Management & WhatsApp Checkout Drawer
 */
function initCart() {
  // Toggle cart drawer
  elements.cartToggleBtns.forEach(btn => {
    btn.addEventListener('click', openCartDrawer);
  });

  elements.closeCartBtn?.addEventListener('click', closeCartDrawer);
  elements.cartBackdrop?.addEventListener('click', closeCartDrawer);

  // Subscribe to cart updates
  cart.subscribe(() => {
    updateCartUI();
  });

  populateCartAreas();

  if (elements.cartAreaSelect) {
    elements.cartAreaSelect.addEventListener('change', (e) => {
      cart.setSelectedArea(e.target.value);
    });
  }

  // Checkout button
  if (elements.cartCheckoutBtn) {
    elements.cartCheckoutBtn.addEventListener('click', handleWhatsAppCheckout);
  }

  // Signature Eggroll quick-add section
  const sigAddBtn = document.getElementById('signature-quick-add-btn');
  const sigVariantSelect = document.getElementById('signature-variant-select');
  if (sigAddBtn) {
    sigAddBtn.addEventListener('click', () => {
      const eggrollItem = store.getMenuItemById('item-signature-eggroll') || store.getMenuItems('all').find(i => i.is_signature);
      if (eggrollItem) {
        const variantName = sigVariantSelect ? sigVariantSelect.value : (eggrollItem.variants[0]?.name || 'Single Piece');
        cart.addItem(eggrollItem, variantName, 1);
        showToast(`Added ${eggrollItem.name} (${variantName}) to cart!`, 'cart');
        openCartDrawer();
      }
    });
  }

  updateCartUI();
}

function openCartDrawer() {
  if (elements.cartDrawer && elements.cartBackdrop) {
    elements.cartDrawer.classList.remove('translate-x-full');
    elements.cartBackdrop.classList.remove('opacity-0', 'pointer-events-none');
    document.body.style.overflow = 'hidden';
  }
}

function closeCartDrawer() {
  if (elements.cartDrawer && elements.cartBackdrop) {
    elements.cartDrawer.classList.add('translate-x-full');
    elements.cartBackdrop.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
  }
}

function populateCartAreas() {
  if (!elements.cartAreaSelect) return;
  const areas = store.getDeliveryAreas();
  elements.cartAreaSelect.innerHTML = areas.map(a => `
    <option value="${a.id}">${a.name} ${a.fee === 0 ? '(Free Store Pickup)' : '(Delivery destination)'}</option>
  `).join('');

  elements.cartAreaSelect.value = cart.selectedAreaId;
}

function updateCartUI() {
  const items = cart.getItems();
  const count = cart.getItemCount();

  // Badges
  elements.cartBadgeEls.forEach(badge => {
    badge.textContent = count;
    if (count > 0) {
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  });

  if (items.length === 0) {
    elements.cartEmptyState?.classList.remove('hidden');
    elements.cartItemsList?.classList.add('hidden');
    if (elements.cartCheckoutBtn) {
      elements.cartCheckoutBtn.disabled = true;
      elements.cartCheckoutBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
  } else {
    elements.cartEmptyState?.classList.add('hidden');
    elements.cartItemsList?.classList.remove('hidden');
    if (elements.cartCheckoutBtn) {
      elements.cartCheckoutBtn.disabled = false;
      elements.cartCheckoutBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }

    renderCartItemsList(items);
  }

  // Update Totals (delivery fee is calculated & confirmed after order)
  const subtotal = cart.getSubtotal();
  const isPickup = cart.selectedAreaId === 'area-walkin';

  if (elements.cartSubtotal) elements.cartSubtotal.textContent = store.formatNaira(subtotal);
  if (elements.cartDeliveryFee) {
    elements.cartDeliveryFee.textContent = isPickup ? 'FREE (Store Pickup)' : 'Calculated after order';
  }
  if (elements.cartTotal) elements.cartTotal.textContent = store.formatNaira(subtotal);
}

function renderCartItemsList(items) {
  if (!elements.cartItemsList) return;

  elements.cartItemsList.innerHTML = items.map(item => `
    <div class="flex items-center gap-3 p-3 bg-rose-50/40 rounded-2xl border border-rose-100">
      <img src="${item.image || 'assets/images/hero-spread.jpg'}" alt="${item.name}" class="w-14 h-14 object-cover rounded-xl bg-white flex-shrink-0" onerror="this.src='assets/images/hero-spread.jpg'"/>
      <div class="flex-1 min-w-0">
        <h4 class="font-semibold text-xs text-gray-900 truncate">${item.name}</h4>
        <p class="text-[11px] text-rose-600 font-medium">${item.variantName}</p>
        <p class="text-xs font-bold text-gray-800 mt-0.5">${store.formatNaira(item.unitPrice * item.quantity)}</p>
      </div>

      <!-- Stepper -->
      <div class="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-rose-200">
        <button class="cart-step-btn text-rose-600 font-bold hover:text-rose-800 text-sm px-1" data-id="${item.cartItemId}" data-delta="-1">−</button>
        <span class="text-xs font-bold text-gray-800 min-w-[14px] text-center">${item.quantity}</span>
        <button class="cart-step-btn text-rose-600 font-bold hover:text-rose-800 text-sm px-1" data-id="${item.cartItemId}" data-delta="1">+</button>
      </div>

      <!-- Remove -->
      <button class="cart-remove-btn text-gray-400 hover:text-rose-600 p-1 transition-colors" data-id="${item.cartItemId}">
        ✕
      </button>
    </div>
  `).join('');

  // Stepper handlers
  elements.cartItemsList.querySelectorAll('.cart-step-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const delta = parseInt(btn.dataset.delta, 10);
      cart.updateQuantity(id, delta);
    });
  });

  // Remove handlers
  elements.cartItemsList.querySelectorAll('.cart-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      cart.removeItem(btn.dataset.id);
    });
  });
}

function handleWhatsAppCheckout() {
  try {
    const name = elements.cartCustomerName ? elements.cartCustomerName.value : '';
    const phone = elements.cartCustomerPhone ? elements.cartCustomerPhone.value : '';
    const notes = elements.cartCustomerNotes ? elements.cartCustomerNotes.value : '';

    const { order, whatsappUrl } = cart.processWhatsAppOrder(name, phone, notes);

    showToast(`Order #${order.id} prepared! Opening WhatsApp...`, 'success');
    closeCartDrawer();

    // Reset inputs
    if (elements.cartCustomerName) elements.cartCustomerName.value = '';
    if (elements.cartCustomerPhone) elements.cartCustomerPhone.value = '';
    if (elements.cartCustomerNotes) elements.cartCustomerNotes.value = '';

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
  } catch (err) {
    showToast(err.message || 'Error processing order', 'error');
  }
}

/**
 * Event / Custom Order Enquiry Form
 */
function initEventForm() {
  if (!elements.eventForm) return;

  elements.eventForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
      name: document.getElementById('event-name')?.value,
      phone: document.getElementById('event-phone')?.value,
      eventType: document.getElementById('event-type')?.value,
      eventDate: document.getElementById('event-date')?.value,
      guestCount: document.getElementById('event-guests')?.value,
      details: document.getElementById('event-details')?.value
    };

    try {
      const { enquiry, whatsappUrl } = cart.processEventEnquiry(formData);
      showToast(`Enquiry #${enquiry.id} sent! Opening WhatsApp...`, 'success');
      elements.eventForm.reset();

      // Open WhatsApp
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 500);
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
}

/**
 * Gallery & Lightbox
 */
function renderGallery() {
  if (!elements.galleryGrid) return;
  const gallery = store.getGallery();

  let html = '';
  gallery.forEach((item, index) => {
    html += `
      <div 
        class="gallery-item group relative h-64 rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
        data-index="${index}"
      >
        <img 
          src="${item.image}" 
          alt="${item.title || 'Pastry Gallery'}" 
          loading="lazy"
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onerror="this.src='assets/images/hero-spread.jpg'"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
          <span class="text-[10px] uppercase font-bold tracking-widest text-rose-300 mb-1">${item.category || 'Delicacy'}</span>
          <h4 class="font-heading text-lg font-bold">${item.title || 'Oreos Delicacies'}</h4>
          <p class="text-xs text-gray-200 line-clamp-2 mt-1">${item.caption || 'Crafted with passion by Oreofe Abisola.'}</p>
        </div>
      </div>
    `;
  });

  elements.galleryGrid.innerHTML = html;

  // Click to open Lightbox
  elements.galleryGrid.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.dataset.index, 10);
      openLightbox(idx);
    });
  });
}

function initLightbox() {
  elements.lightboxCloseBtn?.addEventListener('click', closeLightbox);
  elements.lightboxModal?.addEventListener('click', (e) => {
    if (e.target === elements.lightboxModal) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

function openLightbox(index) {
  const gallery = store.getGallery();
  if (!gallery[index]) return;

  currentGalleryIndex = index;
  const item = gallery[index];

  if (elements.lightboxImg) elements.lightboxImg.src = item.image;
  if (elements.lightboxCaption) {
    elements.lightboxCaption.innerHTML = `
      <h3 class="font-heading text-xl font-bold text-white">${item.title || 'Oreos Delicacies'}</h3>
      <p class="text-sm text-gray-300 mt-1">${item.caption || ''}</p>
    `;
  }

  elements.lightboxModal?.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  elements.lightboxModal?.classList.add('hidden');
  document.body.style.overflow = '';
}

/**
 * Customer Reviews
 */
function renderReviews() {
  if (!elements.reviewsGrid) return;
  const reviews = store.getReviews(true);

  let html = '';
  reviews.forEach(rev => {
    const stars = '★'.repeat(rev.rating || 5) + '☆'.repeat(5 - (rev.rating || 5));
    html += `
      <div class="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-1 text-amber-400 text-lg mb-3">
            ${stars}
          </div>
          <p class="text-gray-700 text-sm leading-relaxed italic mb-4">
            "${rev.comment}"
          </p>
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-rose-100/60">
          <div>
            <h4 class="font-bold text-xs text-gray-900">${rev.customer_name}</h4>
            <span class="text-[11px] text-rose-500 font-medium">${rev.location || 'Abeokuta'}</span>
          </div>
          <span class="text-[10px] text-gray-400 font-medium">${rev.date}</span>
        </div>
      </div>
    `;
  });

  elements.reviewsGrid.innerHTML = html;
}
