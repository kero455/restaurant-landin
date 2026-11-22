/**
 * L'AURA RESTAURANT & LOUNGE
 * Core Interactive Logic & Application Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive modules
  initNavbar();
  initMenuFiltering();
  initTastingTray();
  initReservationEngine();
  initDishModal();
  initAmbianceAudio();
  initNewsletter();
});

/* ==========================================================================
   TOAST NOTIFICATION ENGINE
   ========================================================================== */
function showToast(message, icon = '✨') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span style="font-size: 1.2rem;">${icon}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3800);
}

/* ==========================================================================
   NAVBAR & SCROLL BEHAVIOR
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  const links = document.querySelectorAll('.nav-links a');

  // Sticky navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightActiveNav();
  });

  // Mobile menu toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    links.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  // Active section spy
  function highlightActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetLink = document.querySelector(`.nav-links a[href*="${sectionId}"]`);

      if (targetLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetLink.classList.add('active');
        } else {
          targetLink.classList.remove('active');
        }
      }
    });
  }
}

/* ==========================================================================
   MENU DATA & FILTERING ENGINE
   ========================================================================== */
const MENU_DATA = [
  {
    id: 'dish-1',
    name: 'Chilean Sea Bass & Caviar',
    frenchTitle: 'Bar Sauvage & Caviar Impérial',
    category: 'starters',
    price: 68,
    image: 'assets/hero_dish.jpg',
    badge: 'Chef Signature',
    desc: 'Pan-seared Patagonian sea bass, saffron velouté, Imperial Ossetra caviar, micro herbs, and 24K edible gold flakes.',
    tags: ['Gluten-Free', 'Wild-Caught', 'Caviar Pair'],
    sommelierPairing: 'Dom Pérignon Vintage 2013 Champagne',
    story: 'Sourced from the deep, pristine sub-Antarctic waters and seared to crisp perfection, harmonized by saffron infused from La Mancha.'
  },
  {
    id: 'dish-2',
    name: 'A5 Miyazaki Wagyu Medallions',
    frenchTitle: 'Filet de Bœuf Wagyu A5 & Truffe Noire',
    category: 'mains',
    price: 115,
    image: 'assets/wagyu_steak.jpg',
    badge: 'Connoisseur Pick',
    desc: 'Charcoal grilled Miyazaki Japanese Wagyu, Périgord black truffle demi-glace, wild chanterelles, and smoked potato purée.',
    tags: ['A5 Grade', 'Black Truffle', 'Signature'],
    sommelierPairing: 'Château Margaux Premier Grand Cru Classé 2015',
    story: 'Certified Japanese Miyazaki beef with BMS 11 marble grading, aged for 35 days and finished with charred oak aroma.'
  },
  {
    id: 'dish-3',
    name: 'Smoked Velvet Old Fashioned',
    frenchTitle: 'Cocktail Artisanal Fumé au Bois de Cèdre',
    category: 'cocktails',
    price: 28,
    image: 'assets/cocktail.jpg',
    badge: 'Mixologist Special',
    desc: 'Small-batch 12-year bourbon, aromatic bitters, flame-expressed Valencia orange oils, torched rosemary, and cedar smoke.',
    tags: ['Artisanal', 'Smoky', 'Crystal Ice'],
    sommelierPairing: 'Accompaniment to Wagyu or Dark Chocolate',
    story: 'Cold-smoked table-side under a hand-blown cloche using charred French oak staves and alpine botanicals.'
  },
  {
    id: 'dish-4',
    name: 'Valrhona Grand Cru Chocolate Sphere',
    frenchTitle: 'Sphère Chocolat Noir & Caramel Flambé',
    category: 'desserts',
    price: 34,
    image: 'assets/dessert.jpg',
    badge: 'Pastry Masterpiece',
    desc: '70% Guanaja dark chocolate sphere, warm salted butter bourbon caramel tableside pour, wild berry coulis, violet petals.',
    tags: ['Valrhona', 'Warm Caramel', 'Vegetarian'],
    sommelierPairing: 'Château d’Yquem Sauternes 2011',
    story: 'A dramatic sensory finish where warm caramel melts through the sphere revealing roasted hazelnut praline mousse.'
  },
  {
    id: 'dish-5',
    name: 'Maine Lobster Bisque Espuma',
    frenchTitle: 'Bisque de Homard du Maine & Cognac',
    category: 'starters',
    price: 42,
    image: 'assets/hero_dish.jpg',
    badge: 'Popular',
    desc: 'Velvety lobster essence flambéed with Hennessy XO cognac, tarragon cream, and butter-poached lobster medallion.',
    tags: ['Fresh Catch', 'Rich & Silky'],
    sommelierPairing: 'Meursault 1er Cru Les Charmes',
    story: 'Slow-simmered for 18 hours with roasted shells and aromatic mirepoix to achieve unmatched intensity.'
  },
  {
    id: 'dish-6',
    name: 'Herb-Crusted Colorado Lamb Rack',
    frenchTitle: 'Carré d’Agneau Rôti aux Herbes de Provence',
    category: 'mains',
    price: 88,
    image: 'assets/wagyu_steak.jpg',
    badge: 'Chef Favorite',
    desc: 'Dijon and rosemary crusted lamb cutlets, caramelized shallot jus, heirloom baby carrots, and mint pea foam.',
    tags: ['Pasture-Raised', 'Provencal'],
    sommelierPairing: 'Barolo DOCG Massolino 2017',
    story: 'Raised on wild mountain clover and roasted gently pink over cherrywood embers.'
  }
];

