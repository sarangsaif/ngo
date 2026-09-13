/* ==========================================================================
   MEHRAN SAHARA FOUNDATION - DONATION SYSTEM & CHECKOUT ENGINE
   ========================================================================== */

const DonationState = {
  currency: 'PKR',
  exchangeRate: 280, // 1 USD = 280 PKR
  frequency: 'once', // 'once' | 'monthly' | 'zakat'
  cause: 'General Sindh Relief Fund',
  amount: 3500,
  paymentMethod: 'easypaisa',
  donor: {
    fullName: '',
    email: '',
    phone: '',
    city: '',
    isAnonymous: false,
    dedication: ''
  }
};

// Preset Amounts mapped to currency
const Presets = {
  PKR: [1500, 3500, 10000, 35000, 75000, 150000],
  USD: [15, 25, 50, 150, 300, 600]
};

// Impact descriptors mapped to PKR value ranges
function getImpactDescription(pkrAmount) {
  if (pkrAmount < 2500) {
    return "Provides clean drinking water filter and nutrition packs for 1 rural child for a month.";
  } else if (pkrAmount < 8000) {
    return "Supplies 1 month of emergency food rations & clean water jerrycans for an entire family.";
  } else if (pkrAmount < 25000) {
    return "Sponsors a schoolbag, uniform, solar study lamp, and textbooks for 2 rural girls for a full school year.";
  } else if (pkrAmount < 60000) {
    return "Installs a deep-bore community freshwater handpump in Tharparkar serving over 150 villagers.";
  } else if (pkrAmount < 120000) {
    return "Sets up solar lighting & ceiling fans for a rural community school classroom in interior Sindh.";
  } else {
    return "Funds high-plinth climate-resilient brick shelter construction for a displaced family in Dadu/Khairpur.";
  }
}

// Format Currency
function formatMoney(amount, currency = DonationState.currency) {
  if (currency === 'PKR') {
    return '₨ ' + Number(amount).toLocaleString('en-PK');
  } else {
    return '$ ' + Number(amount).toLocaleString('en-US');
  }
}

// Convert between currencies
function convertAmount(amount, from, to) {
  if (from === to) return amount;
  if (from === 'USD' && to === 'PKR') {
    return Math.round(amount * DonationState.exchangeRate);
  }
  if (from === 'PKR' && to === 'USD') {
    return Math.max(5, Math.round(amount / DonationState.exchangeRate));
  }
  return amount;
}

// Initialize Donation Engine
document.addEventListener('DOMContentLoaded', () => {
  initCurrencyControls();
  initHeroWidget();
  initDonationModal();
  updateImpactCardUI();
});

// Currency Switcher
function initCurrencyControls() {
  const pkrBtns = document.querySelectorAll('.curr-pkr-btn');
  const usdBtns = document.querySelectorAll('.curr-usd-btn');

  function setCurrency(newCurr) {
    if (DonationState.currency === newCurr) return;
    
    const oldCurr = DonationState.currency;
    DonationState.currency = newCurr;

    // Convert current amount
    DonationState.amount = convertAmount(DonationState.amount, oldCurr, newCurr);

    // Update active button state
    document.querySelectorAll('.curr-btn').forEach(b => b.classList.remove('active'));
    if (newCurr === 'PKR') {
      pkrBtns.forEach(b => b.classList.add('active'));
      document.querySelectorAll('.curr-symbol-text').forEach(el => el.textContent = '₨');
    } else {
      usdBtns.forEach(b => b.classList.add('active'));
      document.querySelectorAll('.curr-symbol-text').forEach(el => el.textContent = '$');
    }

    // Update preset buttons and custom inputs
    refreshPresetButtons();
    updateImpactCardUI();
    if (typeof updateSimulatorDisplay === 'function') {
      updateSimulatorDisplay();
    }

    showToast(`Currency updated to ${newCurr}`, '🌐');
  }

  pkrBtns.forEach(b => b.addEventListener('click', () => setCurrency('PKR')));
  usdBtns.forEach(b => b.addEventListener('click', () => setCurrency('USD')));
}

