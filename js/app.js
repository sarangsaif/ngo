// 0. Gamified 1-CHF Swiss Impact Spark Module Data (Global)
var SparkLevels = [
  {
    level: 1,
    badge: '🥉',
    title: 'Stufe 1: Erst-Helfer',
    subtitle: 'Dein Beitrag entzündet Hoffnung in Tharparkar',
    stat: '💧 25 Liter Trinkwasser',
    desc: 'Mit nur <strong>%AMOUNT%</strong> finanzierst du 25 Liter gefiltertes, süsses Trinkwasser für ein Kind in der Wüste Thar. Keine Schachtbrunnen-Mühe mehr, kein Schmutzwasser.',
    tierLabel: 'Wasser-Funke',
    baseChf: 1
  },
  {
    level: 2,
    badge: '🥈',
    title: 'Stufe 2: Hoffnungsträger',
    subtitle: 'Zwei Tage voller Energie & Schutz',
    stat: '🎒 2 Tage warme Schulmahlzeit',
    desc: 'Mit <strong>%AMOUNT%</strong> schenkst du Amina und ihren Mitschülerinnen zwei Tage lang nahrhafte Schulmahlzeiten und Solarlampen zum Abendlernen.',
    tierLabel: 'Schul-Funke',
    baseChf: 2
  },
  {
    level: 3,
    badge: '🥇',
    title: 'Stufe 3: Lebensretter',
    subtitle: 'Hygienesicherheit für die ganze Familie',
    stat: '🧼 150 L Trinkwasser & Entkeimung',
    desc: 'Mit <strong>%AMOUNT%</strong> erhält eine flutbetroffene 5-köpfige Familie ein Entkeimungs-Kit für sauberes Wasser und Seife zur Seuchenprävention.',
    tierLabel: 'Hygiene-Funke',
    baseChf: 5
  },
  {
    level: 4,
    badge: '💎',
    title: 'Stufe 4: Schutzengel',
    subtitle: 'Ein ganzes Schulkit für die Zukunft',
    stat: '📚 Schulhefte, Ranzen & Lampe',
    desc: 'Mit <strong>%AMOUNT%</strong> rüstest du ein Wüstenmädchen mit Schulheften, Stiften und einer solaren Leselampe für einen ganzen Monat aus.',
    tierLabel: 'Lern-Funke',
    baseChf: 10
  },
  {
    level: 5,
    badge: '🌟',
    title: 'Stufe 5: Sindh-Champion',
    subtitle: 'Ein Monat Ernährungssicherheit',
    stat: '🍲 1 Monat Notfall-Rationen',
    desc: 'Mit <strong>%AMOUNT%</strong> sicherst du einer Familie im Flutgebiet einen vollen Monat lang Mehl, Reis, Speiseöl, Linsen und Babynahrung.',
    tierLabel: 'Familien-Funke',
    baseChf: 25
  },
  {
    level: 6,
    badge: '👑',
    title: 'Stufe 6: Ehren-Patron',
    subtitle: 'Medizinischer Notfalleinsatz auf dem Fluss',
    stat: '🩺 Mobile Notfall-Klinikversorgung',
    desc: 'Mit <strong>%AMOUNT%</strong> ermöglichst du dem Klinikboot die Versorgung isolierter Mütter und Neugeborener im Indus-Delta mit lebensrettenden Medikamenten.',
    tierLabel: 'Rettungs-Funke',
    baseChf: 50
  }
];

var selectedSparkLevel = 1;
var currentSparkAmount = 1;
window.SparkLevels = SparkLevels;
window.selectedSparkLevel = selectedSparkLevel;

document.addEventListener('DOMContentLoaded', () => {
  initPrologueCurtain();
  initSparkModule();
  initCauseFilters();
  initImpactSimulator();
  initDistrictShowcase();
  initThemeToggle();
  initVolunteerModal();
  initDirectDonateTriggers();
  initStoryModalLogic();
  initMobileNav();
});

// 0. Cinematic Story Prologue Curtain (Swiss First-Impression Entrance with Auto-Open)
let prologueTimerInterval = null;
let prologueAutoOpenTimeout = null;