function initMenuFiltering() {
  const container = document.getElementById('menu-items-grid');
  const filterBtns = document.querySelectorAll('.tab-btn');

  function renderDishes(category = 'all') {
    if (!container) return;
    container.innerHTML = '';

    const filtered = category === 'all' 
      ? MENU_DATA 
      : MENU_DATA.filter(item => item.category === category);

    filtered.forEach(dish => {
      const card = document.createElement('div');
      card.className = 'menu-card';
      card.innerHTML = `
        <div class="menu-card-img-wrap">
          <img src="${dish.image}" alt="${dish.name}" class="menu-card-img" loading="lazy">
          <span class="dish-badge-pill">${dish.badge}</span>
        </div>
        <div class="menu-card-body">
          <div class="menu-card-header">
            <h3 class="menu-dish-name">${dish.name}</h3>
            <span class="menu-dish-price">$${dish.price}</span>
          </div>
          <p class="menu-dish-sub">${dish.frenchTitle}</p>
          <p class="menu-dish-desc">${dish.desc}</p>
          
          <div class="dish-tags">
            ${dish.tags.map(t => `<span class="dish-tag-item">${t}</span>`).join('')}
          </div>

          <div class="menu-card-footer">
            <button class="btn btn-sm btn-outline-gold view-dish-btn" data-id="${dish.id}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              Details
            </button>
            <button class="btn btn-sm btn-gold add-tray-btn" data-id="${dish.id}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
              Add to Tray
            </button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });

    // Attach button listeners
    container.querySelectorAll('.view-dish-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openDishModal(btn.dataset.id);
      });
    });

    container.querySelectorAll('.add-tray-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        addToTray(btn.dataset.id);
      });
    });
  }

  // Filter click handlers
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderDishes(btn.dataset.category);
    });
  });

  // Initial render
  renderDishes('all');
}

/* ==========================================================================
   TASTING TRAY & CART DRAWER
   ========================================================================== */
let tastingTray = [];

function initTastingTray() {
  const openTrayBtn = document.getElementById('open-tray-btn');
  const closeTrayBtn = document.getElementById('close-tray-btn');
  const trayDrawer = document.getElementById('tray-drawer');
  const trayOverlay = document.getElementById('tray-overlay');
  const clearTrayBtn = document.getElementById('clear-tray-btn');
  const checkoutBtn = document.getElementById('tray-checkout-btn');

  function openDrawer() {
    trayDrawer.classList.add('open');
    trayOverlay.classList.add('active');
  }

  function closeDrawer() {
    trayDrawer.classList.remove('open');
    trayOverlay.classList.remove('active');
  }

  if (openTrayBtn) openTrayBtn.addEventListener('click', openDrawer);
  if (closeTrayBtn) closeTrayBtn.addEventListener('click', closeDrawer);
  if (trayOverlay) trayOverlay.addEventListener('click', closeDrawer);

  if (clearTrayBtn) {
    clearTrayBtn.addEventListener('click', () => {
      tastingTray = [];
      updateTrayUI();
      showToast('Tasting tray cleared', '🗑️');
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (tastingTray.length === 0) {
        showToast('Your tasting tray is empty.', 'ℹ️');
        return;
      }
      closeDrawer();
      const resSection = document.getElementById('reservation');
      if (resSection) {
        resSection.scrollIntoView({ behavior: 'smooth' });
        showToast('Proceeding to reserve table with your selected tasting tray.', '🍽️');
      }
    });
  }
}

function addToTray(dishId) {
  const dish = MENU_DATA.find(d => d.id === dishId);
  if (!dish) return;

  const existing = tastingTray.find(item => item.id === dishId);
  if (existing) {
    existing.quantity += 1;
  } else {
    tastingTray.push({ ...dish, quantity: 1 });
  }

  updateTrayUI();
  showToast(`Added "${dish.name}" to your tasting tray`, '✨');
}

function removeFromTray(dishId) {
  tastingTray = tastingTray.filter(item => item.id !== dishId);
  updateTrayUI();
  showToast('Item removed from tray', '🗑️');
}

function updateTrayUI() {
  const trayList = document.getElementById('tray-items-list');
  const badge = document.getElementById('tray-badge-count');
  const totalElem = document.getElementById('tray-total-amount');

  const totalCount = tastingTray.reduce((acc, curr) => acc + curr.quantity, 0);
  if (badge) badge.textContent = totalCount;

  const totalPrice = tastingTray.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  if (totalElem) totalElem.textContent = `$${totalPrice}`;

  if (!trayList) return;

  if (tastingTray.length === 0) {
    trayList.innerHTML = `
      <div class="tray-empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(212,175,55,0.4)" stroke-width="1.5" style="margin-bottom: 12px;">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        <p>Your curated tasting tray is empty.</p>
        <span style="font-size: 0.8rem; color: #666;">Explore our menu to handpick your gourmet journey.</span>
      </div>
    `;
    return;
  }

  trayList.innerHTML = '';
  tastingTray.forEach(item => {
    const itemCard = document.createElement('div');
    itemCard.className = 'tray-item-card';
    itemCard.innerHTML = `
      <div class="tray-item-info">
        <h5>${item.name}</h5>
        <span>${item.quantity} × $${item.price} = $${item.price * item.quantity}</span>
      </div>
      <button class="btn btn-sm btn-glass remove-item-btn" data-id="${item.id}" style="padding: 6px 10px; color: #cf4f58;">
        ✕
      </button>
    `;
    trayList.appendChild(itemCard);
  });

  trayList.querySelectorAll('.remove-item-btn').forEach(btn => {
    btn.addEventListener('click', () => removeFromTray(btn.dataset.id));
  });
}

/* ==========================================================================
   DISH DETAILS MODAL
   ========================================================================== */
function initDishModal() {
  const modalOverlay = document.getElementById('dish-modal-overlay');
  const closeBtn = document.getElementById('close-dish-modal');

  if (closeBtn && modalOverlay) {
    closeBtn.addEventListener('click', () => modalOverlay.classList.remove('active'));
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });
  }
}

function openDishModal(dishId) {
  const dish = MENU_DATA.find(d => d.id === dishId);
  if (!dish) return;

  const modalOverlay = document.getElementById('dish-modal-overlay');
  const modalBody = document.getElementById('dish-modal-body');
  if (!modalOverlay || !modalBody) return;

  modalBody.innerHTML = `
    <div style="border-radius: 14px; overflow: hidden; height: 260px; margin-bottom: 20px;">
      <img src="${dish.image}" alt="${dish.name}" style="width: 100%; height: 100%; object-fit: cover;">
    </div>
    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px;">
      <h3 style="font-family: var(--font-serif); font-size: 1.6rem; color: #fff;">${dish.name}</h3>
      <span style="font-size: 1.6rem; font-weight: 700; color: var(--gold-primary);">$${dish.price}</span>
    </div>
    <p style="font-style: italic; color: var(--gold-light); margin-bottom: 16px;">${dish.frenchTitle}</p>
    
    <p style="color: var(--text-secondary); line-height: 1.7; margin-bottom: 20px;">
      ${dish.story}
    </p>

    <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-gold); border-radius: 10px; padding: 14px; margin-bottom: 24px;">
      <div style="font-size: 0.78rem; text-transform: uppercase; color: var(--gold-primary); letter-spacing: 0.1em; margin-bottom: 4px;">
        🍷 Sommelier Wine Pairing
      </div>
      <div style="color: #fff; font-size: 0.92rem; font-weight: 500;">
        ${dish.sommelierPairing}
      </div>
    </div>

    <div style="display: flex; gap: 14px;">
      <button class="btn btn-gold modal-add-tray" style="flex-grow: 1;">
        Add to Tasting Tray ($${dish.price})
      </button>
    </div>
  `;

  modalBody.querySelector('.modal-add-tray').addEventListener('click', () => {
    addToTray(dish.id);
    modalOverlay.classList.remove('active');
  });

  modalOverlay.classList.add('active');
}

/* ==========================================================================
   RESERVATION ENGINE & DYNAMIC SUMMARY
   ========================================================================== */
function initReservationEngine() {
  const form = document.getElementById('reservation-form');
  const dateInput = document.getElementById('res-date');
  const guestsSelect = document.getElementById('res-guests');
  const areaSelect = document.getElementById('res-area');
  const occasionSelect = document.getElementById('res-occasion');
  const timeSlotBtns = document.querySelectorAll('.time-slot-btn');

  // Set default date to today
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  // Active time slot selection
  let selectedTime = '19:30';
  timeSlotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timeSlotBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedTime = btn.dataset.time;
      updateSummary();
    });
  });

  // Dynamic live summary updater
  function updateSummary() {
    const summaryDate = document.getElementById('sum-date');
    const summaryTime = document.getElementById('sum-time');
    const summaryGuests = document.getElementById('sum-guests');
    const summaryArea = document.getElementById('sum-area');

    if (summaryDate && dateInput) {
      const parsedDate = new Date(dateInput.value + 'T00:00:00');
      summaryDate.textContent = isNaN(parsedDate) 
        ? dateInput.value 
        : parsedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    if (summaryTime) summaryTime.textContent = selectedTime;
    if (summaryGuests && guestsSelect) summaryGuests.textContent = `${guestsSelect.value} Guest(s)`;
    if (summaryArea && areaSelect) summaryArea.textContent = areaSelect.options[areaSelect.selectedIndex]?.text || 'Main Dining Hall';
  }

  // Listen to input changes
  if (dateInput) dateInput.addEventListener('change', updateSummary);
  if (guestsSelect) guestsSelect.addEventListener('change', updateSummary);
  if (areaSelect) areaSelect.addEventListener('change', updateSummary);
  if (occasionSelect) occasionSelect.addEventListener('change', updateSummary);

  updateSummary();

  // Handle Form Submit
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('res-name').value.trim();
      const email = document.getElementById('res-email').value.trim();
      const phone = document.getElementById('res-phone').value.trim();
      const requests = document.getElementById('res-requests').value.trim();

      if (!name || !email || !phone) {
        showToast('Please fill in your name, email, and phone.', '⚠️');
        return;
      }

      // Generate Luxury Booking Reference Code
      const refCode = 'LAU-' + Math.floor(100000 + Math.random() * 900000);

      // Open Confirmation Modal
      openReservationSuccessModal({
        refCode,
        name,
        email,
        phone,
        date: dateInput.value,
        time: selectedTime,
        guests: guestsSelect.value,
        area: areaSelect.options[areaSelect.selectedIndex]?.text,
        occasion: occasionSelect.value,
        requests: requests || 'None provided'
      });

      form.reset();
      dateInput.value = new Date().toISOString().split('T')[0];
      updateSummary();
    });
  }
}

function openReservationSuccessModal(data) {
  const modalOverlay = document.getElementById('res-modal-overlay');
  const modalBody = document.getElementById('res-modal-body');
  if (!modalOverlay || !modalBody) return;

  modalBody.innerHTML = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--gold-gradient-soft); border: 1px solid var(--gold-primary); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: var(--gold-primary);">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h3 style="font-family: var(--font-serif); font-size: 1.8rem; color: #fff; margin-bottom: 6px;">Reservation Confirmed</h3>
      <p style="color: var(--gold-light); font-size: 0.95rem;">An unforgettable epicurean evening awaits you, ${data.name}.</p>
    </div>

    <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-gold); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(255,255,255,0.1); padding-bottom: 10px; margin-bottom: 10px;">
        <span style="color: var(--text-muted); font-size: 0.85rem;">Booking Reference</span>
        <span style="color: var(--gold-primary); font-weight: 700; letter-spacing: 0.1em;">${data.refCode}</span>
      </div>
      <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(255,255,255,0.1); padding-bottom: 10px; margin-bottom: 10px; font-size: 0.9rem;">
        <span style="color: var(--text-muted);">Date & Time</span>
        <span style="color: #fff; font-weight: 500;">${data.date} at ${data.time}</span>
      </div>
      <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(255,255,255,0.1); padding-bottom: 10px; margin-bottom: 10px; font-size: 0.9rem;">
        <span style="color: var(--text-muted);">Party Size & Setting</span>
        <span style="color: #fff; font-weight: 500;">${data.guests} Guests • ${data.area}</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
        <span style="color: var(--text-muted);">Confirmation Sent To</span>
        <span style="color: #fff; font-weight: 500;">${data.email}</span>
      </div>
    </div>

    <p style="font-size: 0.8rem; color: var(--text-muted); text-align: center; margin-bottom: 24px;">
      Valet service is available complimentary at the main portico entrance. Dress code: Elegant / Smart Casual.
    </p>

    <div style="display: flex; gap: 12px;">
      <button class="btn btn-gold" id="btn-save-confirm" style="flex: 1;">
        Copy Reference Code
      </button>
      <button class="btn btn-outline-gold" id="btn-close-confirm" style="flex: 1;">
        Done
      </button>
    </div>
  `;

  modalOverlay.classList.add('active');

  const closeBtn = document.getElementById('btn-close-confirm');
  const saveBtn = document.getElementById('btn-save-confirm');
  const modalCloseIcon = document.getElementById('close-res-modal');

  if (closeBtn) closeBtn.addEventListener('click', () => modalOverlay.classList.remove('active'));
  if (modalCloseIcon) modalCloseIcon.addEventListener('click', () => modalOverlay.classList.remove('active'));

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(data.refCode).then(() => {
        showToast(`Reference ${data.refCode} copied to clipboard!`, '📋');
      }).catch(() => {
        showToast(`Reference: ${data.refCode}`, '📋');
      });
    });
  }
}

