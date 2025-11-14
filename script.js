const MIN = 800;
const FEE_RATE = 0.005;
const PAYPAL_URL = "https://www.paypal.com/ncp/payment/RJZE2WPXDYWRJ";

function showStep(n){
  document.querySelectorAll('.step').forEach(x=>x.classList.remove('active'));
  document.getElementById('step'+n).classList.add('active');
}

function parseAmt(v){
  return parseFloat(v.replace(/[^0-9.]/g,'')) || 0;
}

document.getElementById('toStep2').onclick = ()=>{
  let amt = parseAmt(amount.value);
  if(amt < MIN){ alert("₱800 minimum."); return; }
  showStep(2);
};

document.getElementById('back1').onclick = ()=>showStep(1);

document.getElementById('toStep3').onclick = ()=>{
  if(!fullname.value.trim() || !gcash.value.trim()){alert("Complete your details.");return;}
  let amt = parseAmt(amount.value),
      fee = amt*FEE_RATE,
      net = amt-fee;

  revAmount.textContent = "₱"+amt.toFixed(2);
  revFee.textContent = "₱"+fee.toFixed(2);
  revNet.textContent = "₱"+net.toFixed(2);
  revName.textContent = fullname.value;
  revNumber.textContent = gcash.value;

  directPay.href = PAYPAL_URL+"?amount="+amt.toFixed(2);
  showStep(3);
};

document.getElementById('back2').onclick = ()=>showStep(2);

document.getElementById('toStep4').onclick = ()=>showStep(4);
