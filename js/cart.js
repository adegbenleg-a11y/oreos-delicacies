/**
 * OREOS DELICACIES - Cart & WhatsApp Checkout System
 */

import { store } from './store.js';

const CART_STORAGE_KEY = 'oreos_active_cart_v1';

class CartManager {
  constructor() {
    this.listeners = [];
    this.cart = this.loadCart();
    this.selectedAreaId = 'area-walkin';
    this.customerInfo = {
      name: '',
      phone: '',
      note: ''
    };
  }

  loadCart() {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.cart));
      this.notify();
    } catch (e) {
      console.error('Error saving cart', e);
    }
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.listeners.forEach(cb => cb(this.cart));
  }

  getItems() {
    return this.cart;
  }

  getItemCount() {
    return this.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }

  addItem(menuItem, variantName, quantity = 1, note = '') {
    // Find variant details
    const variant = menuItem.variants.find(v => v.name === variantName) || menuItem.variants[0];
    const unitPrice = variant ? variant.price : 0;
    const cartItemId = `${menuItem.id}__${variant.name}`;

    const existingIndex = this.cart.findIndex(i => i.cartItemId === cartItemId);
    if (existingIndex !== -1) {
      this.cart[existingIndex].quantity += quantity;
    } else {
      this.cart.push({
        cartItemId,
        itemId: menuItem.id,
        name: menuItem.name,
        image: menuItem.image,
        variantName: variant.name,
        unitPrice: unitPrice,
        quantity: quantity,
        itemNote: note
      });
    }

    this.saveCart();
    return true;
  }

  updateQuantity(cartItemId, delta) {
    const item = this.cart.find(i => i.cartItemId === cartItemId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      this.removeItem(cartItemId);
    } else {
      this.saveCart();
    }
  }

  removeItem(cartItemId) {
    this.cart = this.cart.filter(i => i.cartItemId !== cartItemId);
    this.saveCart();
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  setSelectedArea(areaId) {
    this.selectedAreaId = areaId;
    this.notify();
  }

  getSelectedArea() {
    const areas = store.getDeliveryAreas();
    return areas.find(a => a.id === this.selectedAreaId) || areas[0] || { name: 'Walk-in', fee: 0 };
  }

  getSubtotal() {
    return this.cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  }

  getDeliveryFee() {
    const area = this.getSelectedArea();
    return area ? (Number(area.fee) || 0) : 0;
  }

  getTotal() {
    return this.getSubtotal() + this.getDeliveryFee();
  }

  /**
   * Generates WhatsApp order message and submits order to database
   */
  processWhatsAppOrder(customerName, customerPhone, customerNotes = '') {
    if (this.cart.length === 0) {
      throw new Error('Your cart is empty. Please add some delicious treats first!');
    }

    if (!customerName || !customerName.trim()) {
      throw new Error('Please enter your full name for the order.');
    }

    if (!customerPhone || !customerPhone.trim()) {
      throw new Error('Please enter your phone number so we can reach you.');
    }

    const settings = store.getSettings();
    const area = this.getSelectedArea();
    const deliveryFee = this.getDeliveryFee();
    const subtotal = this.getSubtotal();
    const total = subtotal + deliveryFee;

    // Snapshot of cart items for confirmation screen
    const itemsSnapshot = this.cart.map(i => ({
      name: i.name,
      variant: i.variantName,
      quantity: i.quantity,
      price: i.unitPrice,
      image: i.image
    }));

    // 1. Save order to store (DB / LocalStorage)
    const newOrder = store.saveOrder({
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      delivery_area: area.name,
      delivery_fee: deliveryFee === 0 ? 'FREE (Store Pickup)' : store.formatNaira(deliveryFee),
      items: itemsSnapshot,
      subtotal: subtotal,
      total: total,
      notes: customerNotes.trim(),
      status: 'pending'
    });

    // 2. Format WhatsApp Message for Bulk Order
    const orderItemsText = itemsSnapshot.map((item, idx) => {
      const lineTotal = item.price * item.quantity;
      return `${idx + 1}. *${item.name}*\n   ▫️ Size/Variant: ${item.variant}\n   ▫️ Qty: ${item.quantity} × ${store.formatNaira(item.price)} = ${store.formatNaira(lineTotal)}`;
    }).join('\n\n');

    const whatsappNumber = settings.whatsapp || '2347033396558';

    const message = 
`🧁 *BULK ORDER: OREOS DELICACIES* 🧁
----------------------------------------
*Order ID:* #${newOrder.id}
*Customer Name:* ${customerName.trim()}
*Phone Number:* ${customerPhone.trim()}

📍 *DELIVERY DETAILS:*
*Destination Area:* ${area.name}
*Delivery Fee:* ${deliveryFee === 0 ? 'FREE (Store Pickup)' : store.formatNaira(deliveryFee)}
${customerNotes.trim() ? `*Delivery Address / Landmark Notes:* ${customerNotes.trim()}\n` : ''}
----------------------------------------
🛍️ *ITEMS ORDERED IN BULK:*
${orderItemsText}
----------------------------------------
💰 *PAYMENT SUMMARY:*
*Treats Subtotal:* ${store.formatNaira(subtotal)}
*Delivery Fee:* ${deliveryFee === 0 ? 'FREE' : store.formatNaira(deliveryFee)}
*GRAND TOTAL:* ${store.formatNaira(total)}
----------------------------------------
✨ *Please confirm item availability and send payment account details. Thank you for choosing Oreos Delicacies!*`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Clear cart after dispatch
    this.clearCart();

    return {
      order: newOrder,
      whatsappUrl: whatsappUrl,
      items: itemsSnapshot,
      area: area,
      deliveryFee: deliveryFee,
      subtotal: subtotal,
      total: total,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerNotes: customerNotes.trim()
    };
  }

  /**
   * Process Custom Event Enquiry (WhatsApp + DB)
   */
  processEventEnquiry(formData) {
    const { name, phone, eventType, eventDate, guestCount, details } = formData;

    if (!name || !name.trim()) throw new Error('Please enter your name');
    if (!phone || !phone.trim()) throw new Error('Please enter your contact phone number');
    if (!eventType) throw new Error('Please select an event type');
    if (!details || !details.trim()) throw new Error('Please provide some details for your event');

    const settings = store.getSettings();

    // 1. Save Enquiry to DB
    const savedEnquiry = store.saveEnquiry({
      customer_name: name.trim(),
      customer_phone: phone.trim(),
      event_type: eventType,
      event_date: eventDate || 'Not specified',
      guest_count: guestCount || 'Not specified',
      details: details.trim(),
      status: 'pending'
    });

    // 2. Format WhatsApp message
    const message =
`🎉 *EVENT / CUSTOM ORDER ENQUIRY* 🎉
*OREOS DELICACIES*
----------------------------------------
*Enquiry Ref:* #${savedEnquiry.id}
*Name:* ${name.trim()}
*Phone:* ${phone.trim()}
*Event Type:* ${eventType}
*Event Date:* ${eventDate || 'TBD'}
*Estimated Guests:* ${guestCount || 'TBD'}

📝 *Details & Special Requests:*
${details.trim()}
----------------------------------------
✨ *Looking forward to your consultation and quotation!*`;

    const whatsappNumber = settings.whatsapp || '2347033396558';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    return {
      enquiry: savedEnquiry,
      whatsappUrl: whatsappUrl
    };
  }
}

export const cart = new CartManager();
