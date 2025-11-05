const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '.env') });
const app = express();
const db = require('./sqlite'); // initialize db
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');
const { auth } = require('./middleware/auth');

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// Serve frontend as static
const frontendDir = path.join(__dirname, '../frontend');
app.use(express.static(frontendDir));
app.get('*', (req, res) => {
  // fallback to index for simple static routes; serve actual files if exist
  const filePath = path.join(frontendDir, req.path);
  if (req.path === '/' || !require('fs').existsSync(filePath)) {
    res.sendFile(path.join(frontendDir, 'index.html'));
  } else {
    res.sendFile(filePath);
  }
});

app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