function initPrologueCurtain() {
  const curtain = document.getElementById('story-prologue-curtain');
  const enterBtn = document.getElementById('prologue-enter-btn');
  const skipBtn = document.getElementById('prologue-skip-btn');
  const replayBtn = document.getElementById('prologue-replay-btn');
  const twintBtn = document.getElementById('prologue-twint-btn');
  const progressBar = document.getElementById('prologue-progress-bar');
  const timerPill = document.getElementById('prologue-timer-pill');

  if (!curtain) return;

  function clearTimers() {
    if (prologueTimerInterval) {
      clearInterval(prologueTimerInterval);
      prologueTimerInterval = null;
    }
    if (prologueAutoOpenTimeout) {
      clearTimeout(prologueAutoOpenTimeout);
      prologueAutoOpenTimeout = null;
    }
  }

  function dismissCurtain() {
    clearTimers();
    curtain.classList.add('prologue-hidden');
    curtain.style.pointerEvents = 'none';
    document.body.style.overflow = '';
    sessionStorage.setItem('ssr_prologue_seen', 'true');
    setTimeout(() => {
      if (curtain.classList.contains('prologue-hidden')) {
        curtain.style.display = 'none';
      }
    }, 850);
  }

  function startCountdown() {
    clearTimers();
    let secondsLeft = 4;
    if (timerPill) timerPill.textContent = `(öffnet in ${secondsLeft}s)`;
    if (progressBar) {
      progressBar.style.transition = 'none';
      progressBar.style.width = '0%';
      void progressBar.offsetWidth; // Force reflow
      progressBar.style.transition = 'width 4s linear';
      progressBar.style.width = '100%';
    }

    prologueTimerInterval = setInterval(() => {
      secondsLeft--;
      if (secondsLeft > 0) {
        if (timerPill) timerPill.textContent = `(öffnet in ${secondsLeft}s)`;
      } else {
        if (timerPill) timerPill.textContent = `(wird geöffnet...)`;
        clearTimers();
      }
    }, 1000);

    prologueAutoOpenTimeout = setTimeout(() => {
      dismissCurtain();
    }, 4200);
  }

  function showCurtain() {
    clearTimers();
    curtain.style.display = 'flex';
    void curtain.offsetWidth; // Force reflow
    curtain.classList.remove('prologue-hidden');
    curtain.style.pointerEvents = 'auto';
    document.body.style.overflow = 'hidden';
    startCountdown();
  }

  // Check if previously dismissed in session
  const alreadySeen = sessionStorage.getItem('ssr_prologue_seen');
  if (alreadySeen === 'true') {
    curtain.classList.add('prologue-hidden');
    curtain.style.display = 'none';
    curtain.style.pointerEvents = 'none';
    document.body.style.overflow = '';
  } else {
    document.body.style.overflow = 'hidden';
    startCountdown();
  }

  if (enterBtn) enterBtn.addEventListener('click', dismissCurtain);
  if (skipBtn) skipBtn.addEventListener('click', dismissCurtain);
  if (replayBtn) replayBtn.addEventListener('click', showCurtain);

  if (twintBtn) {
    twintBtn.addEventListener('click', () => {
      dismissCurtain();
      if (typeof openMicroDonationModal === 'function') {
        openMicroDonationModal(1);
      }
    });
  }

  // Dismiss on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !curtain.classList.contains('prologue-hidden')) {
      dismissCurtain();
    }
  });
}

function initSparkModule() {
  const tierBtns = document.querySelectorAll('.spark-tier-btn');
  const twintBtn = document.getElementById('spark-twint-action-btn');
  const cardBtn = document.getElementById('spark-card-action-btn');

  tierBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      const levelNum = parseInt(btn.dataset.level) || (idx + 1);
      setSparkLevel(levelNum);
    });
  });

  if (twintBtn) {
    twintBtn.addEventListener('click', () => {
      if (typeof openMicroDonationModal === 'function') {
        openMicroDonationModal(currentSparkAmount);
      }
    });
  }

  if (cardBtn) {
    cardBtn.addEventListener('click', () => {
      if (typeof openDonationModal === 'function') {
        openDonationModal({
          amount: currentSparkAmount,
          cause: '1-Franken Trinkwasser- & Soforthilfefonds'
        });
      }
    });
  }

  updateSparkWidgetCurrency();
}

