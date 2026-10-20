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
let catalogViewMode = 'grid'; // 'grid' | 'list'
let expandedCategoryIds = new Set();
let hasInitializedAccordions = false;

// Category Visual Metadata (Icon, Subtitle description, Short display name)
const CATEGORY_META = {
  'cat-eggrolls-snacks': {
    emoji: '🥐',
    subtitle: "Abeokuta's famous signature eggrolls, savory meat pies & crispy rolls",
    shortName: 'Eggrolls & Snacks'
  },
  'cat-cakes': {
    emoji: '🎂',
    subtitle: 'Bespoke celebration tiered cakes, trendy bento boxes & money cakes',
    shortName: 'Cakes'
  },
  'cat-surprise-boxes': {
    emoji: '🎁',
    subtitle: 'Curated celebration gift packages with snacks, wine & juice',
    shortName: 'Surprise Boxes'
  },
  'cat-donuts-sweets': {
    emoji: '🍩',
    subtitle: 'Fluffy milky donuts, rich fudgy brownies & decorated cupcakes',
    shortName: 'Donuts & Sweets'
  },
  'cat-parfaits': {
    emoji: '🍨',
    subtitle: 'Chilled Greek yogurt fruit parfaits layered with fresh toppings',
    shortName: 'Parfaits'
  },
  'cat-jars-crunchies': {
    emoji: '🥜',
    subtitle: 'Crunchy bite-sized Nigerian chinchin, roasted peanuts & plantain chips',
    shortName: 'Jars & Crunchies'
  }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  initLiveHours();
  initNavbar();
  initCatalogControls();
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
 * Render Horizontal Scrollable Category Jump Chips
 */
function renderCategories() {
  const categoryPillsEl = document.getElementById('category-pills');
  if (!categoryPillsEl) return;
  const categories = store.getCategories();
  const allItems = store.getMenuItems('all');

  let html = `
    <button 
      type="button"
      class="category-pill-btn px-4 py-2 rounded-full text-xs font-bold transition-all border ${currentCategory === 'all' ? 'is-active bg-[#E03166] text-white shadow-md border-[#E03166]' : 'bg-white text-gray-700 hover:bg-rose-50 border-rose-200'}"
      data-category="all"
      role="tab"
      aria-selected="${currentCategory === 'all'}"
    >
      <span>✨</span>
      <span>All Delicacies (${allItems.length})</span>
    </button>
  `;

  categories.forEach(cat => {
    const count = allItems.filter(i => i.category_id === cat.id).length;
    const meta = CATEGORY_META[cat.id] || { emoji: '🍰', shortName: cat.name };
    const isActive = currentCategory === cat.id;

    html += `
      <button 
        type="button"
        class="category-pill-btn px-4 py-2 rounded-full text-xs font-bold transition-all border ${isActive ? 'is-active bg-[#E03166] text-white shadow-md border-[#E03166]' : 'bg-white text-gray-700 hover:bg-rose-50 border-rose-200'}"
        data-category="${cat.id}"
        role="tab"
        aria-selected="${isActive}"
      >
        <span>${meta.emoji}</span>
        <span>${meta.shortName} (${count})</span>
      </button>
    `;
  });

  categoryPillsEl.innerHTML = html;

  // Add click handlers for category jump / filter chips
  categoryPillsEl.querySelectorAll('.category-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const catId = btn.dataset.category;
      currentCategory = catId;
      renderCategories();

      if (catId === 'all') {
        const cats = store.getCategories();
        cats.forEach(c => expandedCategoryIds.add(c.id));
        renderMenu();
      } else {
        expandedCategoryIds.add(catId);
        renderMenu();
        setTimeout(() => {
          const targetAccordion = document.getElementById(`accordion-${catId}`);
          if (targetAccordion) {
            targetAccordion.scrollIntoView({ behavior: 'smooth', block: 'start' });
            targetAccordion.classList.add('ring-2', 'ring-[#E03166]');
            setTimeout(() => targetAccordion.classList.remove('ring-2', 'ring-[#E03166]'), 1500);
          }
        }, 80);
      }
    });
  });
}

/**
 * Render Menu in Grouped Collapsible Category Accordions
 */
