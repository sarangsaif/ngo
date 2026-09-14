/* ==========================================================================
   SWISS SINDH RELIEF - CURRENCY & DONATION ENGINE (100% REACTIVE)
   Supports CHF (Default), EUR, USD, PKR across all components, cards & widgets
   ========================================================================== */

const DonationState = {
  currency: 'CHF', // Default Swiss Franc
  exchangeRates: {
    CHF: 1.0,     // Base
    EUR: 0.94,    // 1 CHF = 0.94 EUR
    USD: 1.15,    // 1 CHF = 1.15 USD
    PKR: 320.0    // 1 CHF = 320 PKR
  },
  frequency: 'once', // 'once' | 'monthly' | 'zakat'
  cause: 'General Sindh Emergency Relief',
  amount: 75,
  paymentMethod: 'twint',
  donor: {
    fullName: '',
    email: '',
    phone: '',
    city: '',
    country: 'Switzerland',
    isAnonymous: false,
    dedication: ''
  }
};

// Preset Amounts mapped to currency
const Presets = {
  CHF: [25, 50, 75, 150, 350, 800],
  EUR: [25, 50, 75, 150, 350, 800],
  USD: [30, 60, 90, 180, 400, 900],
  PKR: [8000, 15000, 24000, 48000, 112000, 250000]
};

// Gamified 1-CHF Spark stepped amounts per currency
const SparkSteps = {
  CHF: [1, 2, 5, 10, 25, 50],
  EUR: [1, 2, 5, 10, 25, 50],
  USD: [1, 3, 6, 12, 30, 60],
  PKR: [300, 600, 1500, 3000, 7500, 15000]
};

// Format Money across currencies with Swiss precision
function formatMoney(amount, currency = DonationState.currency) {
  const num = Number(amount);
  if (currency === 'CHF') {
    return `CHF ${num.toLocaleString('de-CH')}.–`;
  } else if (currency === 'EUR') {
    return `€ ${num.toLocaleString('de-DE')}`;
  } else if (currency === 'USD') {
    return `$ ${num.toLocaleString('en-US')}`;
  } else {
    return `₨ ${num.toLocaleString('en-PK')}`;
  }
}

// Convert from CHF base to target currency
function convertFromChf(chfAmount, targetCurrency = DonationState.currency) {
  const rate = DonationState.exchangeRates[targetCurrency] || 1.0;
  const val = chfAmount * rate;
  if (targetCurrency === 'PKR') {
    return Math.round(val / 100) * 100;
  } else if (targetCurrency === 'USD') {
    return Math.round(val / 5) * 5 || Math.round(val);
  } else {
    return Math.round(val / 5) * 5 || Math.round(val);
  }
}

// Convert from any currency to another
function convertAmount(amount, from, to) {
  if (from === to) return amount;
  const chfBase = amount / (DonationState.exchangeRates[from] || 1.0);
  return convertFromChf(chfBase, to);
}

// Impact descriptors mapped to CHF value
function getImpactDescription(chfAmount) {
  if (chfAmount < 5) {
    return "Liefert 25 Liter reinstes, fluoridfreies Trinkwasser für ein Wüstenkind.";
  } else if (chfAmount < 25) {
    return "Schenkt 1 Monat Schulhefte, Stifte & nahrhafte Mahlzeiten für ein Mädchen.";
  } else if (chfAmount < 70) {
    return "Versorgt eine 5-köpfige Familie mit Notfall-Rationen, Entkeimungs-Kits & Vitaminen.";
  } else if (chfAmount < 140) {
    return "Schenkt 1 ganzes Jahr Bildung: Schuluniform, Ranzen, Bücher und Solar-Studienlampe.";
  } else if (chfAmount < 300) {
    return "Ermöglicht den Bau eines Solar-Tiefbrunnens in Thar für über 150 Dorfbewohner.";
  } else if (chfAmount < 700) {
    return "Ausstattung eines Dorf-Klassenzimmers mit Solaranlage, Deckenventilatoren & Lern-Tablets.";
  } else {
    return "Vollständiger Bau eines flutsicheren, 1,2m hochgelegten Backsteinhauses für eine Familie.";
  }
}

