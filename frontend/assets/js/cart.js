function getCart(){ try{return JSON.parse(localStorage.getItem('cart')||'[]')}catch(e){return []} }
function saveCart(items){ localStorage.setItem('cart', JSON.stringify(items)); updateCartCount(); }
function updateCartCount(){
  const el = document.getElementById('cart-count');
  if(!el) return;
  const items = getCart();
  const total = items.reduce((a,b)=>a + (b.qty||1), 0);
  el.textContent = total;
}
function addToCart(id, qty=1){
  const items = getCart();
  const i = items.findIndex(x=>x.id===id);
  if(i>-1) items[i].qty += qty; else items.push({id, qty});
  saveCart(items);
  alert('Added to cart');
}
function removeFromCart(id){
  saveCart(getCart().filter(x=>x.id!==id));
}
function clearCart(){ saveCart([]); }
async function renderCartList(targetId){
  const wrap = document.getElementById(targetId);
  const items = getCart();
  if(items.length===0){ wrap.innerHTML='<p>Your cart is empty.</p>'; updateCartCount(); return; }
  // fetch product details
  const all = await fetch('/api/products'); const prods = await all.json();
  let total = 0;
  wrap.innerHTML = items.map(ci=>{
    const p = prods.find(pp=>pp.id===ci.id);
    if(!p) return '';
    const line = p.price * ci.qty;
    total += line;
    return `<div class="row"><div class="row" style="gap:.8rem">
      <img src="${p.image}" style="width:64px;height:64px;object-fit:cover;border-radius:8px">
      <div><strong>${p.name}</strong><br>₹${(p.price/100).toFixed(2)} × ${ci.qty}</div>
    </div>
    <div>₹${(line/100).toFixed(2)} <button class="btn-outline" onclick="removeFromCart('${p.id}'); renderCartList('${targetId}')">Remove</button></div></div>`;
  }).join('') + `<div class="row" style="justify-content:flex-end"><strong>Total: ₹${(total/100).toFixed(2)}</strong></div>`;
  updateCartCount();
}
updateCartCount();
