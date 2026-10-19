/**
 * OREOS DELICACIES - Scroll Morph Hero Component
 * Inspired by @prashantsom75/scroll-morph-hero (21st.dev)
 * 
 * Features:
 * - 4 Morphing States: Scatter, Circle Orbit, Rainbow Arc, and Scroll-Driven Progress
 * - 16 Authentic Bakery Delicacies with user photos & verified Naira prices
 * - Mouse parallax 3D effect
 * - Interactive hover card elevation with price pill
 * - Click to jump directly to menu item or quick-order
 */

export const MORPH_ITEMS = [
  {
    id: "item-cake-bento-2layer",
    name: "Size 5\" Bento 2-Layer",
    price: "₦18,000",
    image: "assets/images/real-bento-2layer-18k.jpg",
    scatter: { x: 9, y: 14, rot: -12 }
  },
  {
    id: "item-treat-box-wine",
    name: "Deluxe Treat Box (Wine)",
    price: "₦14,000",
    image: "assets/images/real-treat-box-14k.jpg",
    scatter: { x: 27, y: 8, rot: 8 }
  },
  {
    id: "item-snacks-box",
    name: "Celebration Snacks Mega Box",
    price: "₦25,000",
    image: "assets/images/real-snacks-box-25k.jpg",
    scatter: { x: 72, y: 10, rot: -10 }
  },
  {
    id: "item-signature-eggroll",
    name: "Oreofe's Signature Eggroll",
    price: "₦700",
    image: "assets/images/real-eggroll-700.jpg",
    scatter: { x: 90, y: 16, rot: 14 }
  },
  {
    id: "item-meat-pie-filling",
    name: "Classic Golden Meat Pie",
    price: "₦1,200",
    image: "assets/images/real-meat-pie-filling-1200.jpg",
    scatter: { x: 6, y: 38, rot: -8 }
  },
  {
    id: "item-cake-size6",
    name: "Size 6\" Layer Cake",
    price: "₦15,000",
    image: "assets/images/real-cake-size6-15k.jpg",
    scatter: { x: 92, y: 38, rot: 10 }
  },
  {
    id: "item-milky-donut-box",
    name: "Milky Stuffed Donuts",
    price: "₦3,500",
    image: "assets/images/real-milky-donut-3500.jpg",
    scatter: { x: 7, y: 64, rot: 12 }
  },
  {
    id: "item-fruit-parfait",
    name: "Greek Fruit Parfait",
    price: "₦4,000",
    image: "assets/images/real-fruit-parfait-4k.jpg",
    scatter: { x: 91, y: 62, rot: -10 }
  },
  {
    id: "item-cake-size8",
    name: "Size 8\" One Layer Cake",
    price: "₦30,000",
    image: "assets/images/real-cake-size8-30k.jpg",
    scatter: { x: 13, y: 88, rot: -14 }
  },
  {
    id: "item-treat-box-juice",
    name: "Sweetheart Treat Box",
    price: "₦13,000",
    image: "assets/images/real-treat-box-chivita-13k.jpg",
    scatter: { x: 31, y: 92, rot: 6 }
  },
  {
    id: "item-cake-size10",
    name: "Size 10\" Celebration Cake",
    price: "₦50,000",
    image: "assets/images/real-cake-size10.jpg",
    scatter: { x: 69, y: 91, rot: -6 }
  },
  {
    id: "item-balloon-treat",
    name: "Hot Air Balloon Box",
    price: "₦35,000",
    image: "assets/images/real-balloon-treat-35k.jpg",
    scatter: { x: 86, y: 86, rot: 12 }
  },
  {
    id: "item-banana-bread",
    name: "Artisan Banana Bread",
    price: "₦3,000",
    image: "assets/images/real-banana-bread-3k.jpg",
    scatter: { x: 18, y: 26, rot: 6 }
  },
  {
    id: "item-brownies",
    name: "Belgian Brownies",
    price: "₦2,500",
    image: "assets/images/real-brownies-2500.jpg",
    scatter: { x: 80, y: 25, rot: -8 }
  },
  {
    id: "item-bento-cupcake",
    name: "Bento + Cupcake Combo",
    price: "₦14,000",
    image: "assets/images/real-bento-cupcake.jpg",
    scatter: { x: 21, y: 74, rot: -8 }
  },
  {
    id: "item-plantain-chips-jar",
    name: "Plantain Chips Jar",
    price: "₦3,500",
    image: "assets/images/real-plantain-chips-3500.jpg",
    scatter: { x: 79, y: 75, rot: 9 }
  }
];

class ScrollMorphHero {
  constructor() {
    this.container = document.getElementById('morph-hero-container');
    this.stage = document.getElementById('morph-cards-stage');
    this.cards = [];
    this.currentMode = 'scatter'; // 'scatter' | 'circle' | 'arc'
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    this.isManualMode = false;
    this.rafId = null;

    if (this.stage && this.container) {
      this.init();
    }
  }

  init() {
    this.createCards();
    this.bindEvents();
    this.updateLayout(this.currentMode);
    this.startParallaxLoop();
  }