/* ==========================================================================
   AMBIANCE AUDIO SIMULATION (Web Audio API)
   ========================================================================== */
function initAmbianceAudio() {
  const audioBtn = document.getElementById('ambiance-audio-toggle');
  if (!audioBtn) return;

  let audioCtx = null;
  let isPlaying = false;
  let intervalId = null;

  // Harmonious pentatonic frequencies for subtle luxury crystal chimes
  const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];

  function playChime() {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    const note = notes[Math.floor(Math.random() * notes.length)];
    osc.type = 'sine';
    osc.frequency.setValueAtTime(note, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 3.5);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 3.6);
  }

  audioBtn.addEventListener('click', () => {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isPlaying = !isPlaying;

    if (isPlaying) {
      audioBtn.classList.add('active');
      audioBtn.title = 'Mute Ambiance Sound';
      showToast('Ambient Lounge Audio Activated', '🎵');
      playChime();
      intervalId = setInterval(playChime, 3400);
    } else {
      audioBtn.classList.remove('active');
      audioBtn.title = 'Play Ambiance Sound';
      showToast('Ambient Sound Muted', '🔇');
      clearInterval(intervalId);
    }
  });
}

/* ==========================================================================
   NEWSLETTER SUBSCRIPTION
   ========================================================================== */
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('newsletter-email');
    if (input && input.value.trim()) {
      showToast(`Welcome to the Private Cellar Club, ${input.value.trim()}!`, '🥂');
      input.value = '';
    }
  });
}