// Master DOM Currency Update (Updates every single number and label on page)
function updateAllCurrenciesOnPage() {
  const curr = DonationState.currency;

  // 1. Update Symbol texts
  const symbolMap = { CHF: 'CHF', EUR: '€', USD: '$', PKR: '₨' };
  document.querySelectorAll('.curr-symbol-text').forEach(el => {
    el.textContent = symbolMap[curr] || curr;
  });

  // 2. Update Active Button states in all toggles
  document.querySelectorAll('.curr-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll(`.curr-${curr.toLowerCase()}-btn`).forEach(btn => btn.classList.add('active'));

  // 3. Update Hero Preset Buttons
  refreshPresetButtons();
  updateImpactCardUI();

  // 4. Update Hero Stats Row
  const heroStatAid = document.getElementById('hero-stat-aid');
  if (heroStatAid) {
    const aidInChf = 1800000;
    if (curr === 'CHF') heroStatAid.innerHTML = `CHF 1.8M<span class="plus">+</span>`;
    else if (curr === 'EUR') heroStatAid.innerHTML = `€ 1.7M<span class="plus">+</span>`;
    else if (curr === 'USD') heroStatAid.innerHTML = `$ 2.1M<span class="plus">+</span>`;
    else heroStatAid.innerHTML = `₨ 570M<span class="plus">+</span>`;
  }

  // 5. Update Campaign Cards (Goals, Raised, and Donate Buttons)
  document.querySelectorAll('.campaign-card').forEach(card => {
    const goalChf = parseFloat(card.dataset.baseGoalChf) || 50000;
    const raisedChf = parseFloat(card.dataset.baseRaisedChf) || 38400;
    const defaultChf = parseFloat(card.dataset.baseDefaultChf) || 100;

    const goalConverted = convertFromChf(goalChf, curr);
    const raisedConverted = convertFromChf(raisedChf, curr);
    const defaultConverted = convertFromChf(defaultChf, curr);

    const raisedEl = card.querySelector('.raised-val');
    const goalEl = card.querySelector('.goal-val');
    const btnEl = card.querySelector('.btn-donate-campaign');

    if (raisedEl) raisedEl.textContent = `${formatMoney(raisedConverted, curr)} gesammelt`;
    if (goalEl) goalEl.textContent = `Ziel: ${formatMoney(goalConverted, curr)}`;
    if (btnEl) {
      btnEl.textContent = `Jetzt fördern (${formatMoney(defaultConverted, curr)}) →`;
      btnEl.dataset.currentAmount = defaultConverted;
    }
  });

  // 6. Update Story Cards (Impact Tags and CTA Buttons)
  document.querySelectorAll('.story-photo-card').forEach(card => {
    const baseChf = parseFloat(card.dataset.baseChf) || 75;
    const converted = convertFromChf(baseChf, curr);
    const impactTag = card.querySelector('.story-card-impact-tag');
    const donateBtn = card.querySelector('.story-donate-btn');

    if (impactTag) {
      const label = impactTag.dataset.impactLabel || 'Wirkung';
      impactTag.textContent = `${formatMoney(converted, curr)} = ${label}`;
    }
    if (donateBtn) {
      const name = donateBtn.dataset.personName || 'Projekt';
      donateBtn.textContent = `${name} fördern (${formatMoney(converted, curr)}) 💚`;
    }
  });

  // 7. Update Gamified 1-CHF Spark widget
  if (typeof updateSparkWidgetCurrency === 'function') {
    try {
      updateSparkWidgetCurrency();
    } catch (err) {
      console.warn('Spark widget update deferred:', err);
    }
  }

  // 8. Update Simulator Display
  if (typeof updateSimulatorDisplay === 'function') {
    try {
      updateSimulatorDisplay();
    } catch (err) {
      console.warn('Simulator display update deferred:', err);
    }
  }

  // 9. Update Modal values if open
  const modalInput = document.getElementById('wizard-amount-input');
  if (modalInput) {
    modalInput.value = DonationState.amount;
  }
  const summaryAmount = document.getElementById('summary-pay-amount');
  if (summaryAmount) {
    summaryAmount.textContent = formatMoney(DonationState.amount);
  }
  const twintPreview = document.getElementById('twint-preview-amount');
  if (twintPreview) {
    twintPreview.textContent = formatMoney(DonationState.amount);
  }
}

// Currency Switcher Listener Setup
function initCurrencyControls() {
  document.querySelectorAll('.curr-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      let targetCurr = 'CHF';
      if (btn.classList.contains('curr-eur-btn')) targetCurr = 'EUR';
      else if (btn.classList.contains('curr-usd-btn')) targetCurr = 'USD';
      else if (btn.classList.contains('curr-pkr-btn')) targetCurr = 'PKR';
      else targetCurr = 'CHF';

      setCurrency(targetCurr);
    });
  });
}

