/**
 * OREOS DELICACIES - Admin Portal Logic
 * Mobile-First, Large Buttons, Intuitive Management for Oreofe Abisola
 */

import { store } from './store.js';
import { testSupabaseConnection, saveSupabaseCredentials, getSupabaseCredentials } from './supabase-config.js';

// Admin Credentials Storage
const ADMIN_AUTH_KEY = 'oreos_admin_auth_v1';
const DEFAULT_ADMIN = {
  email: 'admin@oreosdelicacies.com',
  password: 'OreosAdmin2025!'
};

// State
let activeTab = 'dashboard';
let editingItemId = null;
let currentItemVariants = [];

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  setupNavigation();
  initModals();
  initItemForm();
  initCategoryForm();
  initDeliveryForm();
  initReviewForm();
  initGalleryForm();
  initSettingsForm();

  // If already authenticated, render active view
  if (isAuthenticated()) {
    renderCurrentTab();
  }

  // Icons
  if (window.lucide) window.lucide.createIcons();
});

function showAdminToast(message, type = 'success') {
  let container = document.getElementById('admin-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'admin-toast-container';
    container.className = 'fixed bottom-5 right-5 z-[99999] flex flex-col gap-2 max-w-sm';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `p-4 rounded-2xl shadow-xl text-xs font-bold text-white flex items-center gap-2 transition-all duration-300 ${type === 'error' ? 'bg-rose-600' : 'bg-gray-900'}`;
  toast.innerHTML = `<span>${type === 'error' ? '⚠️' : '✅'}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/**
 * Authentication Gate
 */
function initAuth() {
  const loginSection = document.getElementById('login-section');
  const adminApp = document.getElementById('admin-app');
  const loginForm = document.getElementById('login-form');
  const logoutBtn = document.getElementById('logout-btn');
  const forgotBtn = document.getElementById('forgot-password-btn');

  if (isAuthenticated()) {
    loginSection.classList.add('hidden');
    adminApp.classList.remove('hidden');
    document.getElementById('admin-user-display').textContent = getAdminUser().email;
  } else {
    loginSection.classList.remove('hidden');
    adminApp.classList.add('hidden');
  }

  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    const savedAuth = getSavedAdminCredentials();

    if (email.toLowerCase() === savedAuth.email.toLowerCase() && password === savedAuth.password) {
      sessionStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify({ email, loggedInAt: Date.now() }));
      loginSection.classList.add('hidden');
      adminApp.classList.remove('hidden');
      document.getElementById('admin-user-display').textContent = email;
      showAdminToast('Welcome back, Oreofe! Admin logged in.');
      renderCurrentTab();
    } else {
      showAdminToast('Invalid email or password. Please try again.', 'error');
    }
  });

  logoutBtn?.addEventListener('click', () => {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    loginSection.classList.remove('hidden');
    adminApp.classList.add('hidden');
    showAdminToast('Logged out securely.');
  });

  forgotBtn?.addEventListener('click', () => {
    const creds = getSavedAdminCredentials();
    alert(`🔐 Admin Recovery Reminder:\n\nDefault Login Email: ${creds.email}\nDefault Password: ${creds.password}\n\n(You can change your password in the Site Settings tab once logged in)`);
  });
}

function isAuthenticated() {
  return !!sessionStorage.getItem(ADMIN_AUTH_KEY);
}

function getAdminUser() {
  try {
    return JSON.parse(sessionStorage.getItem(ADMIN_AUTH_KEY)) || { email: 'Admin' };
  } catch (e) {
    return { email: 'Admin' };
  }
}

function getSavedAdminCredentials() {
  try {
    const saved = localStorage.getItem('oreos_admin_creds');
    return saved ? JSON.parse(saved) : DEFAULT_ADMIN;
  } catch (e) {
    return DEFAULT_ADMIN;
  }
}

/**
 * Tab Navigation (Dashboard, Menu, Categories, Delivery, Orders, Gallery, Reviews, Settings)
 */
function setupNavigation() {
  const navButtons = document.querySelectorAll('.admin-nav-btn');
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      activeTab = btn.dataset.tab;
      navButtons.forEach(b => {
        b.classList.remove('bg-[#E03166]', 'text-white', 'shadow');
        b.classList.add('text-gray-700', 'hover:bg-rose-50');
      });
      btn.classList.add('bg-[#E03166]', 'text-white', 'shadow');
      btn.classList.remove('text-gray-700', 'hover:bg-rose-50');

      renderCurrentTab();
    });
  });
}

function renderCurrentTab() {
  // Hide all sections
  document.querySelectorAll('.admin-tab-pane').forEach(pane => pane.classList.add('hidden'));

  const currentPane = document.getElementById(`pane-${activeTab}`);
  if (currentPane) {
    currentPane.classList.remove('hidden');
  }

  switch (activeTab) {
    case 'dashboard':
      renderDashboard();
      break;
    case 'menu':
      renderMenuManager();
      break;
    case 'categories':
      renderCategoryManager();
      break;
    case 'delivery':
      renderDeliveryManager();
      break;
    case 'orders':
      renderOrdersManager();
      break;
    case 'gallery':
      renderGalleryManager();
      break;
    case 'reviews':
      renderReviewsManager();
      break;
    case 'settings':
      renderSettingsManager();
      break;
  }

  if (window.lucide) window.lucide.createIcons();
}

/**
 * 1. DASHBOARD
 */
function renderDashboard() {
  const items = store.getMenuItems('all');
  const soldOutItems = items.filter(i => i.is_sold_out);
  const orders = store.getOrders();
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const enquiries = store.getEnquiries();
  const pendingEnquiries = enquiries.filter(e => e.status === 'pending');

  const totalRevenue = orders
    .filter(o => o.status === 'confirmed' || o.status === 'delivered')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  document.getElementById('stat-total-items').textContent = items.length;
  document.getElementById('stat-sold-out').textContent = soldOutItems.length;
  document.getElementById('stat-pending-orders').textContent = pendingOrders.length;
  document.getElementById('stat-pending-enquiries').textContent = pendingEnquiries.length;
  document.getElementById('stat-total-revenue').textContent = store.formatNaira(totalRevenue);

  // Recent Orders Feed
  const recentOrdersList = document.getElementById('dashboard-recent-orders');
  if (recentOrdersList) {
    const recent = orders.slice(0, 5);
    if (recent.length === 0) {
      recentOrdersList.innerHTML = `<p class="text-xs text-gray-500 py-4 text-center">No orders recorded yet.</p>`;
    } else {
      recentOrdersList.innerHTML = recent.map(o => `
        <div class="flex items-center justify-between p-3 bg-white rounded-2xl border border-rose-100 shadow-sm">
          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-xs text-gray-900">${o.customer_name}</span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusBadgeClass(o.status)}">${o.status.toUpperCase()}</span>
            </div>
            <p class="text-[11px] text-gray-500 mt-0.5">Area: ${o.delivery_area} • ${o.items.length} item(s)</p>
          </div>
          <div class="text-right">
            <span class="font-bold text-xs text-[#E03166] block">${store.formatNaira(o.total)}</span>
            <span class="text-[10px] text-gray-400">${new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      `).join('');
    }
  }

  // Live store time badge
  const status = store.getNigerianTimeStatus();
  const timeBadge = document.getElementById('dashboard-time-badge');
  if (timeBadge) {
    timeBadge.textContent = `${status.badgeText} (${status.nigeriaTime})`;
  }
}

function getStatusBadgeClass(status) {
  switch (status) {
    case 'pending': return 'bg-amber-100 text-amber-800';
    case 'confirmed': return 'bg-blue-100 text-blue-800';
    case 'delivered': return 'bg-emerald-100 text-emerald-800';
    case 'cancelled': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

/**
 * 2. MENU MANAGER
 */
function renderMenuManager() {
  const items = store.getMenuItems('all');
  const categories = store.getCategories();
  const container = document.getElementById('admin-menu-list');
  const catFilter = document.getElementById('admin-menu-cat-filter');

  // Populate category filter
  if (catFilter) {
    const selected = catFilter.value || 'all';
    catFilter.innerHTML = `<option value="all">All Categories (${items.length})</option>` +
      categories.map(c => `<option value="${c.id}" ${c.id === selected ? 'selected' : ''}>${c.name}</option>`).join('');
  }

  renderFilteredMenuItems();
}

function renderFilteredMenuItems() {
  const container = document.getElementById('admin-menu-list');
  const catFilter = document.getElementById('admin-menu-cat-filter');
  const searchInput = document.getElementById('admin-menu-search');

  const selectedCat = catFilter ? catFilter.value : 'all';
  const query = searchInput ? searchInput.value : '';

  const items = store.getMenuItems(selectedCat, query);

  if (items.length === 0) {
    container.innerHTML = `<div class="p-8 text-center text-xs text-gray-500">No items match your criteria.</div>`;
    return;
  }

  container.innerHTML = items.map((item, index) => {
    const variantsText = item.variants.map(v => `${v.name}: ${store.formatNaira(v.price)}`).join(', ');
    const isFirst = index === 0;
    const isLast = index === items.length - 1;

    return `
      <div class="p-4 bg-white rounded-3xl border border-rose-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        <div class="flex items-center gap-4 flex-1 min-w-0">
          <img src="${item.image || 'assets/images/hero-spread.jpg'}" alt="${item.name}" class="w-16 h-16 rounded-2xl object-cover bg-rose-50 flex-shrink-0 border border-rose-100" onerror="this.src='assets/images/hero-spread.jpg'"/>
          <div class="min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h4 class="font-bold text-sm text-gray-900 truncate">${item.name}</h4>
              ${item.is_signature ? `<span class="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Signature</span>` : ''}
              ${item.is_sold_out ? `<span class="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Sold Out</span>` : `<span class="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Available</span>`}
            </div>
            <p class="text-xs text-rose-600 font-semibold mt-1 truncate">${variantsText}</p>
            <p class="text-[11px] text-gray-400 truncate">${item.description || 'No description'}</p>
          </div>
        </div>

        <!-- Controls: Reorder, Sold Out Toggle, Edit, Delete -->
        <div class="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-rose-50">
          
          <!-- Reorder Buttons -->
          <button class="reorder-btn p-2 rounded-xl bg-gray-100 hover:bg-rose-100 text-gray-600 text-xs font-bold ${isFirst ? 'opacity-30 cursor-not-allowed' : ''}" data-id="${item.id}" data-dir="up" title="Move Up" ${isFirst ? 'disabled' : ''}>
            ▲
          </button>
          <button class="reorder-btn p-2 rounded-xl bg-gray-100 hover:bg-rose-100 text-gray-600 text-xs font-bold ${isLast ? 'opacity-30 cursor-not-allowed' : ''}" data-id="${item.id}" data-dir="down" title="Move Down" ${isLast ? 'disabled' : ''}>
            ▼
          </button>

          <!-- Toggle Sold Out Button -->
          <button class="toggle-soldout-btn px-3 py-2 rounded-xl text-xs font-bold transition-all ${item.is_sold_out ? 'bg-emerald-600 text-white' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'}" data-id="${item.id}">
            ${item.is_sold_out ? 'Mark Available' : 'Mark Sold Out'}
          </button>

          <!-- Edit Button -->
          <button class="edit-item-btn p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors" data-id="${item.id}" title="Edit Item">
            <i data-lucide="edit-3" class="w-4 h-4"></i>
          </button>

          <!-- Delete Button -->
          <button class="delete-item-btn p-2 rounded-xl bg-gray-100 text-gray-500 hover:bg-rose-100 hover:text-rose-600 transition-colors" data-id="${item.id}" title="Delete Item">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>

        </div>

      </div>
    `;
  }).join('');

  // Attach event handlers
  container.querySelectorAll('.reorder-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      store.reorderMenuItem(btn.dataset.id, btn.dataset.dir);
      renderFilteredMenuItems();
    });
  });

  container.querySelectorAll('.toggle-soldout-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const updated = store.toggleSoldOut(btn.dataset.id);
      showAdminToast(`${updated.name} is now ${updated.is_sold_out ? 'Sold Out' : 'Available'}!`);
      renderFilteredMenuItems();
    });
  });

  container.querySelectorAll('.edit-item-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      openItemModal(btn.dataset.id);
    });
  });

  container.querySelectorAll('.delete-item-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = store.getMenuItemById(btn.dataset.id);
      if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
        store.deleteMenuItem(btn.dataset.id);
        showAdminToast(`Deleted ${item.name}`);
        renderFilteredMenuItems();
      }
    });
  });

  if (window.lucide) window.lucide.createIcons();
}

/**
 * Item Modal & Form
 */
function initItemForm() {
  const modal = document.getElementById('item-modal');
  const form = document.getElementById('item-form');
  const addBtn = document.getElementById('add-new-item-btn');
  const closeBtn = document.getElementById('close-item-modal-btn');
  const addVariantBtn = document.getElementById('add-variant-row-btn');
  const imageFileInput = document.getElementById('item-image-file');
  const imageUrlInput = document.getElementById('item-image-url');
  const imagePreview = document.getElementById('item-image-preview');

  addBtn?.addEventListener('click', () => openItemModal(null));
  closeBtn?.addEventListener('click', () => modal?.classList.add('hidden'));

  // File upload to Base64 data URL
  imageFileInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        imageUrlInput.value = event.target.result;
        imagePreview.src = event.target.result;
        imagePreview.classList.remove('hidden');
      };
      reader.readAsDataURL(file);
    }
  });

  imageUrlInput?.addEventListener('input', (e) => {
    if (e.target.value.trim()) {
      imagePreview.src = e.target.value.trim();
      imagePreview.classList.remove('hidden');
    }
  });

  addVariantBtn?.addEventListener('click', () => {
    currentItemVariants.push({ name: '', price: 0 });
    renderVariantInputs();
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    // Read variants from inputs
    const variantRows = document.querySelectorAll('.variant-input-row');
    const variants = [];
    variantRows.forEach(row => {
      const name = row.querySelector('.variant-name-input').value.trim();
      const price = parseFloat(row.querySelector('.variant-price-input').value || '0');
      if (name) {
        variants.push({ name, price });
      }
    });

    if (variants.length === 0) {
      variants.push({ name: 'Standard', price: 0 });
    }

    const itemData = {
      id: editingItemId,
      name: document.getElementById('item-name').value.trim(),
      category_id: document.getElementById('item-category').value,
      description: document.getElementById('item-description').value.trim(),
      image: document.getElementById('item-image-url').value.trim() || 'assets/images/hero-spread.jpg',
      is_signature: document.getElementById('item-is-signature').checked,
      is_featured: document.getElementById('item-is-featured').checked,
      is_sold_out: document.getElementById('item-is-sold-out').checked,
      variants: variants
    };

    store.saveMenuItem(itemData);
    showAdminToast(editingItemId ? 'Item updated successfully!' : 'New item created successfully!');
    modal?.classList.add('hidden');
    renderFilteredMenuItems();
  });

  // Category filter and search listeners
  document.getElementById('admin-menu-cat-filter')?.addEventListener('change', renderFilteredMenuItems);
  document.getElementById('admin-menu-search')?.addEventListener('input', renderFilteredMenuItems);
}

function openItemModal(itemId) {
  const modal = document.getElementById('item-modal');
  const modalTitle = document.getElementById('item-modal-title');
  const catSelect = document.getElementById('item-category');
  const imagePreview = document.getElementById('item-image-preview');

  editingItemId = itemId;

  // Populate category select
  const categories = store.getCategories();
  catSelect.innerHTML = categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

  if (itemId) {
    const item = store.getMenuItemById(itemId);
    modalTitle.textContent = `Edit Delicacy: ${item.name}`;
    document.getElementById('item-name').value = item.name;
    document.getElementById('item-category').value = item.category_id;
    document.getElementById('item-description').value = item.description || '';
    document.getElementById('item-image-url').value = item.image || '';
    document.getElementById('item-is-signature').checked = !!item.is_signature;
    document.getElementById('item-is-featured').checked = !!item.is_featured;
    document.getElementById('item-is-sold-out').checked = !!item.is_sold_out;

    currentItemVariants = item.variants && item.variants.length > 0 ? [...item.variants] : [{ name: 'Standard', price: 0 }];
    
    if (item.image) {
      imagePreview.src = item.image;
      imagePreview.classList.remove('hidden');
    } else {
      imagePreview.classList.add('hidden');
    }
  } else {
    modalTitle.textContent = 'Add New Delicacy';
    document.getElementById('item-form').reset();
    currentItemVariants = [
      { name: 'Standard Size', price: 1000 }
    ];
    imagePreview.classList.add('hidden');
  }

  renderVariantInputs();
  modal?.classList.remove('hidden');
}

function renderVariantInputs() {
  const container = document.getElementById('variant-rows-container');
  if (!container) return;

  container.innerHTML = currentItemVariants.map((v, i) => `
    <div class="variant-input-row flex items-center gap-2 p-2 bg-rose-50/50 rounded-xl border border-rose-100">
      <input type="text" placeholder="Size / Option Name (e.g. 8-inch, Pack of 5)" value="${v.name}" class="variant-name-input flex-1 bg-white border border-rose-200 rounded-lg px-3 py-1.5 text-xs text-gray-800" required>
      <div class="flex items-center gap-1 w-32">
        <span class="text-xs font-bold text-gray-500">₦</span>
        <input type="number" placeholder="Price" value="${v.price}" min="0" class="variant-price-input w-full bg-white border border-rose-200 rounded-lg px-2 py-1.5 text-xs font-bold text-rose-600" required>
      </div>
      <button type="button" class="remove-variant-btn text-gray-400 hover:text-rose-600 p-1" data-index="${i}">✕</button>
    </div>
  `).join('');

  container.querySelectorAll('.remove-variant-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index, 10);
      currentItemVariants.splice(idx, 1);
      renderVariantInputs();
    });
  });
}

/**
 * 3. CATEGORY MANAGER
 */
function renderCategoryManager() {
  const container = document.getElementById('admin-categories-list');
  const categories = store.getCategories();
  const allItems = store.getMenuItems('all');

  container.innerHTML = categories.map(cat => {
    const count = allItems.filter(i => i.category_id === cat.id).length;
    return `
      <div class="p-4 bg-white rounded-3xl border border-rose-100 shadow-sm flex items-center justify-between">
        <div>
          <h4 class="font-bold text-sm text-gray-900">${cat.name}</h4>
          <span class="text-xs text-rose-600 font-semibold">${count} Delicacies in this category</span>
        </div>
        <div class="flex items-center gap-2">
          <button class="edit-cat-btn px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold" data-id="${cat.id}" data-name="${cat.name}">
            Rename
          </button>
          <button class="delete-cat-btn px-3 py-1.5 rounded-xl bg-gray-100 text-gray-500 hover:bg-rose-100 hover:text-rose-600 text-xs font-bold" data-id="${cat.id}" data-name="${cat.name}">
            Delete
          </button>
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.edit-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const newName = prompt('Enter new category name:', btn.dataset.name);
      if (newName && newName.trim()) {
        store.saveCategory({ id: btn.dataset.id, name: newName.trim() });
        showAdminToast(`Category renamed to "${newName.trim()}"`);
        renderCategoryManager();
      }
    });
  });

  container.querySelectorAll('.delete-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm(`Are you sure you want to delete category "${btn.dataset.name}"?`)) {
        store.deleteCategory(btn.dataset.id);
        showAdminToast(`Category deleted`);
        renderCategoryManager();
      }
    });
  });
}