  createCards() {
    this.stage.innerHTML = '';
    this.cards = MORPH_ITEMS.map((item, index) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'morph-card group';
      cardEl.setAttribute('data-id', item.id);
      cardEl.setAttribute('data-index', index);
      cardEl.setAttribute('role', 'button');
      cardEl.setAttribute('tabindex', '0');
      cardEl.setAttribute('aria-label', `${item.name} - ${item.price}`);

      cardEl.innerHTML = `
        <div class="morph-card-inner">
          <img 
            src="${item.image}" 
            alt="${item.name}" 
            loading="eager"
            class="morph-card-img"
            onerror="this.src='assets/images/real-cake-size10.jpg'"
          />
          <div class="morph-card-badge">
            <span class="morph-card-badge-title">${item.name}</span>
            <span class="morph-card-badge-price">${item.price}</span>
          </div>
        </div>
      `;

      cardEl.addEventListener('click', () => {
        const targetEl = document.getElementById('menu');
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      });

      this.stage.appendChild(cardEl);

      return {
        el: cardEl,
        item: item,
        index: index,
        currentPos: { x: 50, y: 50, rot: 0, scale: 1 }
      };
    });
  }

  getCoordinates(mode, index, total) {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    if (mode === 'scatter') {
      const scatterBase = MORPH_ITEMS[index].scatter;
      // On mobile, keep scatter positions slightly more compact to fit screen
      let x = scatterBase.x;
      let y = scatterBase.y;
      if (isMobile) {
        x = 50 + (scatterBase.x - 50) * 0.78;
        y = 50 + (scatterBase.y - 50) * 0.82;
      }
      return {
        x: x,
        y: y,
        rot: scatterBase.rot,
        scale: isMobile ? 0.75 : isTablet ? 0.88 : 1
      };
    }

    if (mode === 'circle') {
      // Concentric circular orbit around (50%, 50%)
      const angle = (2 * Math.PI * index / total) - (Math.PI / 2);
      const rx = isMobile ? 36 : isTablet ? 40 : 42; // percent width
      const ry = isMobile ? 38 : isTablet ? 42 : 44; // percent height
      const x = 50 + rx * Math.cos(angle);
      const y = 50 + ry * Math.sin(angle);
      // Tangential or subtle rotation
      const rot = Math.sin(angle) * 15;
      return {
        x: x,
        y: y,
        rot: rot,
        scale: isMobile ? 0.72 : isTablet ? 0.85 : 0.98
      };
    }

    if (mode === 'arc') {
      // Sweeping rainbow arc across the bottom half
      const spanDeg = isMobile ? 120 : 150;
      const startDeg = -spanDeg / 2;
      const deg = startDeg + (spanDeg * index / (total - 1));
      const rad = deg * (Math.PI / 180);

      const arcRadiusX = isMobile ? 42 : 44;
      const x = 50 + arcRadiusX * Math.sin(rad);
      // Arch curve upwards
      const arcDrop = Math.cos(rad);
      const y = isMobile ? (78 - arcDrop * 18) : (82 - arcDrop * 24);
      const rot = deg * 0.7;

      return {
        x: x,
        y: y,
        rot: rot,
        scale: isMobile ? 0.72 : isTablet ? 0.86 : 1
      };
    }

    return { x: 50, y: 50, rot: 0, scale: 1 };
  }

  updateLayout(mode) {
    this.currentMode = mode;
    const total = this.cards.length;

    this.cards.forEach((card, idx) => {
      const coords = this.getCoordinates(mode, idx, total);
      card.targetPos = coords;

      card.el.style.left = `${coords.x}%`;
      card.el.style.top = `${coords.y}%`;
      card.el.style.transform = `translate(-50%, -50%) rotate(${coords.rot}deg) scale(${coords.scale})`;
    });

    // Update active UI pills
    document.querySelectorAll('.morph-mode-pill').forEach(pill => {
      const pillMode = pill.getAttribute('data-mode');
      if (pillMode === mode) {
        pill.classList.add('bg-[#E03166]', 'text-white', 'shadow-md');
        pill.classList.remove('bg-white/90', 'text-gray-700');
      } else {
        pill.classList.remove('bg-[#E03166]', 'text-white', 'shadow-md');
        pill.classList.add('bg-white/90', 'text-gray-700');
      }
    });
  }

  bindEvents() {
    // Mode switcher buttons
    document.querySelectorAll('.morph-mode-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        const mode = pill.getAttribute('data-mode');
        this.isManualMode = true;
        this.updateLayout(mode);
      });
    });

    // Scroll-driven morphing (transitions: Scatter -> Circle -> Arc)
    window.addEventListener('scroll', () => {
      if (this.isManualMode) return; // Allow user manual control override

      const rect = this.container.getBoundingClientRect();
      const heroHeight = this.container.offsetHeight;
      const scrollY = -rect.top;

      if (scrollY <= 0) {
        if (this.currentMode !== 'scatter') this.updateLayout('scatter');
        return;
      }

      const progress = Math.max(0, Math.min(1, scrollY / (heroHeight * 0.75)));

      if (progress < 0.35) {
        if (this.currentMode !== 'scatter') this.updateLayout('scatter');
      } else if (progress >= 0.35 && progress < 0.75) {
        if (this.currentMode !== 'circle') this.updateLayout('circle');
      } else {
        if (this.currentMode !== 'arc') this.updateLayout('arc');
      }
    }, { passive: true });

    // Reset manual override if user scrolls back to absolute top
    window.addEventListener('scroll', () => {
      if (window.scrollY === 0) {
        this.isManualMode = false;
        this.updateLayout('scatter');
      }
    }, { passive: true });

    // Mouse Parallax
    window.addEventListener('mousemove', (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      this.targetMouseX = (e.clientX - centerX) / centerX;
      this.targetMouseY = (e.clientY - centerY) / centerY;
    }, { passive: true });

    // Handle Window Resize
    window.addEventListener('resize', () => {
      this.updateLayout(this.currentMode);
    });
  }

  startParallaxLoop() {
    const loop = () => {
      this.mouseX += (this.targetMouseX - this.mouseX) * 0.08;
      this.mouseY += (this.targetMouseY - this.mouseY) * 0.08;

      if (this.stage) {
        const tiltX = this.mouseY * -4;
        const tiltY = this.mouseX * 4;
        this.stage.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      }

      this.rafId = requestAnimationFrame(loop);
    };

    loop();
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ScrollMorphHero();
});
