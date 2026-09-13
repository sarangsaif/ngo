/* ==========================================================================
   MEHRAN SAHARA FOUNDATION - MAIN APPLICATION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCauseFilters();
  initImpactSimulator();
  initDistrictShowcase();
  initThemeToggle();
  initVolunteerModal();
  initDirectDonateTriggers();
  initMobileNav();
});

// Toast Notification System
function showToast(message, icon = 'ℹ️') {
  let toast = document.querySelector('.toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-msg">${message}</span>
  `;

  toast.classList.add('active');

  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.remove('active');
  }, 3800);
}

// 1. Cause Filtering
function initCauseFilters() {
  const filterPills = document.querySelectorAll('.filter-pill');
  const cards = document.querySelectorAll('.campaign-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filterValue = pill.dataset.filter;

      cards.forEach(card => {
        if (filterValue === 'all' || card.dataset.category === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// 2. Interactive Impact Simulator
let currentSimulatorAmount = 15000;

function initImpactSimulator() {
  const slider = document.getElementById('impact-range-slider');
  const displayVal = document.getElementById('simulator-display-val');
  const donateBtn = document.getElementById('simulator-donate-btn');

  if (!slider) return;

  function updateSimulator(amount) {
    currentSimulatorAmount = amount;
    const isPKR = (typeof DonationState !== 'undefined' ? DonationState.currency : 'PKR') === 'PKR';

    const pkrEquivalent = isPKR ? amount : amount * (DonationState?.exchangeRate || 280);

    if (displayVal) {
      displayVal.textContent = typeof formatMoney === 'function' ? formatMoney(amount) : `₨ ${amount.toLocaleString()}`;
    }

    // Dynamic tangible outcomes
    const waterLiters = Math.round(pkrEquivalent / 1.4);
    const schoolKits = Math.max(1, Math.floor(pkrEquivalent / 4500));
    const resilientBricks = Math.round(pkrEquivalent / 18);
    const hotMeals = Math.round(pkrEquivalent / 220);

    const elWater = document.getElementById('outcome-water-liters');
    const elKits = document.getElementById('outcome-school-kits');
    const elBricks = document.getElementById('outcome-bricks');
    const elMeals = document.getElementById('outcome-meals');

    if (elWater) elWater.textContent = waterLiters.toLocaleString() + ' L';
    if (elKits) elKits.textContent = schoolKits.toLocaleString();
    if (elBricks) elBricks.textContent = resilientBricks.toLocaleString();
    if (elMeals) elMeals.textContent = hotMeals.toLocaleString();
  }

  slider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    updateSimulator(val);
  });

  if (donateBtn) {
    donateBtn.addEventListener('click', () => {
      if (typeof openDonationModal === 'function') {
        openDonationModal({
          amount: currentSimulatorAmount,
          cause: 'Direct Sindh Field Impact Fund'
        });
      }
    });
  }

  window.updateSimulatorDisplay = () => {
    const isPKR = DonationState.currency === 'PKR';
    if (isPKR) {
      slider.min = 2000;
      slider.max = 250000;
      slider.step = 1000;
      slider.value = 15000;
      updateSimulator(15000);
    } else {
      slider.min = 15;
      slider.max = 1000;
      slider.step = 5;
      slider.value = 60;
      updateSimulator(60);
    }
  };

  updateSimulator(15000);
}

// 3. Sindh District Showcase
const districtData = {
  tharparkar: {
    badge: 'Drought Resilience Zone',
    name: 'Tharparkar (ٿرپارڪر)',
    overview: 'In the remote desert villages of Mithi, Islamkot, Chachro and Nagarparkar, chronic water scarcity forces women and children to walk up to 7 km daily under extreme 48°C heat. Mehran Sahara has drilled 380+ solar deep-water boreholes and solar RO purification units.',
    stats: [
      { num: '380+', label: 'Solar Water Wells Built' },
      { num: '48,000+', label: 'Villagers with Clean Tap Water' },
      { num: '12', label: 'Solar RO Plants Active' },
      { num: '100%', label: 'Powered by Renewable Solar' }
    ],
    img: 'assets/images/thar-water.jpg'
  },
  dadu: {
    badge: 'Flood Rehabilitation Basin',
    name: 'Dadu & Khairpur (دادو ۽ خيرپور)',
    overview: 'Stretching along the Indus basin, low-lying villages suffered total devastation in catastrophic monsoon floods. We construct raised 4-foot plinth brick homes with reinforced lime plaster, raised livestock safety platforms, and community evacuation mounds.',
    stats: [
      { num: '3,240+', label: 'Climate-Resilient Brick Homes' },
      { num: '19,500+', label: 'People Restored to Shelter' },
      { num: '85+', label: 'Raised Animal Shelters' },
      { num: '₨ 0', label: 'Cost to Destitute Families' }
    ],
    img: 'assets/images/flood-rebuild.jpg'
  },
  thatta: {
    badge: 'Coastal Delta & Riverine Care',
    name: 'Thatta & Sujawal (ٺٽو ۽ سجاول)',
    overview: 'The Indus Delta is vulnerable to seawater intrusion and severe malnutrition. Our fleet of 4 mobile medical boats and 6 converted clinical vans provide free pre-natal consultations, child stunting nutrition supplements, clean water packets, and emergency transport.',
    stats: [
      { num: '72,000+', label: 'Free Medical Checkups' },
      { num: '4', label: 'Riverine Medical Boats' },
      { num: '9,400+', label: 'Mother & Infant Kits' },
      { num: '24/7', label: 'Delta Ambulance Hotline' }
    ],
    img: 'assets/images/healthcare.jpg'
  },
  larkana: {
    badge: 'Education & Girls Literacy',
    name: 'Larkana & Qambar (لاڙڪاڻو)',
    overview: 'Education is the ultimate antidote to generational rural poverty. We operate 94 community solar schools across interior Sindh, providing free textbooks, tech tablets, qualified female teachers, and hot mid-day meals so young girls remain enrolled.',
    stats: [
      { num: '94', label: 'Active Solar Classrooms' },
      { num: '14,200+', label: 'Girls in Active Learning' },
      { num: '100%', label: 'Free Uniforms & Learning Kits' },
      { num: '98.4%', label: 'School Retention Rate' }
    ],
    img: 'assets/images/education.jpg'
  }
};

function initDistrictShowcase() {
  const pills = document.querySelectorAll('.district-pill');
  if (!pills.length) return;

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const key = pill.dataset.district;
      const data = districtData[key];
      if (!data) return;

      document.getElementById('district-badge').textContent = data.badge;
      document.getElementById('district-title').textContent = data.name;
      document.getElementById('district-overview').textContent = data.overview;
      document.getElementById('district-img').src = data.img;

      const statsGrid = document.getElementById('district-stats-grid');
      if (statsGrid) {
        statsGrid.innerHTML = data.stats.map(s => `
          <div class="d-stat-box">
            <div class="d-stat-num">${s.num}</div>
            <div class="d-stat-lbl">${s.label}</div>
          </div>
        `).join('');
      }
    });
  });
}

// 4. Dark / Light Theme Toggle
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem('msf_theme') || 'light';
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    toggleBtn.innerHTML = '☀️';
  }

  toggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      toggleBtn.innerHTML = '🌙';
      localStorage.setItem('msf_theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      toggleBtn.innerHTML = '☀️';
      localStorage.setItem('msf_theme', 'dark');
    }
  });
}

// 5. Volunteer Modal Flow
function initVolunteerModal() {
  const openBtns = document.querySelectorAll('.open-volunteer-modal-btn');
  const modal = document.getElementById('volunteer-modal-overlay');
  const closeBtn = document.getElementById('volunteer-modal-close');
  const form = document.getElementById('volunteer-signup-form');

  openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Registering with Sindh Field Team...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Registration';
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        form.reset();
        showToast('Thank you! Our Sindh Volunteer Coordinator will contact you on WhatsApp.', '🤝');
      }, 1000);
    });
  }
}

// 6. Direct Campaign Donate Buttons
function initDirectDonateTriggers() {
  document.querySelectorAll('.btn-donate-campaign').forEach(btn => {
    btn.addEventListener('click', () => {
      const cause = btn.dataset.cause;
      const targetPkr = parseFloat(btn.dataset.defaultPkr) || 5000;
      const finalAmount = DonationState.currency === 'PKR' 
        ? targetPkr 
        : Math.round(targetPkr / DonationState.exchangeRate);

      if (typeof openDonationModal === 'function') {
        openDonationModal({
          cause: cause,
          amount: finalAmount
        });
      }
    });
  });
}

// 7. Mobile & Tablet Off-Canvas Navigation Drawer
function openNavDrawer() {
  const drawer = document.getElementById('mobile-nav-drawer');
  const backdrop = document.getElementById('nav-drawer-backdrop');
  const toggleBtn = document.getElementById('mobile-menu-toggle');

  if (drawer && backdrop) {
    drawer.classList.add('drawer-open');
    backdrop.classList.add('backdrop-active');
    document.body.classList.add('nav-locked');
    if (toggleBtn) {
      toggleBtn.classList.add('is-active');
      toggleBtn.setAttribute('aria-expanded', 'true');
    }
  }
}

function closeNavDrawer() {
  const drawer = document.getElementById('mobile-nav-drawer');
  const backdrop = document.getElementById('nav-drawer-backdrop');
  const toggleBtn = document.getElementById('mobile-menu-toggle');

  if (drawer && backdrop) {
    drawer.classList.remove('drawer-open');
    backdrop.classList.remove('backdrop-active');
    document.body.classList.remove('nav-locked');
    if (toggleBtn) {
      toggleBtn.classList.remove('is-active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  }
}

window.openNavDrawer = openNavDrawer;
window.closeNavDrawer = closeNavDrawer;

function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const closeBtn = document.getElementById('drawer-close-btn');
  const backdrop = document.getElementById('nav-drawer-backdrop');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = toggleBtn.classList.contains('is-active');
      if (isOpen) {
        closeNavDrawer();
      } else {
        openNavDrawer();
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeNavDrawer);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeNavDrawer);
  }

  // Close drawer on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeNavDrawer();
    }
  });

  // Automatically close drawer when window resized to desktop (> 1024px)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
      closeNavDrawer();
    }
  });
}