function setSparkLevel(levelNum) {
  if (typeof SparkLevels === 'undefined' || !Array.isArray(SparkLevels)) return;
  selectedSparkLevel = levelNum;
  window.selectedSparkLevel = levelNum;
  const config = SparkLevels.find(l => l.level === levelNum) || SparkLevels[0];
  if (!config) return;
  const curr = (typeof DonationState !== 'undefined' && DonationState.currency) ? DonationState.currency : 'CHF';

  currentSparkAmount = typeof convertFromChf === 'function' ? convertFromChf(config.baseChf, curr) : config.baseChf;
  const formatted = typeof formatMoney === 'function' ? formatMoney(currentSparkAmount, curr) : `${curr} ${currentSparkAmount}`;

  // Update button active state
  document.querySelectorAll('.spark-tier-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.level) === levelNum);
  });

  // Update progress bar
  const fill = document.getElementById('spark-progress-fill');
  if (fill) {
    const percent = Math.min(100, Math.round((levelNum / 6) * 100));
    fill.style.width = `${percent}%`;
  }

  // Update badge & texts
  const badgeIcon = document.getElementById('spark-badge-icon');
  const levelTitle = document.getElementById('spark-level-title');
  const levelSub = document.getElementById('spark-level-sub');
  const statHighlight = document.getElementById('spark-stat-highlight');
  const impactDesc = document.getElementById('spark-impact-desc');
  const btnLabel = document.getElementById('spark-btn-label');

  if (badgeIcon) badgeIcon.textContent = config.badge;
  if (levelTitle) levelTitle.textContent = config.title;
  if (levelSub) levelSub.textContent = config.subtitle;
  if (statHighlight) statHighlight.innerHTML = config.stat;
  if (impactDesc) impactDesc.innerHTML = config.desc.replace('%AMOUNT%', formatted);
  if (btnLabel) btnLabel.textContent = `Jetzt ${formatted} mit TWINT spenden`;
}

function updateSparkWidgetCurrency() {
  if (typeof SparkLevels === 'undefined' || !Array.isArray(SparkLevels)) return;
  const curr = (typeof DonationState !== 'undefined' && DonationState.currency) ? DonationState.currency : 'CHF';
  const tierBtns = document.querySelectorAll('.spark-tier-btn');

  tierBtns.forEach((btn, idx) => {
    const config = SparkLevels[idx];
    if (!config) return;
    const converted = typeof convertFromChf === 'function' ? convertFromChf(config.baseChf, curr) : config.baseChf;
    btn.dataset.amount = converted;
    const amountWrap = btn.querySelector('.tier-amount-wrap');
    if (amountWrap) {
      amountWrap.innerHTML = `<span class="curr-symbol-text">${curr === 'CHF' ? 'CHF' : (curr === 'EUR' ? '€' : (curr === 'USD' ? '$' : '₨'))}</span> ${converted.toLocaleString('de-CH')}`;
    }
  });

  const lvl = (typeof selectedSparkLevel !== 'undefined' && selectedSparkLevel) ? selectedSparkLevel : 1;
  setSparkLevel(lvl);
}

window.updateSparkWidgetCurrency = updateSparkWidgetCurrency;

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

// 2. Interactive Impact Simulator (Calibrated to CHF / Multi-currency)
let currentSimulatorAmount = 75;