function renderMenu() {
  const container = document.getElementById('catalog-accordion-container');
  const emptyState = document.getElementById('menu-empty-state');
  const countHint = document.getElementById('catalog-active-count-hint');
  if (!container) return;

  const categories = store.getCategories();
  const allItems = store.getMenuItems('all', currentSearch);

  // Initial expand state: On mobile (<768px), expand first category; on desktop expand all
  if (!hasInitializedAccordions && expandedCategoryIds.size === 0) {
    hasInitializedAccordions = true;
    if (window.innerWidth < 768) {
      if (categories.length > 0) expandedCategoryIds.add(categories[0].id);
    } else {
      categories.forEach(c => expandedCategoryIds.add(c.id));
    }
  }

  // If user searched, auto-expand categories with matching items
  if (currentSearch && currentSearch.trim().length > 0) {
    categories.forEach(cat => {
      const matchCount = allItems.filter(i => i.category_id === cat.id).length;
      if (matchCount > 0) expandedCategoryIds.add(cat.id);
    });
  }

  // If 0 total items across all categories
  if (allItems.length === 0) {
    container.innerHTML = '';
    emptyState?.classList.remove('hidden');
    if (countHint) countHint.textContent = 'No delicacies found';
    return;
  }

  emptyState?.classList.add('hidden');
  if (countHint) {
    countHint.textContent = `Showing ${allItems.length} delicacies across ${categories.length} categories`;
  }

  let accordionsHtml = '';

  categories.forEach(cat => {
    // Filter items in this category
    const catItems = allItems.filter(i => i.category_id === cat.id);
    if (catItems.length === 0 && currentSearch.trim().length > 0) {
      return; // Hide empty categories when searching
    }

    const meta = CATEGORY_META[cat.id] || {
      emoji: '🍰',
      subtitle: 'Artisan bakes crafted with passion by Oreofe Abisola',
      shortName: cat.name
    };

    // Calculate minimum price among items in this category
    let minPrice = Infinity;
    catItems.forEach(item => {
      (item.variants || []).forEach(v => {
        if (v.price && v.price > 0 && v.price < minPrice) minPrice = v.price;
      });
    });
    const minPriceText = minPrice !== Infinity ? `From ${store.formatNaira(minPrice)}` : '';

    const isExpanded = expandedCategoryIds.has(cat.id);
    const isCollapsedClass = isExpanded ? '' : 'is-collapsed';

    // Generate Cards for Grid View (2 columns on mobile, 3-4 on desktop)
    let gridCardsHtml = '';
    // Generate Cards for Compact List View
    let listRowsHtml = '';

    catItems.forEach(item => {
      const defaultVariant = item.variants && item.variants.length > 0 ? item.variants[0] : { name: 'Standard', price: 0 };
      const priceDisplay = defaultVariant.price > 0 ? store.formatNaira(defaultVariant.price) : 'Contact for price';

      // Variants Selector for Grid & List
      let gridVariantsHtml = '';
      let listVariantsHtml = '';

      if (item.variants && item.variants.length > 1) {
        const options = item.variants.map((v) => 
          `<option value="${v.name}" data-price="${v.price}">${v.name} - ${v.price > 0 ? store.formatNaira(v.price) : 'Contact'}</option>`
        ).join('');

        gridVariantsHtml = `
          <div class="mt-2 mb-1">
            <select class="variant-select w-full bg-rose-50/60 border border-rose-200/90 rounded-xl px-2 sm:px-2.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#E03166]">
              ${options}
            </select>
          </div>
        `;

        listVariantsHtml = `
          <div class="mt-1">
            <select class="variant-select w-full max-w-[200px] bg-rose-50/60 border border-rose-200/90 rounded-lg px-2 py-1 text-[11px] font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#E03166]">
              ${options}
            </select>
          </div>
        `;
      } else {
        gridVariantsHtml = `
          <div class="mt-2 mb-1">
            <span class="text-[10px] sm:text-xs text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded-md inline-block border border-rose-100">
              ${defaultVariant.name}
            </span>
          </div>
        `;
        listVariantsHtml = `
          <div class="mt-0.5">
            <span class="text-[10px] sm:text-xs text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded-md inline-block border border-rose-100">
              ${defaultVariant.name}
            </span>
          </div>
        `;
      }

      // 1. Grid Card (Mobile 2-Column Responsive Card)
      gridCardsHtml += `
        <div class="catalog-item-card bg-white rounded-2xl sm:rounded-3xl border border-rose-100/90 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group" data-item-id="${item.id}">
          <!-- Photo -->
          <div class="relative w-full aspect-[4/3] sm:h-48 overflow-hidden bg-rose-50">
            <img 
              src="${item.image || 'assets/images/real-cake-size10.jpg'}" 
              alt="${item.name}" 
              loading="lazy"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onerror="this.src='assets/images/real-cake-size10.jpg'"
            />
            <!-- Badges -->
            <div class="absolute top-2 left-2 flex flex-col gap-1">
              ${item.is_signature ? `<span class="px-2 py-0.5 rounded-full text-[9px] sm:text-xs font-bold bg-[#E03166] text-white shadow">⭐ Signature</span>` : ''}
              ${item.is_featured && !item.is_signature ? `<span class="px-2 py-0.5 rounded-full text-[9px] sm:text-xs font-semibold bg-amber-500 text-white shadow-sm">Popular</span>` : ''}
            </div>
            ${item.is_sold_out ? `
              <div class="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                <span class="px-2.5 py-1 bg-rose-600 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-full shadow">Sold Out</span>
              </div>` : ''}
          </div>

          <!-- Content -->
          <div class="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
            <div>
              <h4 class="font-heading text-xs sm:text-base font-bold text-gray-900 group-hover:text-[#E03166] transition-colors line-clamp-2 leading-tight">
                ${item.name}
              </h4>
              <p class="hidden sm:block text-gray-500 text-xs line-clamp-2 mt-1">
                ${item.description || 'Freshly made with premium ingredients by Oreofe Abisola.'}
              </p>
              ${gridVariantsHtml}
            </div>

            <!-- Price & Button -->
            <div class="pt-2 sm:pt-3 border-t border-rose-100 flex items-center justify-between gap-1.5 mt-2">
              <div>
                <span class="text-[9px] sm:text-[10px] uppercase font-semibold text-gray-400 block leading-tight">Price</span>
                <span class="item-price-display font-heading text-xs sm:text-lg font-bold text-[#E03166] leading-none">
                  ${priceDisplay}
                </span>
              </div>
              <button 
                type="button" 
                class="add-to-cart-btn px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 ${item.is_sold_out ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#E03166] hover:bg-[#C2185B] text-white shadow active:scale-95'}"
                ${item.is_sold_out ? 'disabled' : ''}
                aria-label="Add ${item.name} to order"
              >
                <span>Add</span>
                <span class="text-sm font-bold leading-none">+</span>
              </button>
            </div>
          </div>
        </div>
      `;

      // 2. List Row (Compact Streamlined Row)
      listRowsHtml += `
        <div class="catalog-item-list-row bg-white rounded-2xl border border-rose-100/90 p-2.5 sm:p-3.5 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-3 sm:gap-4 group" data-item-id="${item.id}">
          <div class="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-rose-50 border border-rose-100">
            <img 
              src="${item.image || 'assets/images/real-cake-size10.jpg'}" 
              alt="${item.name}" 
              loading="lazy"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform"
              onerror="this.src='assets/images/real-cake-size10.jpg'"
            />
            ${item.is_signature ? `<span class="absolute top-1 left-1 px-1 bg-[#E03166] text-white text-[8px] font-bold rounded">⭐</span>` : ''}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1.5 flex-wrap">
              <h4 class="font-heading text-xs sm:text-base font-bold text-gray-900 group-hover:text-[#E03166] transition-colors truncate">${item.name}</h4>
              ${item.is_featured && !item.is_signature ? `<span class="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[9px] font-bold rounded">Popular</span>` : ''}
            </div>
            <p class="hidden sm:block text-gray-400 text-xs truncate mt-0.5">${item.description || ''}</p>
            ${listVariantsHtml}
          </div>
          <div class="text-right flex-shrink-0 flex flex-col items-end gap-1.5">
            <span class="item-price-display font-heading text-sm sm:text-base font-bold text-[#E03166]">${priceDisplay}</span>
            <button 
              type="button" 
              class="add-to-cart-btn px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${item.is_sold_out ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#E03166] hover:bg-[#C2185B] text-white shadow active:scale-95'} flex items-center gap-1"
              ${item.is_sold_out ? 'disabled' : ''}
              aria-label="Add ${item.name} to order"
            >
              <span>Add</span>
              <span>+</span>
            </button>
          </div>
        </div>
      `;
    });

    accordionsHtml += `
      <div 
        id="accordion-${cat.id}" 
        class="category-accordion-item ${isCollapsedClass}"
        data-category-id="${cat.id}"
      >
        <!-- Accordion Header Button -->
        <button 
          type="button" 
          class="category-accordion-header w-full flex items-center justify-between text-left focus:outline-none"
          aria-expanded="${isExpanded}"
          aria-controls="accordion-body-${cat.id}"
        >
          <div class="flex items-center gap-3 sm:gap-4 min-w-0">
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-rose-100/80 text-[#E03166] flex items-center justify-center flex-shrink-0 shadow-sm text-lg sm:text-2xl border border-rose-200/50">
              ${meta.emoji}
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="font-heading text-sm sm:text-lg font-bold text-gray-900 truncate">
                  ${cat.name}
                </h3>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-rose-100 text-rose-700">
                  ${catItems.length} items
                </span>
              </div>
              <p class="text-[11px] sm:text-xs text-gray-500 font-medium truncate mt-0.5">
                ${meta.subtitle}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            ${minPriceText ? `
              <span class="text-[10px] sm:text-xs font-bold text-[#E03166] bg-rose-50 px-2.5 py-1 rounded-xl hidden xs:inline-block border border-rose-100">
                ${minPriceText}
              </span>
            ` : ''}
            <div class="accordion-chevron-box">
              <i data-lucide="chevron-down" class="w-4 h-4"></i>
            </div>
          </div>
        </button>

        <!-- Accordion Body -->
        <div id="accordion-body-${cat.id}" class="category-accordion-body">
          <!-- Grid View Container (Default: 2-column mobile, 3-4 desktop) -->
          <div class="catalog-grid-view grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            ${gridCardsHtml}
          </div>

          <!-- List View Container (Compact) -->
          <div class="catalog-list-view flex flex-col gap-2 sm:gap-2.5">
            ${listRowsHtml}
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = accordionsHtml;

  // Bind Accordion Header Toggles
  container.querySelectorAll('.category-accordion-header').forEach(headerBtn => {
    headerBtn.addEventListener('click', () => {
      const parentItem = headerBtn.closest('.category-accordion-item');
      const catId = parentItem.dataset.categoryId;
      const isCurrentlyCollapsed = parentItem.classList.contains('is-collapsed');

      if (isCurrentlyCollapsed) {
        parentItem.classList.remove('is-collapsed');
        headerBtn.setAttribute('aria-expanded', 'true');
        expandedCategoryIds.add(catId);
      } else {
        parentItem.classList.add('is-collapsed');
        headerBtn.setAttribute('aria-expanded', 'false');
        expandedCategoryIds.delete(catId);
      }

      updateToggleAllBtnState();
    });
  });

  // Bind Variant Selects & Add-to-Cart Buttons across all cards & rows
  container.querySelectorAll('[data-item-id]').forEach(cardEl => {
    const itemId = cardEl.dataset.itemId;
    const item = store.getMenuItemById(itemId);
    if (!item) return;

    const variantSelect = cardEl.querySelector('.variant-select');
    const priceDisplay = cardEl.querySelector('.item-price-display');
    const addBtn = cardEl.querySelector('.add-to-cart-btn');

    if (variantSelect && priceDisplay) {
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
        
        // Update Mobile Floating Cart Bar with a reactive bounce animation
        updateMobileCartBar(true);
      });
    }
  });

  updateToggleAllBtnState();

  if (window.lucide) window.lucide.createIcons();
}

/**
 * Synchronize Expand All / Collapse All Button State
 */
function updateToggleAllBtnState() {
  const toggleBtn = document.getElementById('catalog-toggle-all-btn');
  const toggleText = document.getElementById('catalog-toggle-all-text');
  if (!toggleBtn || !toggleText) return;

  const totalAccordions = document.querySelectorAll('.category-accordion-item').length;
  const collapsedCount = document.querySelectorAll('.category-accordion-item.is-collapsed').length;

  if (collapsedCount > 0) {
    toggleBtn.dataset.state = 'collapsed';
    toggleText.textContent = 'Expand All';
  } else {
    toggleBtn.dataset.state = 'expanded';
    toggleText.textContent = 'Collapse All';
  }
}

/**
 * Initialize Interactive Catalog Toolbar Controls (Search, View Toggle, Expand All)
 */
function initCatalogControls() {
  const searchInput = document.getElementById('menu-search-input');
  const searchClear = document.getElementById('menu-search-clear');
  const emptyResetBtn = document.getElementById('menu-empty-reset-btn');
  const toggleAllBtn = document.getElementById('catalog-toggle-all-btn');
  const viewGridBtn = document.getElementById('view-grid-btn');
  const viewListBtn = document.getElementById('view-list-btn');
  const container = document.getElementById('catalog-accordion-container');

  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      if (searchClear) {
        if (currentSearch.trim().length > 0) {
          searchClear.classList.remove('hidden');
        } else {
          searchClear.classList.add('hidden');
        }
      }
      renderMenu();
    });
  }

  // Clear search
  const clearSearch = () => {
    if (searchInput) searchInput.value = '';
    currentSearch = '';
    searchClear?.classList.add('hidden');
    renderMenu();
  };

  searchClear?.addEventListener('click', clearSearch);
  emptyResetBtn?.addEventListener('click', clearSearch);

  // Toggle All button
  toggleAllBtn?.addEventListener('click', () => {
    const categories = store.getCategories();
    const currentState = toggleAllBtn.dataset.state;

    if (currentState === 'expanded') {
      // Collapse all
      expandedCategoryIds.clear();
      document.querySelectorAll('.category-accordion-item').forEach(item => {
        item.classList.add('is-collapsed');
        item.querySelector('.category-accordion-header')?.setAttribute('aria-expanded', 'false');
      });
    } else {
      // Expand all
      categories.forEach(c => expandedCategoryIds.add(c.id));
      document.querySelectorAll('.category-accordion-item').forEach(item => {
        item.classList.remove('is-collapsed');
        item.querySelector('.category-accordion-header')?.setAttribute('aria-expanded', 'true');
      });
    }

    updateToggleAllBtnState();
  });

  // View mode switcher: Grid vs List
  const setViewMode = (mode) => {
    catalogViewMode = mode;
    if (container) {
      if (mode === 'list') {
        container.classList.add('mode-list');
      } else {
        container.classList.remove('mode-list');
      }
    }

    if (mode === 'grid') {
      viewGridBtn?.classList.add('bg-[#E03166]', 'text-white', 'shadow-sm');
      viewGridBtn?.classList.remove('text-gray-600', 'hover:text-rose-600');
      viewListBtn?.classList.remove('bg-[#E03166]', 'text-white', 'shadow-sm');
      viewListBtn?.classList.add('text-gray-600', 'hover:text-rose-600');
    } else {
      viewListBtn?.classList.add('bg-[#E03166]', 'text-white', 'shadow-sm');
      viewListBtn?.classList.remove('text-gray-600', 'hover:text-rose-600');
      viewGridBtn?.classList.remove('bg-[#E03166]', 'text-white', 'shadow-sm');
      viewGridBtn?.classList.add('text-gray-600', 'hover:text-rose-600');
    }
  };

  viewGridBtn?.addEventListener('click', () => setViewMode('grid'));
  viewListBtn?.addEventListener('click', () => setViewMode('list'));
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

  // Mobile Floating Cart Bar click to open cart
  const mobileCartBarBtn = document.getElementById('mobile-cart-bar-btn');
  mobileCartBarBtn?.addEventListener('click', openCartDrawer);

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

  // Update floating mobile cart bar
  updateMobileCartBar(false);
}

/**
 * Update Floating Mobile Sticky Bottom Cart Bar
 */
function updateMobileCartBar(shouldBounce = false) {
  const mobileBar = document.getElementById('mobile-cart-bar');
  const countEl = document.getElementById('mobile-cart-bar-count');
  const totalEl = document.getElementById('mobile-cart-bar-total');
  if (!mobileBar) return;

  const count = cart.getItemCount();
  const subtotal = cart.getSubtotal();

  if (count > 0) {
    if (countEl) countEl.textContent = count;
    if (totalEl) totalEl.textContent = store.formatNaira(subtotal);

    mobileBar.classList.remove('translate-y-28', 'opacity-0', 'pointer-events-none');
    document.body.classList.add('has-floating-cart');

    if (shouldBounce) {
      mobileBar.classList.add('scale-105');
      setTimeout(() => mobileBar.classList.remove('scale-105'), 250);
    }
  } else {
    mobileBar.classList.add('translate-y-28', 'opacity-0', 'pointer-events-none');
    document.body.classList.remove('has-floating-cart');
  }
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
