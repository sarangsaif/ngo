/* ==========================================================================
   MEHRAN SAHARA FOUNDATION - SINDH ZAKAT CALCULATOR
   ========================================================================== */

const ZakatConfig = {
  silverNisabPKR: 185000,   // Standard silver Nisab equivalent (612.36g)
  silverNisabUSD: 660,
  zakatRate: 0.025           // 2.5%
};

document.addEventListener('DOMContentLoaded', () => {
  initZakatCalculator();
});

function initZakatCalculator() {
  const calcInputs = document.querySelectorAll('.zakat-input-calc');
  const zakatResultEl = document.getElementById('zakat-calculated-display');
  const zakatDonateBtn = document.getElementById('btn-donate-calculated-zakat');

  function calculateZakat() {
    const cash = parseFloat(document.getElementById('zakat-cash')?.value) || 0;
    const gold = parseFloat(document.getElementById('zakat-gold')?.value) || 0;
    const silver = parseFloat(document.getElementById('zakat-silver')?.value) || 0;
    const business = parseFloat(document.getElementById('zakat-business')?.value) || 0;
    const liabilities = parseFloat(document.getElementById('zakat-liabilities')?.value) || 0;

    const totalAssets = cash + gold + silver + business;
    const netZakatable = Math.max(0, totalAssets - liabilities);

    const isPKR = (typeof DonationState !== 'undefined' ? DonationState.currency : 'PKR') === 'PKR';
    const nisabThreshold = isPKR ? ZakatConfig.silverNisabPKR : ZakatConfig.silverNisabUSD;

    let zakatDue = 0;
    if (netZakatable >= nisabThreshold) {
      zakatDue = Math.round(netZakatable * ZakatConfig.zakatRate);
    }

    if (zakatResultEl) {
      zakatResultEl.textContent = formatMoney ? formatMoney(zakatDue) : `₨ ${zakatDue.toLocaleString()}`;
    }

    if (zakatDonateBtn) {
      zakatDonateBtn.disabled = zakatDue <= 0;
      zakatDonateBtn.dataset.amount = zakatDue;
    }
  }

  calcInputs.forEach(input => {
    input.addEventListener('input', calculateZakat);
  });

  if (zakatDonateBtn) {
    zakatDonateBtn.addEventListener('click', () => {
      const amount = parseFloat(zakatDonateBtn.dataset.amount) || 0;
      if (amount > 0 && typeof openDonationModal === 'function') {
        openDonationModal({
          amount: amount,
          frequency: 'zakat',
          cause: '100% Zakat Fund (Sindh Rural Relief)'
        });
      }
    });
  }

  // Calculate initial default
  calculateZakat();
}
