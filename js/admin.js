/* ==========================================================================
   MEHRAN SAHARA FOUNDATION (سنڌ سهارو ٽرسٽ)
   Admin Portal Controller & Data Management Engine
   ========================================================================== */

// Default Seed Data for Sindh Relief Operations
const DefaultSeedData = {
  donations: [
    {
      id: 'MSF-2026-982143',
      date: '12 Sep 2026, 02:15',
      donor: 'Tariq Mehmood',
      email: 'tariq.m@karachi.com',
      phone: '+92 300 8219401',
      city: 'Karachi, Sindh',
      cause: 'Tharparkar Solar Deep Wells',
      amount: 75000,
      currency: 'PKR',
      frequency: 'once',
      method: 'raast',
      status: 'Verified',
      isAnonymous: false
    },
    {
      id: 'MSF-2026-871294',
      date: '11 Sep 2026, 21:40',
      donor: 'Dr. Ayesha Brohi',
      email: 'ayesha.brohi@nhs.uk',
      phone: '+44 7700 900143',
      city: 'London / Overseas Diaspora',
      cause: 'Marvi Girls Solar Education',
      amount: 140000,
      currency: 'PKR',
      frequency: 'zakat',
      method: 'card',
      status: 'Verified',
      isAnonymous: false
    },
    {
      id: 'MSF-2026-761209',
      date: '11 Sep 2026, 18:22',
      donor: 'Generous Anonymous Donor',
      email: 'donor@mehran-sahara.org',
      phone: '+92 321 4455667',
      city: 'Hyderabad, Sindh',
      cause: 'Flood Resilient Brick Housing',
      amount: 35000,
      currency: 'PKR',
      frequency: 'once',
      method: 'easypaisa',
      status: 'Verified',
      isAnonymous: true
    },
    {
      id: 'MSF-2026-654129',
      date: '10 Sep 2026, 14:05',
      donor: 'Farhan & Hina Ali',
      email: 'farhan.ali@gmail.com',
      phone: '+1 469 555 0192',
      city: 'Dallas, USA',
      cause: '100% Zakat Fund (Sindh Rural Relief)',
      amount: 84000,
      currency: 'PKR',
      frequency: 'zakat',
      method: 'paypal',
      status: 'Verified',
      isAnonymous: false
    },
    {
      id: 'MSF-2026-543180',
      date: '09 Sep 2026, 11:30',
      donor: 'Kamran Memon',
      email: 'kamran.m@memonchem.pk',
      phone: '+92 333 2198402',
      city: 'Sukkur, Sindh',
      cause: 'Coastal Delta Mobile Healthcare',
      amount: 25000,
      currency: 'PKR',
      frequency: 'monthly',
      method: 'jazzcash',
      status: 'Pending',
      isAnonymous: false
    }
  ],
  volunteers: [
    {
      id: 'VOL-1082',
      name: 'Dr. Shahmeer Chandio',
      email: 'shahmeer.chandio@lumhs.edu.pk',
      phone: '+92 301 2345678',
      city: 'Hyderabad',
      skill: 'doctor',
      district: 'thatta',
      date: '08 Sep 2026',
      status: 'Active'
    },
    {
      id: 'VOL-1083',
      name: 'Engr. Bakhtiar Khoso',
      email: 'bakhtiar.khoso@muet.edu.pk',
      phone: '+92 334 9876543',
      city: 'Jamshoro',
      skill: 'water',
      district: 'tharparkar',
      date: '09 Sep 2026',
      status: 'Active'
    },
    {
      id: 'VOL-1084',
      name: 'Zunaira Junejo',
      email: 'zunaira.j@sindhuni.edu.pk',
      phone: '+92 312 3456789',
      city: 'Larkana',
      skill: 'education',
      district: 'larkana',
      date: '10 Sep 2026',
      status: 'Active'
    }
  ],
  campaigns: [
    {
      id: 'CAMP-01',
      title: 'Tharparkar Solar Deep Water Wells & RO Plants',
      district: 'Mithi & Chachro, Thar Desert',
      category: 'water',
      raised: 3915000,
      goal: 5000000,
      donors: 483,
      status: 'Active',
      img: 'assets/images/thar-water.jpg'
    },
    {
      id: 'CAMP-02',
      title: 'Marvi Girls Solar Classrooms & Literacy',
      district: 'Larkana & Qambar Shahdadkot',
      category: 'education',
      raised: 2590000,
      goal: 3500000,
      donors: 320,
      status: 'Active',
      img: 'assets/images/education.jpg'
    },
    {
      id: 'CAMP-03',
      title: 'Indus Basin Flood-Resilient Raised Homes',
      district: 'Dadu, Khairpur & Johi',
      category: 'flood',
      raised: 7955000,
      goal: 10000000,
      donors: 685,
      status: 'Active',
      img: 'assets/images/flood-rebuild.jpg'
    },
    {
      id: 'CAMP-04',
      title: 'Coastal Delta Mobile Mother & Child Clinics',
      district: 'Thatta & Sujawal Delta',
      category: 'health',
      raised: 1915000,
      goal: 2800000,
      donors: 246,
      status: 'Active',
      img: 'assets/images/healthcare.jpg'
    }
  ],
  disbursements: [
    {
      voucher: 'DISB-2026-041',
      date: '10 Sep 2026',
      district: 'Tharparkar (Mithi)',
      project: 'Deep Borehole Well #42 Hardware & Solar Pump',
      amount: 420000,
      supervisor: 'Engr. Jamil Soomro',
      status: 'Completed'
    },
    {
      voucher: 'DISB-2026-040',
      date: '08 Sep 2026',
      district: 'Dadu (Johi)',
      project: 'Raised Plinth Brick Masonry & Lime Plaster (12 Homes)',
      amount: 850000,
      supervisor: 'Sikandar Solangi',
      status: 'In Progress'
    },
    {
      voucher: 'DISB-2026-039',
      date: '05 Sep 2026',
      district: 'Thatta & Sujawal',
      project: 'Mobile Boat Clinic Fuel, Pediatric Antibiotics & ORS',
      amount: 185000,
      supervisor: 'Dr. Parveen Laghari',
      status: 'Completed'
    }
  ]
};

