(async function(){
  const res = await fetch('/api/products');
  const products = await res.json();
  const wrap = document.getElementById('products');
  wrap.innerHTML = products.map(p => `
    <div class="card product-card">
      <img src="${p.image}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <div class="row" style="justify-content:space-between">
        <span class="price">₹${(p.price/100).toFixed(2)}</span>
        <a class="btn" href="/product.html?id=${p.id}">View</a>
      </div>
    </div>
  `).join('');
})();