// Refresh Preset Buttons on Currency Change
function refreshPresetButtons() {
  const container = document.getElementById('hero-preset-grid');
  if (!container) return;

  container.innerHTML = '';
  const list = Presets[DonationState.currency];

  list.forEach((val, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `amount-btn ${idx === 1 ? 'active' : ''}`;
    btn.textContent = formatMoney(val);
    btn.dataset.amount = val;

    btn.addEventListener('click', () => {
      container.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      DonationState.amount = val;
      const customInput = document.getElementById('hero-custom-amount');
      if (customInput) customInput.value = '';
      updateImpactCardUI();
    });

    container.appendChild(btn);
  });

  // Default to second preset
  DonationState.amount = list[1];
}

// Hero Quick Donation Widget Init
function initHeroWidget() {
  refreshPresetButtons();

  // Frequency tabs
  const freqTabs = document.querySelectorAll('.hero-freq-btn');
  freqTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      freqTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      DonationState.frequency = btn.dataset.freq;
      updateImpactCardUI();
    });
  });

  // Custom amount input
  const customInput = document.getElementById('hero-custom-amount');
  if (customInput) {
    customInput.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (!isNaN(val) && val > 0) {
        document.querySelectorAll('#hero-preset-grid .amount-btn').forEach(b => b.classList.remove('active'));
        DonationState.amount = val;
        updateImpactCardUI();
      }
    });
  }

  // Hero Donate Button
  const heroDonateBtn = document.getElementById('hero-submit-donate-btn');
  if (heroDonateBtn) {
    heroDonateBtn.addEventListener('click', () => {
      openDonationModal({
        amount: DonationState.amount,
        frequency: DonationState.frequency,
        cause: 'General Sindh Relief Fund'
      });
    });
  }
}

// Update Impact text on Hero Card
function updateImpactCardUI() {
  const impactDesc = document.getElementById('hero-impact-text');
  if (!impactDesc) return;

  const pkrEquivalent = DonationState.currency === 'PKR' 
    ? DonationState.amount 
    : DonationState.amount * DonationState.exchangeRate;

  impactDesc.textContent = getImpactDescription(pkrEquivalent);
}

/* ==========================================================================
   Checkout Donation Modal Flow
   ========================================================================== */

let currentWizardStep = 1;

function initDonationModal() {
  const modalOverlay = document.getElementById('donation-modal-overlay');
  const closeBtn = document.getElementById('donation-modal-close');

  if (closeBtn && modalOverlay) {
    closeBtn.addEventListener('click', () => closeDonationModal());
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeDonationModal();
    });
  }

  // Wizard Navigation
  const nextToStep2 = document.getElementById('btn-wizard-to-step2');
  const backToStep1 = document.getElementById('btn-wizard-back-step1');
  const nextToStep3 = document.getElementById('btn-wizard-to-step3');
  const backToStep2 = document.getElementById('btn-wizard-back-step2');
  const submitPaymentBtn = document.getElementById('btn-wizard-submit-payment');

  if (nextToStep2) nextToStep2.addEventListener('click', goToStep2);
  if (backToStep1) backToStep1.addEventListener('click', () => setWizardStep(1));
  if (nextToStep3) nextToStep3.addEventListener('click', goToStep3);
  if (backToStep2) backToStep2.addEventListener('click', () => setWizardStep(2));
  if (submitPaymentBtn) submitPaymentBtn.addEventListener('click', processDonationPayment);

  // Payment method selection
  const payCards = document.querySelectorAll('.payment-option-card');
  payCards.forEach(card => {
    card.addEventListener('click', () => {
      payCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      DonationState.paymentMethod = card.dataset.method;
      updatePaymentInstructions(card.dataset.method);
    });
  });

  // Receipt Modal actions
  const printBtn = document.getElementById('print-receipt-btn');
  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }

  const closeReceiptBtn = document.getElementById('receipt-modal-close');
  if (closeReceiptBtn) {
    closeReceiptBtn.addEventListener('click', () => {
      document.getElementById('receipt-modal-overlay').classList.remove('active');
    });
  }
}