function setCurrency(newCurr) {
  if (DonationState.currency === newCurr) return;

  const oldCurr = DonationState.currency;
  DonationState.currency = newCurr;

  // Convert current selected amount
  DonationState.amount = convertAmount(DonationState.amount, oldCurr, newCurr);

  // Update entire page reactively
  updateAllCurrenciesOnPage();

  showToast(`Währung gewechselt zu ${newCurr}`, '🇨🇭');
}

// Refresh Hero Preset Buttons
function refreshPresetButtons() {
  const container = document.getElementById('hero-preset-grid');
  if (!container) return;

  container.innerHTML = '';
  const list = Presets[DonationState.currency] || Presets.CHF;

  list.forEach((val, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `amount-btn ${idx === 2 ? 'active' : ''}`;
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

  DonationState.amount = list[2] || list[1];
}

// Hero Quick Donation Widget
function initHeroWidget() {
  refreshPresetButtons();

  const freqTabs = document.querySelectorAll('.hero-freq-btn');
  freqTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      freqTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      DonationState.frequency = btn.dataset.freq;
      updateImpactCardUI();
    });
  });

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

  const heroDonateBtn = document.getElementById('hero-submit-donate-btn');
  if (heroDonateBtn) {
    heroDonateBtn.addEventListener('click', () => {
      openDonationModal({
        amount: DonationState.amount,
        frequency: DonationState.frequency,
        cause: 'General Sindh Emergency Relief'
      });
    });
  }
}

function updateImpactCardUI() {
  const impactDesc = document.getElementById('hero-impact-text');
  if (!impactDesc) return;

  const chfEquivalent = DonationState.currency === 'CHF'
    ? DonationState.amount
    : convertAmount(DonationState.amount, DonationState.currency, 'CHF');

  impactDesc.textContent = getImpactDescription(chfEquivalent);
}

