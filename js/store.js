/**
 * OREOS DELICACIES - Central Data Store
 * Supports seamless LocalStorage persistence + optional Supabase cloud sync
 */

import {
  DEFAULT_SITE_SETTINGS,
  DEFAULT_CATEGORIES,
  DEFAULT_DELIVERY_AREAS,
  DEFAULT_MENU_ITEMS,
  DEFAULT_GALLERY,
  DEFAULT_REVIEWS,
  DEFAULT_ORDERS,
  DEFAULT_ENQUIRIES
} from './seed-data.js';

const STORAGE_KEYS = {
  SETTINGS: 'oreos_site_settings_v6',
  CATEGORIES: 'oreos_categories_v6',
  DELIVERY_AREAS: 'oreos_delivery_areas_v6',
  MENU_ITEMS: 'oreos_menu_items_v6',
  GALLERY: 'oreos_gallery_v6',
  REVIEWS: 'oreos_reviews_v6',
  ORDERS: 'oreos_orders_v6',
  ENQUIRIES: 'oreos_enquiries_v6',
  ADMIN_AUTH: 'oreos_admin_session_v1',
  SUPABASE_CONFIG: 'oreos_supabase_config_v1'
};

class DataStore {
  constructor() {
    this.listeners = [];
    this.init();
  }