// Initialize Admin Portal
document.addEventListener('DOMContentLoaded', () => {
  initSeedData();
  checkAuth();
  initLoginForm();
  initSidebarNavigation();
  initDonationsManager();
  initCampaignsManager();
  initVolunteersManager();
  initDisbursementsManager();
  initMobileSidebar();
});

// 1. Storage & Seed Management
function initSeedData() {
  if (!localStorage.getItem('msf_donations')) {
    localStorage.setItem('msf_donations', JSON.stringify(DefaultSeedData.donations));
  }
  if (!localStorage.getItem('msf_volunteers')) {
    localStorage.setItem('msf_volunteers', JSON.stringify(DefaultSeedData.volunteers));
  }
  if (!localStorage.getItem('msf_campaigns')) {
    localStorage.setItem('msf_campaigns', JSON.stringify(DefaultSeedData.campaigns));
  }
  if (!localStorage.getItem('msf_disbursements')) {
    localStorage.setItem('msf_disbursements', JSON.stringify(DefaultSeedData.disbursements));
  }
}

// 2. Authentication Logic
function checkAuth() {
  const isAuth = sessionStorage.getItem('msf_admin_auth') === 'true';
  const loginView = document.getElementById('admin-login-view');
  const dashboardView = document.getElementById('admin-dashboard-view');

  if (isAuth) {
    if (loginView) loginView.style.display = 'none';
    if (dashboardView) dashboardView.style.display = 'flex';
    refreshAllDashboardMetrics();
  } else {
    if (loginView) loginView.style.display = 'flex';
    if (dashboardView) dashboardView.style.display = 'none';
  }
}

function initLoginForm() {
  const form = document.getElementById('admin-login-form');
  const demoBtn = document.getElementById('btn-oneclick-demo');
  const logoutBtn = document.getElementById('btn-admin-logout');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const pass = document.getElementById('login-password').value.trim();

      if (email === 'admin@mehran-sahara.org' && pass === 'sindh2026') {
        sessionStorage.setItem('msf_admin_auth', 'true');
        checkAuth();
      } else {
        alert('Invalid credentials. Use demo: admin@mehran-sahara.org / sindh2026');
      }
    });
  }

  if (demoBtn) {
    demoBtn.addEventListener('click', () => {
      document.getElementById('login-email').value = 'admin@mehran-sahara.org';
      document.getElementById('login-password').value = 'sindh2026';
      sessionStorage.setItem('msf_admin_auth', 'true');
      checkAuth();
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('msf_admin_auth');
      checkAuth();
    });
  }
}

