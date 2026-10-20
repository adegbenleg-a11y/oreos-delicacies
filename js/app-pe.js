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

  grid.innerHTML = sorted.map(item => {
    const firstVariant = item.variants?.[0];
    const price = firstVariant ? formatPrice(firstVariant.price) : '';
    const isSoldOut = item.is_sold_out;
    
    const badge = item.is_signature
      ? '<span class="product-card-badge">🔥 Signature</span>'
      : item.is_featured
        ? '<span class="product-card-badge">⭐ Popular</span>'
        : isSoldOut
          ? '<span class="product-card-badge" style="background:#888;">Sold Out</span>'
          : '';

    const stars = `
      <div class="product-card-stars">
        ${Array(5).fill(0).map(() => `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#F5A623" stroke="#F5A623" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`).join('')}
      </div>
    `;

    const whatsappLink = `https://wa.me/2347033396558?text=${encodeURIComponent(`Hello Oreos Delicacies! I want to order ${item.name}${firstVariant ? ` (${firstVariant.name})` : ''}.`)}`;

    return `
      <div class="product-card" id="product-${item.id}">
        <div class="product-card-image">
          <img src="${item.image}" alt="${item.name}" loading="lazy">
          ${badge}
          <div class="product-card-actions">
            <a href="${whatsappLink}" target="_blank" rel="noopener" class="product-card-action-btn" title="Order on WhatsApp">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </a>
          </div>
        </div>
        <div class="product-card-info">
          <h3>${item.name}</h3>
          <div class="product-category">${getCategoryName(item.category_id)}</div>
          <div class="product-price">${price}</div>
          ${stars}
        </div>
      </div>
    `;
  }).join('');
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
// 4. DELIVERY TABLE
// ========================================
function renderDeliveryTable() {
  const tbody = document.getElementById('delivery-table-body');
  if (!tbody) return;
  
  const areas = store.getDeliveryAreas();
  
  tbody.innerHTML = areas.map(area => {
    const feeClass = area.fee === 0 ? 'free-badge' : '';
    const feeText = area.fee === 0 ? 'FREE' : formatPrice(area.fee);
    
    return `
      <tr>
        <td><strong>${area.name}</strong></td>
        <td><span class="fee-badge ${feeClass}">${feeText}</span></td>
        <td>${area.time_estimate || '—'}</td>
      </tr>
    `;
  }).join('');
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
// 6. TESTIMONIALS / REVIEWS
// ========================================
function renderReviews() {
  const grid = document.getElementById('reviews-grid');
  if (!grid) return;
  
  const REVIEWS_KEY = 'oreos_reviews_v6';
  const reviews = store.get(REVIEWS_KEY, []);
  
  if (reviews.length === 0) {
    // Fallback static reviews
    grid.innerHTML = getStaticReviews();
    return;
  }
  
  grid.innerHTML = reviews.map(review => `
    <div class="testimonial-card">
      <span class="quote-icon">"</span>
      <div class="stars">
        ${Array(review.rating || 5).fill(0).map(() => `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#F5A623" stroke="#F5A623" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`).join('')}
      </div>
      <p>${review.text || review.comment || ''}</p>
      <div class="author">${review.name || review.author || 'Happy Customer'} <span>— ${review.location || 'Abeokuta'}</span></div>
    </div>
  `).join('');
}

function getStaticReviews() {
  const reviews = [
    { name: 'Temitope A.', text: 'The eggrolls are incredible! Best I\'ve ever tasted in Abeokuta. Crispy on the outside, perfect seasoning inside. My FUNAAB friends are addicted!', rating: 5, location: 'FUNAAB' },
    { name: 'Bola Ogunmola', text: 'Ordered a 3-tier birthday cake for my daughter and it was absolutely stunning! The taste was even better than it looked. Oreofe is truly talented.', rating: 5, location: 'Isolu' },
    { name: 'Adewale K.', text: 'Fast delivery to Camp, fresh donuts that melted in my mouth. The milky donut pack was perfect for our hostel movie night. Will definitely order again!', rating: 5, location: 'Camp, Abeokuta' },
    { name: 'Chioma Eze', text: 'The treat box I ordered for Valentine\'s was breathtaking. Beautiful packaging, delicious contents. My girlfriend was so impressed. Thank you Oreos!', rating: 5, location: 'Harmony' },
    { name: 'Segun Bakare', text: 'I\'ve tried many bakeries in Abeokuta but Oreos Delicacies stands out. Their attention to hygiene and quality is top notch. The plantain chips are addictive!', rating: 5, location: 'Obantoko' },
    { name: 'Folake M.', text: 'Oreofe made the most beautiful bento cake for my bridal shower. All my guests kept asking where I got it. Affordable prices too!', rating: 5, location: 'Abeokuta' },
  ];

  return reviews.map(review => `
    <div class="testimonial-card">
      <span class="quote-icon">"</span>
      <div class="stars">
        ${Array(review.rating).fill(0).map(() => `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#F5A623" stroke="#F5A623" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`).join('')}
      </div>
      <p>${review.text}</p>
      <div class="author">${review.name} <span>— ${review.location}</span></div>
    </div>
  `).join('');
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
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      menu.classList.remove('active');
    });
  }
  
  // Close on link click
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('active');
    });
  });
}

function updateCartBadge() {
  const badge = document.getElementById('cart-count');
  if (!badge) return;
  const count = cart.getItemCount();
  badge.textContent = count;
  badge.style.display = count > 0 ? 'flex' : 'none';
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
  renderDeliveryTable();
  renderGallery();
  renderReviews();
  initEnquiryForm();
  initMobileMenu();
  initScrollEffects();
  initLightbox();
  initFeatureSteps();
  updateCartBadge();
  cart.subscribe(() => updateCartBadge());
  
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});