function initImpactSimulator() {
  const slider = document.getElementById('impact-range-slider');
  const displayVal = document.getElementById('simulator-display-val');
  const donateBtn = document.getElementById('simulator-donate-btn');

  if (!slider) return;

  function updateSimulator(amount) {
    currentSimulatorAmount = amount;
    const curr = typeof DonationState !== 'undefined' ? DonationState.currency : 'CHF';

    // Calculate PKR equivalent for physical deliverables
    let pkrEquivalent;
    if (curr === 'CHF') {
      pkrEquivalent = amount * 320;
    } else if (curr === 'EUR') {
      pkrEquivalent = amount * 310;
    } else if (curr === 'USD') {
      pkrEquivalent = amount * 280;
    } else {
      pkrEquivalent = amount;
    }

    if (displayVal) {
      displayVal.textContent = typeof formatMoney === 'function' ? formatMoney(amount, curr) : `CHF ${amount}.–`;
    }

    // Tangible real-world outcomes in Sindh
    const waterLiters = Math.round(pkrEquivalent / 1.4);
    const schoolKits = Math.max(1, Math.floor(pkrEquivalent / 4500));
    const resilientBricks = Math.round(pkrEquivalent / 18);
    const hotMeals = Math.round(pkrEquivalent / 220);

    const elWater = document.getElementById('outcome-water-liters');
    const elKits = document.getElementById('outcome-school-kits');
    const elBricks = document.getElementById('outcome-bricks');
    const elMeals = document.getElementById('outcome-meals');

    if (elWater) elWater.textContent = waterLiters.toLocaleString('de-CH') + ' L';
    if (elKits) elKits.textContent = schoolKits.toLocaleString('de-CH');
    if (elBricks) elBricks.textContent = resilientBricks.toLocaleString('de-CH');
    if (elMeals) elMeals.textContent = hotMeals.toLocaleString('de-CH');
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
          cause: 'Direct Swiss Impact Relief Fund'
        });
      }
    });
  }

  window.updateSimulatorDisplay = () => {
    const curr = typeof DonationState !== 'undefined' ? DonationState.currency : 'CHF';
    if (curr === 'PKR') {
      slider.min = 2000;
      slider.max = 250000;
      slider.step = 1000;
      slider.value = 24000;
      updateSimulator(24000);
    } else {
      slider.min = 20;
      slider.max = 1200;
      slider.step = 10;
      slider.value = 75;
      updateSimulator(75);
    }
  };

  window.updateSimulatorDisplay();
}

// 3. Sindh District Showcase
const districtData = {
  tharparkar: {
    badge: 'Drought Resilience Zone',
    name: 'Tharparkar (ٿرپارڪر)',
    overview: 'In the remote desert of Tharparkar, extreme heat (up to 48°C) and groundwater salinity cause severe hardship. Swiss Sindh Relief has drilled 380+ solar deep-water boreholes and installed solar RO purification units, reducing daily water fetching walks for women and girls from 5 hours to zero minutes.',
    stats: [
      { num: '380+', label: 'Solar Deep Wells & RO Units' },
      { num: '48,000+', label: 'Villagers with Clean Water' },
      { num: '100%', label: 'Powered by Solar Energy' },
      { num: 'CHF 0', label: 'Cost to Impoverished Families' }
    ],
    img: 'assets/images/story-mai-jamna.jpg'
  },
  dadu: {
    badge: 'Indus Flood Reconstruction',
    name: 'Dadu & Khairpur (دادو ۽ خيرپور)',
    overview: 'Devastating monsoon surges along the Indus river washed away thousands of traditional mud homes. We build permanent raised 4-foot plinth brick homes with reinforced mortar and rooftop solar lighting, giving vulnerable families dry, safe, disaster-proof shelter.',
    stats: [
      { num: '3,240+', label: 'Climate-Resilient Brick Homes' },
      { num: '19,500+', label: 'Displaced People Re-housed' },
      { num: '85+', label: 'Raised Livestock Evacuation Platforms' },
      { num: 'ZEWO', label: 'Transparent Direct Delivery' }
    ],
    img: 'assets/images/story-allah-dino.jpg'
  },
  thatta: {
    badge: 'Coastal Riverine Health',
    name: 'Thatta & Sujawal (ٺٽو ۽ سجاول)',
    overview: 'The Indus Delta is isolated by winding marsh waterways where traditional ambulances cannot travel. Our fleet of 4 solar-equipped river clinic boats and mobile clinical vans provide free maternal deliveries, child vaccinations, and emergency medical transfers.',
    stats: [
      { num: '72,000+', label: 'Free Clinical Consultations' },
      { num: '4', label: 'Riverine Medical Clinic Boats' },
      { num: '9,400+', label: 'Mother & Newborn Care Kits' },
      { num: '24/7', label: 'Delta Emergency Boat Hotline' }
    ],
    img: 'assets/images/story-dr-saira.jpg'
  },
  larkana: {
    badge: 'Girls Literacy & Solar Schools',
    name: 'Larkana & Qambar (لاڙڪاڻو)',
    overview: 'Education is the most sustainable path out of poverty. We equip rural community schools with solar rooftop arrays, ceiling fans, digital learning tablets, and free textbooks, enabling girls like Amina to attend school safely year-round.',
    stats: [
      { num: '94', label: 'Active Solar Classrooms' },
      { num: '14,200+', label: 'Girls in Active Learning' },
      { num: '100%', label: 'Free Schoolbags & Solar Lamps' },
      { num: '98.4%', label: 'Student Retention Rate' }
    ],
    img: 'assets/images/story-amina.jpg'
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

  const savedTheme = localStorage.getItem('ssr_theme') || 'light';
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    toggleBtn.innerHTML = '☀️';
  }

  toggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      toggleBtn.innerHTML = '🌙';
      localStorage.setItem('ssr_theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      toggleBtn.innerHTML = '☀️';
      localStorage.setItem('ssr_theme', 'dark');
    }
  });
}