function initCategoryForm() {
  document.getElementById('add-category-btn')?.addEventListener('click', () => {
    const name = prompt('Enter new Category Name (e.g. "Pastries & Pies"):');
    if (name && name.trim()) {
      store.saveCategory({ name: name.trim() });
      showAdminToast(`Category "${name.trim()}" added!`);
      renderCategoryManager();
    }
  });
}

/**
 * 4. DELIVERY FEES MANAGER
 */
function renderDeliveryManager() {
  const container = document.getElementById('admin-delivery-list');
  const areas = store.getDeliveryAreas();

  container.innerHTML = areas.map(area => {
    return `
      <div class="p-4 bg-white rounded-3xl border border-rose-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h4 class="font-bold text-sm text-gray-900">${area.name}</h4>
          <span class="text-xs text-gray-500">${area.time_estimate || '20 - 40 mins'}</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="font-heading text-base font-bold ${area.fee === 0 ? 'text-emerald-600' : 'text-[#E03166]'}">
            ${area.fee === 0 ? 'FREE' : store.formatNaira(area.fee)}
          </span>
          <button class="edit-area-btn px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold" data-id="${area.id}">
            Edit Fee
          </button>
          <button class="delete-area-btn p-2 rounded-xl bg-gray-100 text-gray-400 hover:text-rose-600" data-id="${area.id}">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.edit-area-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const area = areas.find(a => a.id === btn.dataset.id);
      const newFeeStr = prompt(`Enter new delivery fee for "${area.name}" (in Naira, enter 0 for Free):`, area.fee);
      if (newFeeStr !== null) {
        const newFee = parseFloat(newFeeStr) || 0;
        store.saveDeliveryArea({ ...area, fee: newFee });
        showAdminToast(`Updated delivery fee for ${area.name} to ${store.formatNaira(newFee)}`);
        renderDeliveryManager();
      }
    });
  });

  container.querySelectorAll('.delete-area-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const area = areas.find(a => a.id === btn.dataset.id);
      if (confirm(`Delete delivery area "${area.name}"?`)) {
        store.deleteDeliveryArea(btn.dataset.id);
        showAdminToast(`Deleted area ${area.name}`);
        renderDeliveryManager();
      }
    });
  });

  if (window.lucide) window.lucide.createIcons();
}

function initDeliveryForm() {
  document.getElementById('add-delivery-area-btn')?.addEventListener('click', () => {
    const name = prompt('Enter Area Name (e.g. "Kuto / Oke-Ilewo"):');
    if (name && name.trim()) {
      const feeStr = prompt(`Enter delivery fee in ₦ for "${name.trim()}":`, '1000');
      const fee = parseFloat(feeStr) || 0;
      store.saveDeliveryArea({
        name: name.trim(),
        fee: fee,
        time_estimate: '30 - 50 mins'
      });
      showAdminToast(`Added delivery area: ${name.trim()}`);
      renderDeliveryManager();
    }
  });
}

/**
 * 5. ORDERS & ENQUIRIES MANAGER
 */
function renderOrdersManager() {
  const container = document.getElementById('admin-orders-list');
  const filterSelect = document.getElementById('admin-orders-filter');
  const typeTab = document.querySelector('.orders-subtab.active')?.dataset.type || 'orders';

  const filter = filterSelect ? filterSelect.value : 'all';

  if (typeTab === 'orders') {
    const orders = store.getOrders(filter);
    if (orders.length === 0) {
      container.innerHTML = `<div class="p-8 text-center text-xs text-gray-500">No WhatsApp orders recorded.</div>`;
      return;
    }

    container.innerHTML = orders.map(o => `
      <div class="p-5 bg-white rounded-3xl border border-rose-100 shadow-sm space-y-4">
        
        <div class="flex items-center justify-between border-b border-rose-50 pb-3 flex-wrap gap-2">
          <div>
            <span class="text-xs font-bold text-gray-400">#${o.id}</span>
            <h4 class="font-bold text-base text-gray-900">${o.customer_name}</h4>
            <a href="tel:${o.customer_phone}" class="text-xs text-rose-600 font-semibold hover:underline flex items-center gap-1">
              📞 ${o.customer_phone}
            </a>
          </div>
          
          <div class="flex items-center gap-2">
            <select class="order-status-select bg-rose-50 border border-rose-200 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-800" data-id="${o.id}">
              <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>⏳ Pending</option>
              <option value="confirmed" ${o.status === 'confirmed' ? 'selected' : ''}>👍 Confirmed</option>
              <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>✅ Delivered</option>
              <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>❌ Cancelled</option>
            </select>
          </div>
        </div>

        <!-- Order Items -->
        <div class="space-y-1.5 text-xs text-gray-700 bg-rose-50/40 p-3 rounded-2xl">
          ${o.items.map(item => `
            <div class="flex justify-between">
              <span><strong>${item.quantity}×</strong> ${item.name} (${item.variant})</span>
              <span class="font-semibold">${store.formatNaira(item.price * item.quantity)}</span>
            </div>
          `).join('')}
        </div>

        <!-- Delivery Area & Notes -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gray-600 pt-1">
          <div>
            <span><strong>Delivery Area:</strong> ${o.delivery_area} (Fee: ${store.formatNaira(o.delivery_fee)})</span>
            ${o.notes ? `<p class="mt-1 text-rose-700 bg-rose-50 p-2 rounded-lg font-medium">💬 Note: "${o.notes}"</p>` : ''}
          </div>
          <div class="text-right">
            <span class="text-xs text-gray-400 block">Total Amount</span>
            <span class="font-heading text-lg font-bold text-[#E03166]">${store.formatNaira(o.total)}</span>
          </div>
        </div>

        <!-- WhatsApp Action button -->
        <div class="pt-2 flex items-center justify-end gap-2">
          <a href="https://wa.me/234${o.customer_phone.replace(/^0/, '')}" target="_blank" rel="noopener" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm">
            <span>Chat on WhatsApp</span>
          </a>
        </div>

      </div>
    `).join('');

    container.querySelectorAll('.order-status-select').forEach(sel => {
      sel.addEventListener('change', () => {
        store.updateOrderStatus(sel.dataset.id, sel.value);
        showAdminToast(`Order status updated to ${sel.value}`);
      });
    });

  } else {
    // Custom Event Enquiries
    const enquiries = store.getEnquiries(filter);
    if (enquiries.length === 0) {
      container.innerHTML = `<div class="p-8 text-center text-xs text-gray-500">No event enquiries recorded.</div>`;
      return;
    }

    container.innerHTML = enquiries.map(e => `
      <div class="p-5 bg-white rounded-3xl border border-rose-100 shadow-sm space-y-3">
        <div class="flex items-center justify-between border-b border-rose-50 pb-3 flex-wrap gap-2">
          <div>
            <span class="text-xs font-bold text-gray-400">#${e.id}</span>
            <h4 class="font-bold text-base text-gray-900">${e.customer_name}</h4>
            <a href="tel:${e.customer_phone}" class="text-xs text-rose-600 font-semibold hover:underline">📞 ${e.customer_phone}</a>
          </div>
          <select class="enquiry-status-select bg-rose-50 border border-rose-200 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-800" data-id="${e.id}">
            <option value="pending" ${e.status === 'pending' ? 'selected' : ''}>⏳ Pending</option>
            <option value="confirmed" ${e.status === 'confirmed' ? 'selected' : ''}>👍 Booked</option>
            <option value="closed" ${e.status === 'closed' ? 'selected' : ''}>✅ Completed</option>
          </select>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-700 bg-rose-50/40 p-3 rounded-2xl font-medium">
          <div><strong>Event:</strong> ${e.event_type}</div>
          <div><strong>Date:</strong> ${e.event_date}</div>
          <div><strong>Guests:</strong> ${e.guest_count}</div>
        </div>

        <p class="text-xs text-gray-700 bg-rose-50/60 p-3 rounded-2xl italic leading-relaxed">
          "${e.details}"
        </p>

        <div class="flex justify-end pt-2">
          <a href="https://wa.me/234${e.customer_phone.replace(/^0/, '')}" target="_blank" rel="noopener" class="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1">
            <span>Respond on WhatsApp</span>
          </a>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.enquiry-status-select').forEach(sel => {
      sel.addEventListener('change', () => {
        store.updateEnquiryStatus(sel.dataset.id, sel.value);
        showAdminToast(`Enquiry status updated to ${sel.value}`);
      });
    });
  }
}

