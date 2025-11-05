const express = require('express');
const db = require('../sqlite');
const { auth, admin } = require('../middleware/auth');
const router = express.Router();

router.get('/', (req,res)=>{
  db.all('SELECT id, name, price, image, description FROM products ORDER BY id DESC', [], (err, rows)=>{
    res.json(rows || []);
  });
});

router.get('/:id', (req,res)=>{
  db.get('SELECT id, name, price, image, description FROM products WHERE id=?', [req.params.id], (err, row)=>{
    if(!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  });
});

router.post('/', auth, admin, (req,res)=>{
  const { name, price, image, description } = req.body;
  if(!name || !price || !image) return res.status(400).json({ error: 'Missing fields' });
  db.run('INSERT INTO products(name,price,image,description) VALUES(?,?,?,?)', [name, price, image, description||''], function(err){
    if(err) return res.status(400).json({ error: 'Insert failed' });
    res.json({ ok: true, id: this.lastID });
  });
});

router.put('/:id', auth, admin, (req,res)=>{
  const { name, price, image, description } = req.body;
  db.run('UPDATE products SET name=?, price=?, image=?, description=? WHERE id=?',
    [name, price, image, description, req.params.id],
    function(err){ if(err) return res.status(400).json({ error: 'Update failed' }); res.json({ ok:true }); });
});

router.delete('/:id', auth, admin, (req,res)=>{
  db.run('DELETE FROM products WHERE id=?', [req.params.id], function(err){
    if(err) return res.status(400).json({ error: 'Delete failed' });
    res.json({ ok:true });
  });
});

module.exports = router;