// Open Donation Modal with specific cause/amount pre-filled
function openDonationModal(options = {}) {
  if (options.amount) DonationState.amount = options.amount;
  if (options.frequency) DonationState.frequency = options.frequency;
  if (options.cause) DonationState.cause = options.cause;

  const modalOverlay = document.getElementById('donation-modal-overlay');
  const causeSelect = document.getElementById('wizard-cause-select');
  const amountInput = document.getElementById('wizard-amount-input');
  const freqSelect = document.getElementById('wizard-freq-select');

  if (causeSelect && options.cause) causeSelect.value = options.cause;
  if (amountInput) amountInput.value = DonationState.amount;
  if (freqSelect && options.frequency) freqSelect.value = options.frequency;

  setWizardStep(1);
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeDonationModal() {
  const modalOverlay = document.getElementById('donation-modal-overlay');
  if (modalOverlay) {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

function setWizardStep(step) {
  currentWizardStep = step;

  // Update indicators
  for (let i = 1; i <= 3; i++) {
    const indicator = document.getElementById(`wizard-indicator-${i}`);
    const content = document.getElementById(`wizard-step-${i}`);
    if (indicator) {
      indicator.classList.remove('active', 'completed');
      if (i === step) indicator.classList.add('active');
      else if (i < step) indicator.classList.add('completed');
    }
    if (content) {
      content.classList.toggle('active', i === step);
    }
  }
}

function goToStep2() {
  const amountInput = document.getElementById('wizard-amount-input');
  const causeSelect = document.getElementById('wizard-cause-select');
  const freqSelect = document.getElementById('wizard-freq-select');

  const val = parseFloat(amountInput.value);
  if (isNaN(val) || val <= 0) {
    alert('Please enter a valid donation amount.');
    return;
  }

  DonationState.amount = val;
  DonationState.cause = causeSelect.value;
  DonationState.frequency = freqSelect.value;

  setWizardStep(2);
}

function goToStep3() {
  const nameInput = document.getElementById('donor-name');
  const emailInput = document.getElementById('donor-email');
  const phoneInput = document.getElementById('donor-phone');
  const cityInput = document.getElementById('donor-city');
  const anonCheck = document.getElementById('donor-anonymous');
  const dedicationInput = document.getElementById('donor-dedication');

  if (!anonCheck.checked && (!nameInput.value.trim() || !emailInput.value.trim())) {
    alert('Please enter your name and email address, or check "Make my donation anonymous".');
    return;
  }

  DonationState.donor = {
    fullName: anonCheck.checked ? 'Generous Anonymous Donor' : nameInput.value.trim(),
    email: emailInput.value.trim() || 'donor@mehran-sahara.org',
    phone: phoneInput.value.trim() || '+92-300-0000000',
    city: cityInput.value.trim() || 'Sindh, Pakistan',
    isAnonymous: anonCheck.checked,
    dedication: dedicationInput.value.trim()
  };

  // Update Summary before Payment
  const summaryAmount = document.getElementById('summary-pay-amount');
  const summaryCause = document.getElementById('summary-pay-cause');
  if (summaryAmount) summaryAmount.textContent = formatMoney(DonationState.amount);
  if (summaryCause) summaryCause.textContent = DonationState.cause;

  setWizardStep(3);
}

function updatePaymentInstructions(method) {
  const detailsBox = document.getElementById('gateway-dynamic-instructions');
  if (!detailsBox) return;

  const pkrVal = DonationState.currency === 'PKR' ? DonationState.amount : DonationState.amount * DonationState.exchangeRate;

  let html = '';
  switch (method) {
    case 'easypaisa':
      html = `
        <div class="instruction-step"><strong>1.</strong> Send <strong>${formatMoney(DonationState.amount)}</strong> to Easypaisa Till / Mobile Account: <strong>0300-4746341 (Mehran Sahara Trust)</strong></div>
        <div class="instruction-step"><strong>2.</strong> Or enter your registered Easypaisa mobile number below to receive an instant push payment request on your phone.</div>
        <input type="tel" class="form-control" placeholder="03XXXXXXXXX (Your Easypaisa mobile number)" style="margin-top: 0.8rem;" value="03">
      `;
      break;
    case 'jazzcash':
      html = `
        <div class="instruction-step"><strong>1.</strong> Send <strong>${formatMoney(DonationState.amount)}</strong> to JazzCash Till ID: <strong>928174 (Mehran Sahara Relief)</strong></div>
        <div class="instruction-step"><strong>2.</strong> Or enter your registered JazzCash phone number for instant MPIN prompt.</div>
        <input type="tel" class="form-control" placeholder="03XXXXXXXXX (Your JazzCash mobile number)" style="margin-top: 0.8rem;" value="03">
      `;
      break;
    case 'raast':
      html = `
        <div class="instruction-step"><strong>1. Instant Raast ID:</strong> <code>03004746341</code> or IBAN: <code>PK42MEZN0001089201928301</code></div>
        <div class="instruction-step"><strong>2. Bank:</strong> Meezan Bank Limited (Islamic Banking Sindh)</div>
        <div class="instruction-step"><strong>3. Title:</strong> Mehran Sahara Relief & Welfare Trust</div>
      `;
      break;
    case 'card':
      html = `
        <div style="display: flex; flex-direction: column; gap: 0.6rem;">
          <input type="text" class="form-control" placeholder="Cardholder Name" value="${DonationState.donor.fullName !== 'Generous Anonymous Donor' ? DonationState.donor.fullName : ''}">
          <input type="text" class="form-control" placeholder="Card Number (Visa, Mastercard, PayPak)" maxlength="19" value="4242 •••• •••• 4242">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem;">
            <input type="text" class="form-control" placeholder="MM/YY" value="12/28">
            <input type="password" class="form-control" placeholder="CVC" maxlength="4" value="888">
          </div>
        </div>
      `;
      break;
    case 'paypal':
      html = `
        <div class="instruction-step">Recommended for Overseas Pakistani Diaspora in USA, UK, Canada & Middle East.</div>
        <div class="instruction-step">USD equivalent will be securely processed: <strong>${DonationState.currency === 'USD' ? formatMoney(DonationState.amount, 'USD') : formatMoney(Math.round(pkrVal / 280), 'USD')}</strong></div>
      `;
      break;
    default:
      html = `<div class="instruction-step">Direct transfer to Mehran Sahara Foundation official trust account.</div>`;
  }

  detailsBox.innerHTML = html;
}

// Process Payment & Render Receipt
function processDonationPayment() {
  const submitBtn = document.getElementById('btn-wizard-submit-payment');
  if (!submitBtn) return;

  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <svg style="animation: spin 1s linear infinite; width: 18px; height: 18px; margin-right: 6px;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="10" stroke-width="3" stroke-dasharray="32" stroke-linecap="round"></circle>
    </svg>
    Securing Your Donation...
  `;

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `Complete Donation`;

    // Close donation modal
    closeDonationModal();

    // Generate Transaction Reference
    const txId = 'MSF-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);
    const dateStr = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Populate Receipt
    document.getElementById('receipt-tx-id').textContent = txId;
    document.getElementById('receipt-date').textContent = dateStr;
    document.getElementById('receipt-donor-name').textContent = DonationState.donor.fullName;
    document.getElementById('receipt-donor-email').textContent = DonationState.donor.email;
    document.getElementById('receipt-cause').textContent = DonationState.cause;
    document.getElementById('receipt-freq').textContent = DonationState.frequency.toUpperCase();
    document.getElementById('receipt-method').textContent = DonationState.paymentMethod.toUpperCase();
    document.getElementById('receipt-amount').textContent = formatMoney(DonationState.amount);

    const zakatBadge = document.getElementById('receipt-zakat-status');
    if (DonationState.frequency === 'zakat') {
      zakatBadge.textContent = '100% ZAKAT APPLIED (0% ADMIN DEDUCTION)';
      zakatBadge.style.display = 'inline-block';
    } else {
      zakatBadge.textContent = 'TAX EXEMPT SINDH CHARITY DONATION';
    }

    // Persist donation into localStorage for Admin Portal
    try {
      const existing = JSON.parse(localStorage.getItem('msf_donations') || '[]');
      const newDonation = {
        id: txId,
        date: dateStr,
        donor: DonationState.donor.fullName,
        email: DonationState.donor.email,
        phone: DonationState.donor.phone,
        city: DonationState.donor.city,
        cause: DonationState.cause,
        amount: DonationState.amount,
        currency: DonationState.currency,
        frequency: DonationState.frequency,
        method: DonationState.paymentMethod,
        isAnonymous: DonationState.donor.isAnonymous,
        dedication: DonationState.donor.dedication,
        status: 'Verified'
      };
      existing.unshift(newDonation);
      localStorage.setItem('msf_donations', JSON.stringify(existing));
    } catch (err) {
      console.warn('Could not persist donation to localStorage', err);
    }

    // Show Receipt Modal
    const receiptModal = document.getElementById('receipt-modal-overlay');
    if (receiptModal) {
      receiptModal.classList.add('active');
    }

    showToast('Alhamdulillah! Your contribution for Sindh has been received.', '💚');
  }, 1200);
}