// 5. Individual Stories Modal & Deep Emotional Narrative Engine
const personalStories = {
  amina: {
    name: 'Amina',
    age: '9 years old',
    village: 'Chachro, Tharparkar District',
    cause: 'Girls Solar Education & Literacy',
    amountChf: 75,
    tag: 'Education & Future',
    photo: 'assets/images/story-amina.jpg',
    quote: '“Before this school opened with solar power, I had to carry water with my mother. Now I am first in my class and I want to study to become a teacher in Sindh.”',
    storyLong: `In Amina's remote desert village, 45-degree summer temperatures made studying in a mud structure without electricity nearly impossible. Amina and her sisters were often kept home to trek 4 hours every morning fetching brackish water from 180-foot wells.

With support from Swiss donors, we installed solar rooftop arrays, ceiling fans, and provided Amina with a complete school kit (textbooks, notebooks, uniforms, and a solar home-study lamp). 

Today, Amina hasn't missed a day of school in 14 months. Your gift of **CHF 75** fully covers a child's annual education sponsorship, books, and solar night study lamp.`,
    impactFact: '1 Year of Schooling, Books & Solar Lamp: CHF 75'
  },
  allah_dino: {
    name: 'Allah Dino Solangi & Family',
    age: 'Father of 4',
    village: 'Khairpur Nathan Shah, Dadu Basin',
    cause: 'Flood Resilient Brick Housing',
    amountChf: 350,
    tag: 'Safe Shelter & Dignity',
    photo: 'assets/images/story-allah-dino.jpg',
    quote: '“The floods swept our home away in minutes. For months we lived on the asphalt highway under plastic sheets. Today, our children sleep in a permanent brick home raised 4 feet above the water level.”',
    storyLong: `Allah Dino is a smallholder farmer who lost his entire livelihood and ancestral mud hut in the catastrophic Indus floods. With nowhere to turn, his family lived in an emergency tent camp for over five months.

Through direct Swiss funding, Swiss Sindh Relief deployed local brick masons to build a permanent, raised-plinth brick home with waterproof lime mortar and reinforced roofing. 

When heavy monsoon rains struck again in 2024, Allah Dino's home remained bone dry and secure. A contribution of **CHF 350** provides 2,000 flood-resilient fired bricks and foundation reinforcement.`,
    impactFact: 'Resilient Foundation & 2,000 Bricks: CHF 350'
  },
  mai_jamna: {
    name: 'Mai Jamna',
    age: '67 years old',
    village: 'Mithi Desert Outpost, Tharparkar',
    cause: 'Solar Deep Wells & Clean Water',
    amountChf: 150,
    tag: 'Clean Water Security',
    photo: 'assets/images/story-mai-jamna.jpg',
    quote: '“For fifty years, my hands pulled heavy rope from deep wells until my skin cracked and bled. To see sweet, cool water flow from a tap in our village is a miracle our ancestors prayed for.”',
    storyLong: `For five decades, Mai Jamna walked miles every day under the Thar desert sun, balancing heavy clay pots. The water she collected was often high in toxic fluoride and salt, causing joint ailments throughout her village.

Swiss Sindh Relief drilled a 220-foot deep borehole powered by an 8-panel solar array with automatic RO filtration. Now, clean mineral-pure drinking water is pumped directly into four community distribution taps.

Waterborne disease rates in Mai Jamna's settlement have dropped by 84%. A donation of **CHF 150** provides safe drinking water for 25 families for an entire year.`,
    impactFact: 'Year-Round Clean Water for 25 Families: CHF 150'
  },
  dr_saira: {
    name: 'Dr. Saira & Baby Zayan',
    age: 'Community Medical Officer',
    village: 'Indus Delta Islands, Thatta',
    cause: 'Mobile Riverboat Healthcare',
    amountChf: 50,
    tag: 'Maternal & Infant Health',
    photo: 'assets/images/story-dr-saira.jpg',
    quote: '“When high tide isolates the river islands, mothers in labor have no hospital access. Our clinic boat navigates directly to their doorsteps, delivering babies safely and vaccinating infants.”',
    storyLong: `The riverine communities of the Indus Delta are completely cut off by marshes and rising sea levels. High rates of infant mortality and maternal complications persisted due to the absence of roads.

Dr. Saira operates onboard one of our 4 purpose-built mobile riverboat clinics, equipped with ultrasound, neonatal incubators, cold-chain vaccines, and nutritional therapy.

Last month alone, Dr. Saira's team provided prenatal checkups to 420 expecting mothers and treated 890 malnourished infants like baby Zayan. A gift of **CHF 50** covers complete emergency prenatal care and infant nutrition supplements for two mothers.`,
    impactFact: 'Prenatal Care & Infant Nutrition: CHF 50'
  }
};

