// Basic client-side validation + calculation for tax (0.5%) and received amount
(function(){
  const amountInput = document.getElementById('amount');
  const taxEl = document.getElementById('tax');
  const receiveEl = document.getElementById('receive');
  const convertBtn = document.getElementById('convertBtn');
  const payLink = document.getElementById('payLink');

  const MIN = 800;
  const TAX_RATE = 0.005; // 0.5%

  function fmt(n){
    return '₱' + Number(n).toLocaleString('en-PH', {minimumFractionDigits:2, maximumFractionDigits:2});
  }

  function updateCalc(){
    const val = parseFloat(amountInput.value);
    if (isNaN(val) || val <= 0){
      taxEl.textContent = '₱0.00';
      receiveEl.textContent = '₱0.00';
      return;
    }
    const tax = Math.round(val * TAX_RATE * 100) / 100;
    const receive = Math.round((val - tax) * 100) / 100;
    taxEl.textContent = fmt(tax);
    receiveEl.textContent = fmt(receive);
  }

  amountInput.addEventListener('input', updateCalc);

  convertBtn.addEventListener('click', function(e){
    const val = parseFloat(amountInput.value);
    if (isNaN(val)){
      alert('Please enter an amount to convert (minimum ₱800).');
      amountInput.focus();
      return;
    }
    if (val < MIN){
      alert('Minimum conversion amount is ₱' + MIN + '. Please enter a larger amount.');
      amountInput.focus();
      return;
    }

    // Optionally show confirmation with calculated amounts
    const tax = Math.round(val * TAX_RATE * 100) / 100;
    const receive = Math.round((val - tax) * 100) / 100;
    const confirmMsg = 'You will be charged ₱' + val.toFixed(2) + '\nTax (0.5%): ₱' + tax.toFixed(2) + '\nAmount you will receive: ₱' + receive.toFixed(2) + '\n\nProceed to PayPal to complete payment?';
    if (!confirm(confirmMsg)) return;

    // Open PayPal payment page (user provided link)
    const payUrl = 'https://www.paypal.com/ncp/payment/RJZE2WPXDYWRJ';
    // Open in new tab; some browsers block window.open from non-user gestures, but click is a user gesture.
    window.open(payUrl, '_blank', 'noopener');
  });

  // initial update
  updateCalc();
})();
