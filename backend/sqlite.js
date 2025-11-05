const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const dbPath = path.join(__dirname, 'data.sqlite');

if (!fs.existsSync(dbPath)) {
  console.log('Initializing SQLite database...');
}

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    passwordHash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user'
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS products(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price INTEGER NOT NULL, -- in paise
    image TEXT NOT NULL,
    description TEXT
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS orders(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    total INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'created',
    paymentMethod TEXT,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY(userId) REFERENCES users(id)
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS order_items(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId INTEGER NOT NULL,
    productId INTEGER NOT NULL,
    qty INTEGER NOT NULL,
    price INTEGER NOT NULL,
    FOREIGN KEY(orderId) REFERENCES orders(id),
    FOREIGN KEY(productId) REFERENCES products(id)
  );`);

  // Seed a default admin and a few products if empty
  db.get('SELECT COUNT(*) as c FROM users', (err, row) => {
    if (row && row.c === 0) {
      const bcrypt = require('bcryptjs');
      const hash = bcrypt.hashSync('admin123', 10);
      db.run('INSERT INTO users(name,email,passwordHash,role) VALUES(?,?,?,?)',
        ['Admin', 'admin@eshop.test', hash, 'admin']);
      console.log('Seeded admin: admin@eshop.test / admin123');
    }
  });

  db.get('SELECT COUNT(*) as c FROM products', (err, row) => {
    if (row && row.c === 0) {
      const demo = [
        ['Wireless Headphones', 499900, 'https://images.unsplash.com/photo-1518444081562-9caed2ddeac4?q=80&w=1200&auto=format&fit=crop', 'Noise-cancelling over‑ear headphones.'],
        ['Smart Watch', 299900, 'https://images.unsplash.com/photo-1518442298260-66f4d76ecef0?q=80&w=1200&auto=format&fit=crop', 'Fitness tracking and notifications.'],
        ['Gaming Mouse', 159900, 'https://images.unsplash.com/photo-1549921296-3b4a6b13d4d5?q=80&w=1200&auto=format&fit=crop', 'Ergonomic RGB gaming mouse.']
      ];
      for (const p of demo){
        db.run('INSERT INTO products(name,price,image,description) VALUES(?,?,?,?)', p);
      }
      console.log('Seeded demo products.');
    }
  });
});

module.exports = db;
