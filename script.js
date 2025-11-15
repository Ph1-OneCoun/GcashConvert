// Frontend validation and behavior
const paypalLinkBase = "https://www.paypal.com/ncp/payment/RJZE2WPXDYWRJ";

const form = document.getElementById('convertForm');
const fullnameEl = document.getElementById('fullname');
const gcashEl = document.getElementById('gcash');
const amountEl = document.getElementById('amount');
const feeEl = document.getElementById('fee');
const receiveEl = document.getElementById('receive');
const calculateBtn = document.getElementById('calculateBtn');
const convertBtn = document.getElementById('convertBtn');

const modal = document.getElementById('confirmModal');
const summary = document.getElementById('summary');
const cancelModal = document.getElementById('cancelModal');
const proceedModal = document.getElementById('proceedModal');

function formatPHP(n){
  return '₱' + Number(n).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});
}

function parseAmount(){
  const v = Number(amountEl.value);
  if (Number.isNaN(v)) return 0;
  return v;
}

function compute(){
  const amt = parseAmount();
  if (amt <= 0) {
    feeEl.textContent = '₱0.00';
    receiveEl.textContent = '₱0.00';
    return;
  }
  const fee = Math.round(amt * 0.005 * 100) / 100; // 0.5%
  const receive = Math.round((amt - fee) * 100) / 100;
  feeEl.textContent = formatPHP(fee);
  receiveEl.textContent = formatPHP(receive);
  return {fee, receive};
}

calculateBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const result = compute();
  if (!result) return;
  calculateBtn.textContent = 'Calculated ✓';
  setTimeout(()=> calculateBtn.textContent = 'Calculate', 1200);
});

// GCash number validation: accept 09XXXXXXXXX or +639XXXXXXXXX or 639XXXXXXXXX
function isValidGcashNumber(s){
  if (!s) return false;
  const cleaned = s.trim();
  return /^(09\\d{9}|\\+639\\d{9}|639\\d{9})$/.test(cleaned);
}

function showError(input, message){
  input.focus();
  alert(message);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = fullnameEl.value.trim();
  const gcash = gcashEl.value.trim();
  const amt = parseAmount();

  if (name.length < 3) return showError(fullnameEl, 'Please enter your full name (at least 3 characters).');
  if (!isValidGcashNumber(gcash)) return showError(gcashEl, 'Please enter a valid GCash number. Examples: 09XXXXXXXXX or +639XXXXXXXXX');
  if (Number.isNaN(amt) || amt < 800 || amt > 15000) return showError(amountEl, 'Please enter an amount between ₱800 and ₱15,000.');

  const {fee, receive} = compute() || {};

  summary.innerHTML = `
    <strong>Name:</strong> ${escapeHtml(name)}<br>
    <strong>GCash #:</strong> ${escapeHtml(gcash)}<br>
    <strong>Amount:</strong> ${formatPHP(amt)}<br>
    <strong>Fee (0.5%):</strong> ${formatPHP(fee)}<br>
    <strong>You receive:</strong> ${formatPHP(receive)}
  `;

  modal.classList.remove('hidden');
});

// Modal buttons
cancelModal.addEventListener('click', () => modal.classList.add('hidden'));

proceedModal.addEventListener('click', () => {
  const name = encodeURIComponent(fullnameEl.value.trim());
  const gcash = encodeURIComponent(gcashEl.value.trim());
  const amt = encodeURIComponent(Number(amountEl.value).toFixed(2));
  
  const url = paypalLinkBase + `?amount=${amt}&name=${name}&gcash=${gcash}`;
  window.open(url, '_blank', 'noopener');
  modal.classList.add('hidden');
});

// Escape HTML to avoid accidental injection
function escapeHtml(str){
  return String(str).replace(/[&<>"'`]/g, (s) => ({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'":'&#39;',
    '`':'&#96;'
  })[s]);
}

// Update computation on input change
amountEl.addEventListener('input', compute);

compute(); // initial
