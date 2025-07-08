// server.js
const express = require('express');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');
const twilio = require('twilio');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const apicache = require('apicache');
require('dotenv').config();

const app = express();
const db = new Database('sarees.db');
const cache = apicache.middleware;
const PORT = process.env.PORT || 3001;

// Twilio WhatsApp Config
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM;
const whatsappTo = process.env.TWILIO_WHATSAPP_TO;
const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

// Middleware
app.use(bodyParser.json());

// Upload Directory
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) =>
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_')),
});
const upload = multer({ storage });

// Send WhatsApp Notification (Admin)
function sendWhatsAppNotification(saree) {
  if (!client || !whatsappFrom || !whatsappTo) {
    console.log('Twilio not configured. Skipping WhatsApp alert.');
    return;
  }

  const message = `🛍 New Saree Added: ${saree.name}\n💰 Price: ₹${saree.price}\n📂 Category: ${saree.category || 'N/A'}`;
  client.messages
    .create({ from: whatsappFrom, to: whatsappTo, body: message })
    .then(msg => console.log('WhatsApp sent:', msg.sid))
    .catch(console.error);
}

// Get Saree by ID
app.get('/api/sarees/:id', (req, res) => {
  try {
    const saree = db.prepare(`
      SELECT s.*, GROUP_CONCAT(sc.color) AS colors, GROUP_CONCAT(si.image_path) AS images
      FROM sarees s
      LEFT JOIN saree_colors sc ON s.id = sc.saree_id
      LEFT JOIN saree_images si ON s.id = si.saree_id
      WHERE s.id = ?
      GROUP BY s.id
    `).get(req.params.id);

    if (!saree) return res.status(404).json({ error: 'Saree not found' });

    saree.colors = saree.colors ? saree.colors.split(',') : [];
    saree.images = saree.images ? saree.images.split(',') : [];
    res.json(saree);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// WhatsApp Link Endpoint
app.get('/api/sarees/:id/whatsapp-link', (req, res) => {
  try {
    const saree = db.prepare(`SELECT name, price, description FROM sarees WHERE id = ?`).get(req.params.id);
    if (!saree) return res.status(404).json({ error: 'Saree not found' });

    const productLink = `https://yourdomain.com/saree/${req.params.id}`;
    const message = `Hi, I am interested in your product:\n\n` +
      `Saree Name: ${saree.name}\n` +
      `Price: ₹${saree.price}\n` +
      (saree.description ? `Details: ${saree.description}\n` : '') +
      `Product Link: ${productLink}\n\n` +
      `Please provide more info.`;

    const encoded = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/919688484344?text=${encoded}`;
    res.json({ whatsappURL });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Filtered Saree List
app.get('/api/sarees', cache('5 minutes'), (req, res) => {
  try {
    const filters = {
      category: req.query.category,
      minPrice: parseFloat(req.query.minPrice),
      maxPrice: parseFloat(req.query.maxPrice),
      color: req.query.color,
      search: req.query.search,
    };

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    let query = `
      SELECT s.*, GROUP_CONCAT(sc.color) AS colors, GROUP_CONCAT(si.image_path) AS images
      FROM sarees s
      LEFT JOIN saree_colors sc ON s.id = sc.saree_id
      LEFT JOIN saree_images si ON s.id = si.saree_id
      WHERE s.is_active = TRUE
    `;
    const params = [];

    if (filters.category) {
      query += ' AND s.category = ?';
      params.push(filters.category);
    }

    if (!isNaN(filters.minPrice)) {
      query += ' AND s.price >= ?';
      params.push(filters.minPrice);
    }

    if (!isNaN(filters.maxPrice)) {
      query += ' AND s.price <= ?';
      params.push(filters.maxPrice);
    }

    if (filters.color) {
      query += ` AND EXISTS (SELECT 1 FROM saree_colors WHERE saree_id = s.id AND color = ?)`;
      params.push(filters.color);
    }

    if (filters.search) {
      query += ' AND (s.name LIKE ? OR s.description LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    query += ' GROUP BY s.id LIMIT ? OFFSET ?';
    params.push(limit, (page - 1) * limit);

    const sarees = db.prepare(query).all(...params).map(s => ({
      ...s,
      colors: s.colors ? s.colors.split(',') : [],
      images: s.images ? s.images.split(',') : [],
    }));

    res.json(sarees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dummy Saree Create (simplified)
app.post('/api/sarees', (req, res) => {
  try {
    const s = req.body;

    db.prepare(`
      INSERT INTO sarees (id, name, price, description, category, materialType, is_active)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `).run(s.id, s.name, s.price, s.description, s.category, s.materialType);

    if (Array.isArray(s.colors)) {
      const stmt = db.prepare('INSERT INTO saree_colors (saree_id, color) VALUES (?, ?)');
      s.colors.forEach(color => stmt.run(s.id, color));
    }

    if (Array.isArray(s.images)) {
      const stmt = db.prepare('INSERT INTO saree_images (saree_id, image_path, is_primary) VALUES (?, ?, ?)');
      s.images.forEach(img => stmt.run(s.id, img.path, img.is_primary ? 1 : 0));
    }

    sendWhatsAppNotification(s);
    res.status(201).json({ message: 'Saree created successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Serve uploaded files
app.use('/uploads', express.static(uploadDir));

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
