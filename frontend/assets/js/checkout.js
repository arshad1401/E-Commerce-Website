(async function(){
  renderCartList('order-summary');

  document.getElementById('payCOD').onclick = async () => {
    const cart = getCart();
    if(cart.length===0){ alert('Cart empty'); return; }
    const out = await apiAuthed('POST','/api/orders',{items:cart, paymentMethod:'COD'});
    if(out.ok || out.id){ clearCart(); document.getElementById('msg').textContent = 'Order placed (COD).'; }
    else document.getElementById('msg').textContent = out.error || 'Order failed';
  };

  document.getElementById('payStripe').onclick = async () => {
    const cart = getCart();
    if(cart.length===0){ alert('Cart empty'); return; }
    const successUrl = location.origin + '/cart.html';
    const cancelUrl = location.href;
    const sess = await apiAuthed('POST','/api/payments/create-checkout-session',{items:cart, successUrl, cancelUrl});
    if(sess && sess.url){ location.href = sess.url; }
    else alert(sess.error || 'Stripe init failed');
  };
})();