/**
 * 6. GALLERY MANAGER
 */
function renderGalleryManager() {
  const container = document.getElementById('admin-gallery-list');
  const gallery = store.getGallery();

  container.innerHTML = gallery.map(item => `
    <div class="relative group rounded-3xl overflow-hidden border border-rose-100 shadow-sm bg-white">
      <img src="${item.image}" alt="${item.title}" class="w-full h-48 object-cover" onerror="this.src='assets/images/hero-spread.jpg'"/>
      <div class="p-3">
        <h4 class="font-bold text-xs text-gray-900 truncate">${item.title}</h4>
        <p class="text-[11px] text-gray-500 truncate">${item.caption || ''}</p>
        <button class="delete-gallery-btn mt-2 w-full py-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white text-xs font-bold transition-colors" data-id="${item.id}">
          Delete Photo
        </button>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.delete-gallery-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Delete this photo from gallery?')) {
        store.deleteGalleryItem(btn.dataset.id);
        showAdminToast('Photo deleted from gallery');
        renderGalleryManager();
      }
    });
  });
}

function initGalleryForm() {
  document.getElementById('add-gallery-photo-btn')?.addEventListener('click', () => {
    const url = prompt('Enter Image URL (or paste image link):');
    if (url && url.trim()) {
      const title = prompt('Enter Photo Title:', 'Pastry Creation');
      const caption = prompt('Enter Short Caption:', 'Baked with love at Oreos Delicacies');
      store.saveGalleryItem({
        image: url.trim(),
        title: title || 'Oreos Delicacies',
        caption: caption || ''
      });
      showAdminToast('New photo added to gallery!');
      renderGalleryManager();
    }
  });
}

/**
 * 7. REVIEWS MANAGER
 */
function renderReviewsManager() {
  const container = document.getElementById('admin-reviews-list');
  const reviews = store.getReviews(false);

  container.innerHTML = reviews.map(rev => `
    <div class="p-4 bg-white rounded-3xl border border-rose-100 shadow-sm space-y-2">
      <div class="flex items-center justify-between">
        <div>
          <h4 class="font-bold text-sm text-gray-900">${rev.customer_name} (${rev.location || 'Abeokuta'})</h4>
          <span class="text-amber-400 text-xs font-bold">${'★'.repeat(rev.rating)}</span>
        </div>
        <div class="flex items-center gap-2">
          <button class="toggle-review-btn px-3 py-1 rounded-xl text-xs font-bold ${rev.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'}" data-id="${rev.id}">
            ${rev.is_active ? 'Visible' : 'Hidden'}
          </button>
          <button class="delete-review-btn p-1.5 text-gray-400 hover:text-rose-600" data-id="${rev.id}">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
      <p class="text-xs text-gray-600 italic leading-relaxed">"${rev.comment}"</p>
    </div>
  `).join('');

  container.querySelectorAll('.toggle-review-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const rev = reviews.find(r => r.id === btn.dataset.id);
      rev.is_active = !rev.is_active;
      store.saveReview(rev);
      showAdminToast(`Review is now ${rev.is_active ? 'Visible on website' : 'Hidden'}`);
      renderReviewsManager();
    });
  });

  container.querySelectorAll('.delete-review-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Delete this testimonial?')) {
        store.deleteReview(btn.dataset.id);
        showAdminToast('Testimonial deleted');
        renderReviewsManager();
      }
    });
  });

  if (window.lucide) window.lucide.createIcons();
}

function initReviewForm() {
  document.getElementById('add-review-btn')?.addEventListener('click', () => {
    const name = prompt('Customer Name:');
    if (!name) return;
    const location = prompt('Location (e.g. "Camp, FUNAAB"):', 'Abeokuta');
    const comment = prompt('Customer Review Comment:');
    if (!comment) return;

    store.saveReview({
      customer_name: name.trim(),
      location: location || 'Abeokuta',
      rating: 5,
      comment: comment.trim(),
      is_active: true
    });

    showAdminToast('Testimonial added successfully!');
    renderReviewsManager();
  });
}

/**
 * 8. SITE SETTINGS MANAGER
 */
function renderSettingsManager() {
  const settings = store.getSettings();

  document.getElementById('setting-business-name').value = settings.business_name || '';
  document.getElementById('setting-tagline').value = settings.tagline || '';
  document.getElementById('setting-owner-name').value = settings.owner_name || '';
  document.getElementById('setting-phone').value = settings.phone || '';
  document.getElementById('setting-whatsapp').value = settings.whatsapp_display || '';
  document.getElementById('setting-tiktok').value = settings.tiktok_handle || '';
  document.getElementById('setting-address').value = settings.address || '';
  document.getElementById('setting-hours-weekday').value = settings.hours_weekday || '';
  document.getElementById('setting-hours-sunday').value = settings.hours_sunday || '';
  document.getElementById('setting-about-text').value = settings.about_text || '';

  // Supabase status
  const creds = getSupabaseCredentials();
  document.getElementById('setting-supabase-url').value = creds.url || '';
  document.getElementById('setting-supabase-key').value = creds.key || '';
}

function initSettingsForm() {
  const form = document.getElementById('settings-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const updated = {
      business_name: document.getElementById('setting-business-name').value.trim(),
      tagline: document.getElementById('setting-tagline').value.trim(),
      owner_name: document.getElementById('setting-owner-name').value.trim(),
      phone: document.getElementById('setting-phone').value.trim(),
      whatsapp_display: document.getElementById('setting-whatsapp').value.trim(),
      tiktok_handle: document.getElementById('setting-tiktok').value.trim(),
      address: document.getElementById('setting-address').value.trim(),
      hours_weekday: document.getElementById('setting-hours-weekday').value.trim(),
      hours_sunday: document.getElementById('setting-hours-sunday').value.trim(),
      about_text: document.getElementById('setting-about-text').value.trim()
    };

    store.saveSettings(updated);

    // Save Supabase credentials
    const sbUrl = document.getElementById('setting-supabase-url').value.trim();
    const sbKey = document.getElementById('setting-supabase-key').value.trim();
    saveSupabaseCredentials(sbUrl, sbKey);

    showAdminToast('Site settings updated! Public website updated immediately.');
  });

  // Test Supabase Button
  document.getElementById('test-supabase-btn')?.addEventListener('click', async () => {
    const sbUrl = document.getElementById('setting-supabase-url').value.trim();
    const sbKey = document.getElementById('setting-supabase-key').value.trim();
    saveSupabaseCredentials(sbUrl, sbKey);

    showAdminToast('Testing Supabase connection...');
    const result = await testSupabaseConnection();
    if (result.success) {
      showAdminToast(result.message, 'success');
    } else {
      showAdminToast(result.message, 'error');
    }
  });

  // Export Data JSON
  document.getElementById('export-data-btn')?.addEventListener('click', () => {
    const data = store.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oreos-delicacies-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showAdminToast('Database backup downloaded!');
  });

  // Reset to Defaults
  document.getElementById('reset-defaults-btn')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to restore original seed data? This will reset custom edits.')) {
      store.resetToDefaults();
      showAdminToast('Restored default bakery seed data!');
      renderCurrentTab();
    }
  });
}

function initModals() {
  // Orders Subtabs
  document.querySelectorAll('.orders-subtab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.orders-subtab').forEach(t => t.classList.remove('active', 'bg-[#E03166]', 'text-white'));
      tab.classList.add('active', 'bg-[#E03166]', 'text-white');
      renderOrdersManager();
    });
  });

  document.getElementById('admin-orders-filter')?.addEventListener('change', renderOrdersManager);
}