function initStoryModalLogic() {
  const modal = document.getElementById('story-modal-overlay');
  const closeBtn = document.getElementById('story-modal-close');

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', closeStoryModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeStoryModal();
    });
  }

  // Bind clicks on story cards
  document.querySelectorAll('.open-story-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const storyId = btn.dataset.storyId;
      openStoryModal(storyId);
    });
  });

  document.querySelectorAll('.story-photo-card').forEach(card => {
    card.addEventListener('click', () => {
      const storyId = card.dataset.storyId;
      if (storyId) openStoryModal(storyId);
    });
  });
}

function openStoryModal(storyId) {
  const data = personalStories[storyId];
  if (!data) return;

  const modal = document.getElementById('story-modal-overlay');
  if (!modal) return;

  document.getElementById('story-modal-img').src = data.photo;
  document.getElementById('story-modal-tag').textContent = data.tag;
  document.getElementById('story-modal-name').textContent = data.name;
  document.getElementById('story-modal-meta').textContent = `${data.village} • ${data.age}`;
  document.getElementById('story-modal-quote').textContent = data.quote;
  document.getElementById('story-modal-body').innerHTML = data.storyLong.replace(/\n\n/g, '<br><br>');
  document.getElementById('story-modal-impact').textContent = data.impactFact;

  const donateActionBtn = document.getElementById('story-modal-donate-btn');
  if (donateActionBtn) {
    const curr = typeof DonationState !== 'undefined' ? DonationState.currency : 'CHF';
    donateActionBtn.textContent = `Support this Story (${formatMoney(data.amountChf, curr)}) 💚`;
    donateActionBtn.onclick = () => {
      closeStoryModal();
      if (typeof openDonationModal === 'function') {
        openDonationModal({
          cause: data.cause,
          amount: data.amountChf
        });
      }
    };
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeStoryModal() {
  const modal = document.getElementById('story-modal-overlay');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

window.openStoryModal = openStoryModal;
window.closeStoryModal = closeStoryModal;

// 6. Direct Campaign Donate Buttons
function initDirectDonateTriggers() {
  document.querySelectorAll('.btn-donate-campaign').forEach(btn => {
    btn.addEventListener('click', () => {
      const cause = btn.dataset.cause;
      const targetChf = parseFloat(btn.dataset.defaultChf) || 75;
      const targetPkr = parseFloat(btn.dataset.defaultPkr) || 24000;

      const curr = DonationState.currency;
      let finalAmount;
      if (curr === 'CHF' || curr === 'EUR' || curr === 'USD') {
        finalAmount = targetChf;
      } else {
        finalAmount = targetPkr;
      }

      if (typeof openDonationModal === 'function') {
        openDonationModal({
          cause: cause,
          amount: finalAmount
        });
      }
    });
  });
}

// 7. Volunteer Modal Flow
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
      submitBtn.textContent = 'Anmeldung wird übermittelt...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Freiwilligen-Anmeldung absenden';
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        form.reset();
        showToast('Vielen Dank! Unser Team in der Schweiz und in Sindh wird sich bei Ihnen melden. 🤝', '🤝');
      }, 1000);
    });
  }
}

// 8. Mobile & Tablet Off-Canvas Navigation Drawer
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
