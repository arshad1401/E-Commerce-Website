const express = require('express');
const db = require('../sqlite');
const { auth } = require('../middleware/auth');
const Stripe = require('stripe');
const router = express.Router();

router.post('/create-checkout-session', auth, async (req,res)=>{
  if(!process.env.STRIPE_SECRET_KEY) return res.status(400).json({ error: 'Stripe not configured' });
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const { items, successUrl, cancelUrl } = req.body;
  if(!Array.isArray(items) || items.length===0) return res.status(400).json({ error: 'Empty cart' });

  const ids = items.map(it => it.id);
  const placeholders = ids.map(()=>'?').join(',');
  db.all(`SELECT id, name, price FROM products WHERE id IN (${placeholders})`, ids, async (err, rows)=>{
    if(!rows || rows.length===0) return res.status(400).json({ error: 'Invalid items' });
    const byId = Object.fromEntries(rows.map(r=>[r.id, r]));
    const line_items = items.map(it => ({
      price_data: {
        currency: 'inr',
        product_data: { name: byId[it.id].name },
        unit_amount: byId[it.id].price
      },
      quantity: it.qty || 1
    }));
    try{
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items,
        success_url: successUrl || 'http://localhost:3000/',
        cancel_url: cancelUrl || 'http://localhost:3000/checkout.html'
      });
      res.json({ url: session.url });
    }catch(e){
      res.status(400).json({ error: e.message });
    }
  });
});

module.exports = router;