// 3. Tab Navigation
function initSidebarNavigation() {
  const navButtons = document.querySelectorAll('.sidebar-nav-btn');
  const panes = document.querySelectorAll('.admin-tab-pane');
  const topbarTitle = document.getElementById('admin-active-title');

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      navButtons.forEach(b => b.closest('.sidebar-nav-item').classList.remove('active'));
      btn.closest('.sidebar-nav-item').classList.add('active');

      const targetTab = btn.dataset.tab;
      panes.forEach(pane => {
        pane.classList.toggle('active', pane.id === `tab-${targetTab}`);
      });

      if (topbarTitle) {
        topbarTitle.textContent = btn.dataset.title || 'Dashboard Overview';
      }

      // Close mobile sidebar if open
      const sidebar = document.getElementById('admin-sidebar');
      if (sidebar) sidebar.classList.remove('sidebar-open');

      // Refresh specific tab
      if (targetTab === 'donations') renderDonationsTable();
      if (targetTab === 'volunteers') renderVolunteersTable();
      if (targetTab === 'campaigns') renderCampaignsGrid();
      if (targetTab === 'disbursements') renderDisbursementsTable();
      if (targetTab === 'overview') refreshAllDashboardMetrics();
    });
  });
}

// 4. Metrics & KPI Calculator
function refreshAllDashboardMetrics() {
  const donations = JSON.parse(localStorage.getItem('msf_donations') || '[]');
  const volunteers = JSON.parse(localStorage.getItem('msf_volunteers') || '[]');
  const campaigns = JSON.parse(localStorage.getItem('msf_campaigns') || '[]');

  let totalPKR = 0;
  let totalZakat = 0;
  let pendingCount = 0;

  donations.forEach(d => {
    const amountPKR = d.currency === 'USD' ? d.amount * 280 : Number(d.amount);
    totalPKR += amountPKR;
    if (d.frequency === 'zakat' || d.cause.toLowerCase().includes('zakat')) {
      totalZakat += amountPKR;
    }
    if (d.status === 'Pending') {
      pendingCount++;
    }
  });

  const kpiTotal = document.getElementById('kpi-total-raised');
  const kpiZakat = document.getElementById('kpi-total-zakat');
  const kpiVols = document.getElementById('kpi-total-volunteers');
  const kpiPending = document.getElementById('kpi-total-pending');

  if (kpiTotal) kpiTotal.textContent = '₨ ' + totalPKR.toLocaleString('en-PK');
  if (kpiZakat) kpiZakat.textContent = '₨ ' + totalZakat.toLocaleString('en-PK');
  if (kpiVols) kpiVols.textContent = volunteers.length.toString();
  if (kpiPending) kpiPending.textContent = pendingCount.toString();

  // Badges on sidebar
  const badgeDonations = document.getElementById('sidebar-badge-donations');
  const badgeVols = document.getElementById('sidebar-badge-volunteers');
  if (badgeDonations) badgeDonations.textContent = donations.length;
  if (badgeVols) badgeVols.textContent = volunteers.length;

  renderRecentDonationsList();
}

// Render Recent Donations in Overview
function renderRecentDonationsList() {
  const container = document.getElementById('overview-recent-tbody');
  if (!container) return;

  const donations = JSON.parse(localStorage.getItem('msf_donations') || '[]');
  const recents = donations.slice(0, 5);

  container.innerHTML = recents.map(d => `
    <tr>
      <td><strong>${d.id}</strong></td>
      <td>${d.donor}</td>
      <td>${d.cause}</td>
      <td><strong>₨ ${Number(d.amount).toLocaleString()}</strong></td>
      <td><span class="status-pill status-${d.status.toLowerCase()}">${d.status}</span></td>
      <td>${d.date}</td>
    </tr>
  `).join('');
}

// 5. Donations Manager & CSV Exporter
function initDonationsManager() {
  renderDonationsTable();

  const searchInput = document.getElementById('donations-search-input');
  const causeFilter = document.getElementById('donations-cause-filter');
  const statusFilter = document.getElementById('donations-status-filter');
  const exportBtn = document.getElementById('btn-export-donations-csv');

  if (searchInput) searchInput.addEventListener('input', renderDonationsTable);
  if (causeFilter) causeFilter.addEventListener('change', renderDonationsTable);
  if (statusFilter) statusFilter.addEventListener('change', renderDonationsTable);
  if (exportBtn) exportBtn.addEventListener('click', exportDonationsToCSV);
}