/* ==========================================================================
   Checkout Donation Modal Flow & Swiss Gateways
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

  const payCards = document.querySelectorAll('.payment-option-card');
  payCards.forEach(card => {
    card.addEventListener('click', () => {
      payCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      DonationState.paymentMethod = card.dataset.method;
      updatePaymentInstructions(card.dataset.method);
    });
  });

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
  if (modalOverlay) {
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

// Instant Micro-Donation Modal for 1-CHF Quick TWINT
function openMicroDonationModal(amount = 1) {
  openDonationModal({
    amount: amount,
    cause: '1-Franken Trinkwasser- & Soforthilfefonds',
    frequency: 'once'
  });
  // Jump directly to payment step for effortless 1-click giving!
  DonationState.donor.fullName = 'Schweizer Solidaritäts-Spender';
  DonationState.donor.email = 'spender@swiss-sindh.ch';
  DonationState.paymentMethod = 'twint';
  setWizardStep(3);
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

  if (step === 3) {
    const summaryAmount = document.getElementById('summary-pay-amount');
    const summaryCause = document.getElementById('summary-pay-cause');
    if (summaryAmount) summaryAmount.textContent = formatMoney(DonationState.amount);
    if (summaryCause) summaryCause.textContent = DonationState.cause;
    updatePaymentInstructions(DonationState.paymentMethod);
  }
}

function goToStep2() {
  const amountInput = document.getElementById('wizard-amount-input');
  const causeSelect = document.getElementById('wizard-cause-select');
  const freqSelect = document.getElementById('wizard-freq-select');

  const val = parseFloat(amountInput.value);
  if (isNaN(val) || val <= 0) {
    alert('Bitte geben Sie einen gültigen Spendenbetrag ein.');
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
    alert('Bitte geben Sie Ihren Namen und E-Mail für die Spendenquittung ein oder wählen Sie "Anonym spenden".');
    return;
  }

  DonationState.donor = {
    fullName: anonCheck.checked ? 'Anonymer Spender / Anonymous Donor' : nameInput.value.trim(),
    email: emailInput.value.trim() || 'spenden@swiss-sindh.ch',
    phone: phoneInput.value.trim() || '+41 79 000 00 00',
    city: cityInput.value.trim() || 'Schweiz',
    isAnonymous: anonCheck.checked,
    dedication: dedicationInput ? dedicationInput.value.trim() : ''
  };

  setWizardStep(3);
}

function updatePaymentInstructions(method) {
  const detailsBox = document.getElementById('gateway-dynamic-instructions');
  if (!detailsBox) return;

  const currentAmt = formatMoney(DonationState.amount);

  let html = '';
  switch (method) {
    case 'twint':
      html = `
        <div class="swiss-pay-box twint-box">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom: 0.8rem;">
            <span style="font-weight: 800; font-size: 1.05rem; color: #00A349;">🟢 TWINT Sofortspende</span>
            <span style="background:#00A349; color:#fff; padding:2px 8px; border-radius:4px; font-size:0.75rem; font-weight:700;">Keine Gebühren</span>
          </div>
          <div class="instruction-step"><strong>1. Spenden-Betrag:</strong> <span style="font-size: 1.15rem; font-weight: 800; color: #00A349;">${currentAmt}</span></div>
          <div class="instruction-step"><strong>2. TWINT Direktnummer:</strong> <code>+41 79 340 82 19</code> (Swiss Sindh Relief)</div>
          <div class="instruction-step"><strong>3. Push-Anfrage auf Ihr Smartphone:</strong></div>
          <div style="display:flex; gap:0.5rem; margin-top:0.6rem;">
            <input type="tel" class="form-control" id="twint-phone-input" placeholder="+41 79 XXX XX XX" value="${DonationState.donor.phone.startsWith('+41') ? DonationState.donor.phone : '+41 '}" style="flex:1;">
            <button type="button" class="btn btn-sm btn-primary" onclick="showToast('TWINT Push-Anforderung gesendet! Bitte in der TWINT App freigeben.', '📱')">TWINT Push</button>
          </div>
        </div>
      `;
      break;

    case 'qrbill':
      html = `
        <div class="swiss-pay-box qrbill-box">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom: 0.8rem;">
            <span style="font-weight: 800; font-size: 1.05rem; color: var(--text-heading);">🇨🇭 Schweizer QR-Rechnung</span>
            <span style="font-size:0.75rem; color:var(--text-muted);">E-Banking Scan</span>
          </div>
          <div class="instruction-step"><strong>Konto / IBAN:</strong> <code>CH93 0076 2011 6238 9104 2</code></div>
          <div class="instruction-step"><strong>Begünstigter:</strong> Swiss Sindh Relief, 8001 Zürich</div>
          <div class="instruction-step"><strong>QR-Referenz:</strong> <code>21 00000 00000 92830 19283 04881</code></div>
          <div class="instruction-step"><strong>Betrag:</strong> <strong>${currentAmt}</strong></div>
          <div style="margin-top: 0.8rem; display:flex; gap:0.6rem;">
            <button type="button" class="btn btn-sm btn-outline" onclick="showToast('IBAN in Zwischenablage kopiert!', '📋')">📋 IBAN kopieren</button>
            <button type="button" class="btn btn-sm btn-outline" onclick="showToast('QR-Rechnung als PDF wird vorbereitet...', '📄')">📄 QR-Rechnung PDF</button>
          </div>
        </div>
      `;
      break;

    case 'postfinance':
      html = `
        <div class="swiss-pay-box">
          <div style="font-weight: 800; font-size: 1.05rem; color: #111; margin-bottom: 0.8rem;">PostFinance E-Finance & Card</div>
          <div class="instruction-step"><strong>1.</strong> Verschlüsselte Weiterleitung zum PostFinance Portal.</div>
          <div class="instruction-step"><strong>2.</strong> Spendenbetrag: <strong>${currentAmt}</strong> (gebührenfrei für Schweizer Hilfswerke).</div>
        </div>
      `;
      break;

    case 'card':
      html = `
        <div class="swiss-pay-box">
          <div style="display: flex; flex-direction: column; gap: 0.6rem;">
            <label style="font-size: 0.78rem; font-weight:700; color:var(--text-muted);">Kreditkarte / Debitkarte / Apple Pay:</label>
            <input type="text" class="form-control" placeholder="Name des Karteninhabers" value="${DonationState.donor.fullName !== 'Anonymer Spender / Anonymous Donor' ? DonationState.donor.fullName : ''}">
            <input type="text" class="form-control" placeholder="Kartennummer (Visa, Mastercard, Amex)" maxlength="19" value="4242 •••• •••• 4242">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem;">
              <input type="text" class="form-control" placeholder="MM/YY" value="12/28">
              <input type="password" class="form-control" placeholder="CVC" maxlength="4" value="888">
            </div>
          </div>
        </div>
      `;
      break;

    case 'raast':
      html = `
        <div class="instruction-step"><strong>1. Instant Raast ID:</strong> <code>03004746341</code> oder IBAN: <code>PK42MEZN0001089201928301</code></div>
        <div class="instruction-step"><strong>2. Bank:</strong> Meezan Bank Limited (Islamic Banking Sindh / Field Direct Account)</div>
        <div class="instruction-step"><strong>3. Title:</strong> Mehran Sahara Relief & Welfare Trust</div>
      `;
      break;

    default:
      html = `<div class="instruction-step">Direktüberweisung auf das offizielle Schweizer Hilfswerkkonto.</div>`;
  }

  detailsBox.innerHTML = html;
}

function processDonationPayment() {
  const submitBtn = document.getElementById('btn-wizard-submit-payment');
  if (!submitBtn) return;

  submitBtn.disabled = true;
  submitBtn.innerHTML = `Zahlung wird verifiziert...`;

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `Spende abschliessen`;

    closeDonationModal();

    const txId = 'SSR-CH-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);
    const dateStr = new Date().toLocaleDateString('de-CH', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const elTx = document.getElementById('receipt-tx-id');
    const elDate = document.getElementById('receipt-date');
    const elDonor = document.getElementById('receipt-donor-name');
    const elEmail = document.getElementById('receipt-donor-email');
    const elCause = document.getElementById('receipt-cause');
    const elFreq = document.getElementById('receipt-freq');
    const elMethod = document.getElementById('receipt-method');
    const elAmt = document.getElementById('receipt-amount');

    if (elTx) elTx.textContent = txId;
    if (elDate) elDate.textContent = dateStr;
    if (elDonor) elDonor.textContent = DonationState.donor.fullName;
    if (elEmail) elEmail.textContent = DonationState.donor.email;
    if (elCause) elCause.textContent = DonationState.cause;
    if (elFreq) elFreq.textContent = DonationState.frequency.toUpperCase();
    if (elMethod) elMethod.textContent = DonationState.paymentMethod.toUpperCase();
    if (elAmt) elAmt.textContent = formatMoney(DonationState.amount);

    const receiptModal = document.getElementById('receipt-modal-overlay');
    if (receiptModal) {
      receiptModal.classList.add('active');
    }

    showToast('Herzlichen Dank für Ihre lebensrettende Solidarität! 🇨🇭💚', '💚');
  }, 1000);
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initCurrencyControls();
  initHeroWidget();
  initDonationModal();
  updateAllCurrenciesOnPage();
});

window.openDonationModal = openDonationModal;
window.closeDonationModal = closeDonationModal;
window.openMicroDonationModal = openMicroDonationModal;
window.setCurrency = setCurrency;
window.formatMoney = formatMoney;
window.convertFromChf = convertFromChf;
window.updateAllCurrenciesOnPage = updateAllCurrenciesOnPage;
window.DonationState = DonationState;
window.SparkSteps = SparkSteps;
