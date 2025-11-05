const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../sqlite');
const router = express.Router();

router.post('/register', (req,res)=>{
  const { name, email, password } = req.body;
  if(!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  const hash = bcrypt.hashSync(password, 10);
  const stmt = 'INSERT INTO users(name,email,passwordHash) VALUES(?,?,?)';
  db.run(stmt, [name, email, hash], function(err){
    if(err) return res.status(400).json({ error: 'Email already exists' });
    return res.json({ ok: true, id: this.lastID });
  });
});

router.post('/login', (req,res)=>{
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email=?', [email], (err, user)=>{
    if(!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = bcrypt.compareSync(password, user.passwordHash);
    if(!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, role: user.role });
  });
});

module.exports = router;