function renderDonationsTable() {
  const tbody = document.getElementById('donations-table-body');
  if (!tbody) return;

  const donations = JSON.parse(localStorage.getItem('msf_donations') || '[]');
  const search = document.getElementById('donations-search-input')?.value.toLowerCase() || '';
  const cause = document.getElementById('donations-cause-filter')?.value || 'all';
  const status = document.getElementById('donations-status-filter')?.value || 'all';

  const filtered = donations.filter(d => {
    const matchesSearch = d.id.toLowerCase().includes(search) || 
                          d.donor.toLowerCase().includes(search) || 
                          d.email.toLowerCase().includes(search) || 
                          (d.city && d.city.toLowerCase().includes(search));
    const matchesCause = cause === 'all' || d.cause.includes(cause);
    const matchesStatus = status === 'all' || d.status.toLowerCase() === status.toLowerCase();
    return matchesSearch && matchesCause && matchesStatus;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 2rem; color: var(--admin-text-muted);">No donations match your filter criteria.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(d => `
    <tr>
      <td><strong>${d.id}</strong></td>
      <td>
        <div><strong>${d.donor}</strong></div>
        <div style="font-size: 0.76rem; color: var(--admin-text-muted);">${d.email}</div>
      </td>
      <td>
        <div>${d.cause}</div>
        <div style="font-size: 0.74rem; color: var(--admin-primary); font-weight: 700;">${d.frequency.toUpperCase()}</div>
      </td>
      <td><strong>${d.currency === 'USD' ? '$ ' + Number(d.amount).toLocaleString() : '₨ ' + Number(d.amount).toLocaleString()}</strong></td>
      <td>${d.method.toUpperCase()}</td>
      <td><span class="status-pill status-${d.status.toLowerCase()}">${d.status}</span></td>
      <td><span style="font-size: 0.78rem;">${d.date}</span></td>
      <td>
        <div class="action-btn-group">
          <button class="table-action-btn" onclick="inspectReceipt('${d.id}')" title="Inspect Receipt">Receipt 🧾</button>
          ${d.status === 'Pending' ? `<button class="table-action-btn" onclick="toggleDonationStatus('${d.id}')" title="Verify Payment">Verify ✓</button>` : ''}
        </div>
      </td>
    </tr>
  `).join('');
}

window.toggleDonationStatus = function(txId) {
  const donations = JSON.parse(localStorage.getItem('msf_donations') || '[]');
  const target = donations.find(d => d.id === txId);
  if (target) {
    target.status = target.status === 'Pending' ? 'Verified' : 'Pending';
    localStorage.setItem('msf_donations', JSON.stringify(donations));
    renderDonationsTable();
    refreshAllDashboardMetrics();
  }
};

window.inspectReceipt = function(txId) {
  const donations = JSON.parse(localStorage.getItem('msf_donations') || '[]');
  const target = donations.find(d => d.id === txId);
  if (!target) return;

  alert(`OFFICIAL RECEIPT DETAILS\n\nTransaction ID: ${target.id}\nDonor: ${target.donor}\nAmount: ₨ ${Number(target.amount).toLocaleString()}\nCause: ${target.cause}\nStatus: ${target.status}\nDate: ${target.date}\nPayment: ${target.method.toUpperCase()}\n\nRegistered with Sindh Charity Commission (Reg # SINDH-CC/0488)`);
};

// Export to CSV Function
function exportDonationsToCSV() {
  const donations = JSON.parse(localStorage.getItem('msf_donations') || '[]');
  if (!donations.length) {
    alert('No donation records to export.');
    return;
  }

  const headers = ['Receipt_ID', 'Date', 'Donor_Name', 'Email', 'Phone', 'City', 'Cause', 'Amount', 'Currency', 'Frequency', 'Payment_Method', 'Status'];
  const rows = donations.map(d => [
    `"${d.id}"`,
    `"${d.date}"`,
    `"${d.donor.replace(/"/g, '""')}"`,
    `"${d.email}"`,
    `"${d.phone || ''}"`,
    `"${d.city || ''}"`,
    `"${d.cause.replace(/"/g, '""')}"`,
    d.amount,
    d.currency,
    d.frequency,
    d.method,
    d.status
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Mehran_Sahara_Donations_Audit_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 6. Campaign Manager & Modal
function initCampaignsManager() {
  renderCampaignsGrid();

  const addBtn = document.getElementById('btn-open-new-campaign-modal');
  const modal = document.getElementById('campaign-modal-overlay');
  const closeBtn = document.getElementById('campaign-modal-close');
  const form = document.getElementById('new-campaign-form');

  if (addBtn && modal) {
    addBtn.addEventListener('click', () => {
      modal.style.display = 'flex';
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('new-camp-title').value;
      const district = document.getElementById('new-camp-district').value;
      const goal = parseFloat(document.getElementById('new-camp-goal').value);
      const category = document.getElementById('new-camp-category').value;

      const campaigns = JSON.parse(localStorage.getItem('msf_campaigns') || '[]');
      campaigns.push({
        id: 'CAMP-' + (campaigns.length + 1).toString().padStart(2, '0'),
        title,
        district,
        category,
        raised: 0,
        goal,
        donors: 0,
        status: 'Active',
        img: 'assets/images/hero.jpg'
      });

      localStorage.setItem('msf_campaigns', JSON.stringify(campaigns));
      modal.style.display = 'none';
      form.reset();
      renderCampaignsGrid();
      alert('New Sindh Relief Campaign successfully launched!');
    });
  }
}

function renderCampaignsGrid() {
  const container = document.getElementById('admin-campaigns-container');
  if (!container) return;

  const campaigns = JSON.parse(localStorage.getItem('msf_campaigns') || '[]');

  container.innerHTML = campaigns.map(c => {
    const pct = Math.min(100, Math.round((c.raised / c.goal) * 100));
    return `
      <div class="admin-campaign-card">
        <div class="acc-img-wrap">
          <img src="${c.img}" alt="${c.title}">
        </div>
        <div class="acc-body">
          <div class="acc-district">📍 ${c.district}</div>
          <h4 class="acc-title">${c.title}</h4>
          
          <div class="acc-progress-wrap">
            <div class="acc-meta-numbers">
              <span>₨ ${c.raised.toLocaleString()} (${pct}%)</span>
              <span style="color: var(--admin-text-muted);">Goal: ₨ ${c.goal.toLocaleString()}</span>
            </div>
            <div class="acc-track">
              <div class="acc-bar-fill" style="width: ${pct}%;"></div>
            </div>
          </div>

          <div class="acc-actions">
            <span class="status-pill status-${c.status === 'Active' ? 'verified' : 'pending'}">${c.status}</span>
            <span style="font-size: 0.78rem; color: var(--admin-text-muted);">👥 ${c.donors} Donors</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// 7. Volunteer Registry
function initVolunteersManager() {
  renderVolunteersTable();

  const districtFilter = document.getElementById('volunteers-district-filter');
  if (districtFilter) {
    districtFilter.addEventListener('change', renderVolunteersTable);
  }
}

function renderVolunteersTable() {
  const tbody = document.getElementById('volunteers-table-body');
  if (!tbody) return;

  const volunteers = JSON.parse(localStorage.getItem('msf_volunteers') || '[]');
  const filter = document.getElementById('volunteers-district-filter')?.value || 'all';

  const filtered = volunteers.filter(v => filter === 'all' || v.district === filter);

  tbody.innerHTML = filtered.map(v => `
    <tr>
      <td><strong>${v.id}</strong></td>
      <td><strong>${v.name}</strong></td>
      <td>${v.email}</td>
      <td><a href="https://wa.me/${v.phone.replace(/[^0-9]/g, '')}" target="_blank" style="color: #25D366; font-weight: 700;">${v.phone} 💬</a></td>
      <td><span style="text-transform: capitalize; font-weight: 600;">${v.district}</span></td>
      <td><span class="status-pill status-allocated">${v.skill.toUpperCase()}</span></td>
      <td>${v.date}</td>
    </tr>
  `).join('');
}

// 8. Field Disbursements Log
function initDisbursementsManager() {
  renderDisbursementsTable();
}

function renderDisbursementsTable() {
  const tbody = document.getElementById('disbursements-table-body');
  if (!tbody) return;

  const items = JSON.parse(localStorage.getItem('msf_disbursements') || '[]');
  tbody.innerHTML = items.map(item => `
    <tr>
      <td><strong>${item.voucher}</strong></td>
      <td><strong>₨ ${item.amount.toLocaleString()}</strong></td>
      <td>${item.district}</td>
      <td>${item.project}</td>
      <td>${item.supervisor}</td>
      <td><span class="status-pill status-${item.status === 'Completed' ? 'verified' : 'pending'}">${item.status}</span></td>
      <td>${item.date}</td>
    </tr>
  `).join('');
}

// 9. Mobile & Tablet Sidebar Toggle
function initMobileSidebar() {
  const toggleBtn = document.getElementById('btn-admin-mobile-toggle');
  const sidebar = document.getElementById('admin-sidebar');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('sidebar-open');
    });
  }
}