  init() {
    // Ensure all real product seed data exists in localStorage
    const hasV6 = localStorage.getItem('oreos_real_images_v6') === 'true';

    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS) || !hasV6) {
      this.set(STORAGE_KEYS.SETTINGS, DEFAULT_SITE_SETTINGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES) || !hasV6) {
      this.set(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.DELIVERY_AREAS) || !hasV6) {
      this.set(STORAGE_KEYS.DELIVERY_AREAS, DEFAULT_DELIVERY_AREAS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.MENU_ITEMS) || !hasV6) {
      this.set(STORAGE_KEYS.MENU_ITEMS, DEFAULT_MENU_ITEMS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.GALLERY) || !hasV6) {
      this.set(STORAGE_KEYS.GALLERY, DEFAULT_GALLERY);
    }
    if (!localStorage.getItem(STORAGE_KEYS.REVIEWS) || !hasV6) {
      this.set(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS) || !hasV6) {
      this.set(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ENQUIRIES) || !hasV6) {
      this.set(STORAGE_KEYS.ENQUIRIES, DEFAULT_ENQUIRIES);
    }

    localStorage.setItem('oreos_real_images_v6', 'true');
  }

  get(key, fallback = []) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.error(`Error reading key ${key}`, e);
      return fallback;
    }
  }

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      this.notifyListeners(key);
    } catch (e) {
      console.error(`Error saving key ${key}`, e);
    }
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notifyListeners(changedKey) {
    this.listeners.forEach(cb => {
      try {
        cb(changedKey);
      } catch (e) {
        console.error('Error in listener callback', e);
      }
    });
  }

  // --- Site Settings ---
  getSettings() {
    return this.get(STORAGE_KEYS.SETTINGS, DEFAULT_SITE_SETTINGS);
  }

  saveSettings(settings) {
    this.set(STORAGE_KEYS.SETTINGS, { ...this.getSettings(), ...settings });
    return true;
  }

  // --- Categories ---
  getCategories() {
    const cats = this.get(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
    return cats.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  saveCategory(category) {
    const cats = this.getCategories();
    if (category.id) {
      const idx = cats.findIndex(c => c.id === category.id);
      if (idx !== -1) {
        cats[idx] = { ...cats[idx], ...category };
      } else {
        cats.push(category);
      }
    } else {
      category.id = 'cat-' + Date.now();
      category.order = cats.length + 1;
      cats.push(category);
    }
    this.set(STORAGE_KEYS.CATEGORIES, cats);
    return category;
  }

  deleteCategory(id) {
    let cats = this.getCategories();
    cats = cats.filter(c => c.id !== id);
    this.set(STORAGE_KEYS.CATEGORIES, cats);
    return true;
  }

  // --- Delivery Areas ---
  getDeliveryAreas() {
    return this.get(STORAGE_KEYS.DELIVERY_AREAS, DEFAULT_DELIVERY_AREAS);
  }

  saveDeliveryArea(area) {
    const areas = this.getDeliveryAreas();
    if (area.id) {
      const idx = areas.findIndex(a => a.id === area.id);
      if (idx !== -1) {
        areas[idx] = { ...areas[idx], ...area };
      } else {
        areas.push(area);
      }
    } else {
      area.id = 'area-' + Date.now();
      areas.push(area);
    }
    this.set(STORAGE_KEYS.DELIVERY_AREAS, areas);
    return area;
  }

  deleteDeliveryArea(id) {
    let areas = this.getDeliveryAreas();
    areas = areas.filter(a => a.id !== id);
    this.set(STORAGE_KEYS.DELIVERY_AREAS, areas);
    return true;
  }

  // --- Menu Items ---
  getMenuItems(categoryId = 'all', searchQuery = '') {
    let items = this.get(STORAGE_KEYS.MENU_ITEMS, DEFAULT_MENU_ITEMS);

    if (categoryId && categoryId !== 'all') {
      items = items.filter(item => item.category_id === categoryId);
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      items = items.filter(item =>
        item.name.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
      );
    }

    return items.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  getMenuItemById(id) {
    const items = this.get(STORAGE_KEYS.MENU_ITEMS, DEFAULT_MENU_ITEMS);
    return items.find(i => i.id === id) || null;
  }

  saveMenuItem(item) {
    const items = this.get(STORAGE_KEYS.MENU_ITEMS, DEFAULT_MENU_ITEMS);
    if (item.id) {
      const idx = items.findIndex(i => i.id === item.id);
      if (idx !== -1) {
        items[idx] = { ...items[idx], ...item };
      } else {
        items.push(item);
      }
    } else {
      item.id = 'item-' + Date.now();
      item.order = items.length + 1;
      items.push(item);
    }
    this.set(STORAGE_KEYS.MENU_ITEMS, items);
    return item;
  }

  deleteMenuItem(id) {
    let items = this.get(STORAGE_KEYS.MENU_ITEMS, DEFAULT_MENU_ITEMS);
    items = items.filter(i => i.id !== id);
    this.set(STORAGE_KEYS.MENU_ITEMS, items);
    return true;
  }

  reorderMenuItem(id, direction) {
    const items = this.get(STORAGE_KEYS.MENU_ITEMS, DEFAULT_MENU_ITEMS);
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return;

    if (direction === 'up' && idx > 0) {
      const temp = items[idx];
      items[idx] = items[idx - 1];
      items[idx - 1] = temp;
    } else if (direction === 'down' && idx < items.length - 1) {
      const temp = items[idx];
      items[idx] = items[idx + 1];
      items[idx + 1] = temp;
    }

    // Re-assign order index
    items.forEach((item, index) => {
      item.order = index + 1;
    });

    this.set(STORAGE_KEYS.MENU_ITEMS, items);
  }

  toggleSoldOut(id) {
    const item = this.getMenuItemById(id);
    if (item) {
      item.is_sold_out = !item.is_sold_out;
      this.saveMenuItem(item);
    }
    return item;
  }

  // --- Orders ---
  getOrders(statusFilter = 'all') {
    let orders = this.get(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
    if (statusFilter && statusFilter !== 'all') {
      orders = orders.filter(o => o.status === statusFilter);
    }
    return orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  saveOrder(order) {
    const orders = this.get(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
    if (!order.id) {
      order.id = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
      order.created_at = new Date().toISOString();
      order.status = order.status || 'pending';
    }
    orders.unshift(order);
    this.set(STORAGE_KEYS.ORDERS, orders);
    return order;
  }

  updateOrderStatus(orderId, status) {
    const orders = this.getOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      orders[idx].status = status;
      this.set(STORAGE_KEYS.ORDERS, orders);
      return orders[idx];
    }
    return null;
  }

  // --- Custom Enquiries ---
  getEnquiries(statusFilter = 'all') {
    let list = this.get(STORAGE_KEYS.ENQUIRIES, DEFAULT_ENQUIRIES);
    if (statusFilter && statusFilter !== 'all') {
      list = list.filter(e => e.status === statusFilter);
    }
    return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  saveEnquiry(enquiry) {
    const list = this.get(STORAGE_KEYS.ENQUIRIES, DEFAULT_ENQUIRIES);
    if (!enquiry.id) {
      enquiry.id = 'ENQ-' + Math.floor(100 + Math.random() * 900);
      enquiry.created_at = new Date().toISOString();
      enquiry.status = enquiry.status || 'pending';
    }
    list.unshift(enquiry);
    this.set(STORAGE_KEYS.ENQUIRIES, list);
    return enquiry;
  }

  updateEnquiryStatus(enquiryId, status) {
    const list = this.getEnquiries();
    const idx = list.findIndex(e => e.id === enquiryId);
    if (idx !== -1) {
      list[idx].status = status;
      this.set(STORAGE_KEYS.ENQUIRIES, list);
      return list[idx];
    }
    return null;
  }

  // --- Gallery ---
  getGallery() {
    return this.get(STORAGE_KEYS.GALLERY, DEFAULT_GALLERY);
  }

  saveGalleryItem(item) {
    const gallery = this.getGallery();
    if (item.id) {
      const idx = gallery.findIndex(g => g.id === item.id);
      if (idx !== -1) {
        gallery[idx] = { ...gallery[idx], ...item };
      } else {
        gallery.push(item);
      }
    } else {
      item.id = 'gal-' + Date.now();
      gallery.unshift(item);
    }
    this.set(STORAGE_KEYS.GALLERY, gallery);
    return item;
  }

  deleteGalleryItem(id) {
    let gallery = this.getGallery();
    gallery = gallery.filter(g => g.id !== id);
    this.set(STORAGE_KEYS.GALLERY, gallery);
    return true;
  }

  // --- Reviews ---
  getReviews(activeOnly = false) {
    let reviews = this.get(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
    if (activeOnly) {
      reviews = reviews.filter(r => r.is_active !== false);
    }
    return reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  saveReview(review) {
    const reviews = this.get(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
    if (review.id) {
      const idx = reviews.findIndex(r => r.id === review.id);
      if (idx !== -1) {
        reviews[idx] = { ...reviews[idx], ...review };
      } else {
        reviews.push(review);
      }
    } else {
      review.id = 'rev-' + Date.now();
      if (!review.date) review.date = new Date().toISOString().split('T')[0];
      if (review.is_active === undefined) review.is_active = true;
      reviews.unshift(review);
    }
    this.set(STORAGE_KEYS.REVIEWS, reviews);
    return review;
  }

  deleteReview(id) {
    let reviews = this.get(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
    reviews = reviews.filter(r => r.id !== id);
    this.set(STORAGE_KEYS.REVIEWS, reviews);
    return true;
  }

  // --- Reset & Backup ---
  resetToDefaults() {
    this.set(STORAGE_KEYS.SETTINGS, DEFAULT_SITE_SETTINGS);
    this.set(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
    this.set(STORAGE_KEYS.DELIVERY_AREAS, DEFAULT_DELIVERY_AREAS);
    this.set(STORAGE_KEYS.MENU_ITEMS, DEFAULT_MENU_ITEMS);
    this.set(STORAGE_KEYS.GALLERY, DEFAULT_GALLERY);
    this.set(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
    this.set(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
    this.set(STORAGE_KEYS.ENQUIRIES, DEFAULT_ENQUIRIES);
    return true;
  }

  exportData() {
    return {
      settings: this.getSettings(),
      categories: this.getCategories(),
      delivery_areas: this.getDeliveryAreas(),
      menu_items: this.getMenuItems('all'),
      gallery: this.getGallery(),
      reviews: this.getReviews(),
      orders: this.getOrders(),
      enquiries: this.getEnquiries(),
      exported_at: new Date().toISOString()
    };
  }

  importData(data) {
    if (!data) return false;
    if (data.settings) this.set(STORAGE_KEYS.SETTINGS, data.settings);
    if (data.categories) this.set(STORAGE_KEYS.CATEGORIES, data.categories);
    if (data.delivery_areas) this.set(STORAGE_KEYS.DELIVERY_AREAS, data.delivery_areas);
    if (data.menu_items) this.set(STORAGE_KEYS.MENU_ITEMS, data.menu_items);
    if (data.gallery) this.set(STORAGE_KEYS.GALLERY, data.gallery);
    if (data.reviews) this.set(STORAGE_KEYS.REVIEWS, data.reviews);
    if (data.orders) this.set(STORAGE_KEYS.ORDERS, data.orders);
    if (data.enquiries) this.set(STORAGE_KEYS.ENQUIRIES, data.enquiries);
    return true;
  }

  // --- Real-time Nigeria Opening Hours Calculation ---
  getNigerianTimeStatus() {
    const settings = this.getSettings();

    try {
      // Get current date & time in Africa/Lagos timezone
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Africa/Lagos',
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
      });
      const parts = formatter.formatToParts(new Date());
      const weekdayPart = parts.find(p => p.type === 'weekday')?.value;
      const hourPart = parseInt(parts.find(p => p.type === 'hour')?.value || '12', 10);
      const minutePart = parseInt(parts.find(p => p.type === 'minute')?.value || '0', 10);

      const currentMinutes = hourPart * 60 + minutePart;
      const isSunday = weekdayPart === 'Sun';

      let openMinutes, closeMinutes, closeTimeStr, nextOpenStr;

      if (isSunday) {
        openMinutes = (settings.sunday_open_hour || 10) * 60;
        closeMinutes = (settings.sunday_close_hour || 18) * 60;
        closeTimeStr = '6:00 PM';
        nextOpenStr = 'Opens Mon 8:00 AM';
      } else {
        openMinutes = (settings.weekday_open_hour || 8) * 60;
        closeMinutes = (settings.weekday_close_hour || 20) * 60;
        closeTimeStr = '8:00 PM';
        nextOpenStr = 'Opens 8:00 AM';
      }

      const isOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes;

      return {
        isOpen,
        badgeText: isOpen ? `Open Now (until ${closeTimeStr})` : `Closed Now (${nextOpenStr})`,
        nigeriaTime: `${String(hourPart).padStart(2, '0')}:${String(minutePart).padStart(2, '0')} WAT`,
        weekday: weekdayPart,
        isSunday
      };
    } catch (e) {
      console.warn('Fallback timezone calculation', e);
      return {
        isOpen: true,
        badgeText: 'Open Now (8:00 AM - 8:00 PM)',
        nigeriaTime: 'WAT',
        isSunday: false
      };
    }
  }

  // --- Currency Formatting Utility ---
  formatNaira(amount) {
    if (amount === undefined || amount === null || amount === 0) {
      return '₦0';
    }
    return '₦' + Number(amount).toLocaleString('en-NG');
  }
}

export const store = new DataStore();
