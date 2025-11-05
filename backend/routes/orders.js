const express = require('express');
const db = require('../sqlite');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, (req,res)=>{
  const { items, paymentMethod } = req.body; // items: [{id, qty}]
  if(!Array.isArray(items) || items.length===0) return res.status(400).json({ error: 'Empty cart' });

  // fetch product prices
  const ids = items.map(it => it.id);
  const placeholders = ids.map(()=>'?').join(',');
  db.all(`SELECT id, price FROM products WHERE id IN (${placeholders})`, ids, (err, rows)=>{
    if(!rows || rows.length===0) return res.status(400).json({ error: 'Invalid items' });
    const map = Object.fromEntries(rows.map(r => [r.id, r.price]));
    let total = 0;
    for(const it of items){
      if(!map[it.id]) return res.status(400).json({ error: 'Invalid product ' + it.id });
      total += map[it.id] * (it.qty || 1);
    }
    db.run('INSERT INTO orders(userId,total,status,paymentMethod) VALUES(?,?,?,?)',
      [req.user.id, total, 'created', paymentMethod||'COD'], function(err){
        if(err) return res.status(400).json({ error: 'Order create failed' });
        const orderId = this.lastID;
        const stmt = db.prepare('INSERT INTO order_items(orderId,productId,qty,price) VALUES(?,?,?,?)');
        for(const it of items){ stmt.run(orderId, it.id, it.qty||1, map[it.id]); }
        stmt.finalize();
        res.json({ id: orderId, total });
      });
  });
});

router.get('/me', auth, (req,res)=>{
  db.all('SELECT * FROM orders WHERE userId=? ORDER BY id DESC', [req.user.id], (err, rows)=>{
    res.json(rows||[]);
  });
});

module.exports = router;
