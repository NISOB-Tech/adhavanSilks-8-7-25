import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import apicache from 'apicache';
import { Pool } from 'pg';
import { fileURLToPath } from 'url';

dotenv.config(); // Load env variables

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const cache = apicache.middleware;

app.use(cors());
app.use(bodyParser.json());

// ✅ PostgreSQL Pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// ✅ Uploads Setup
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });
app.use('/uploads', express.static(uploadDir));

// ✅ Admin Login + Email Alert
const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;
const failedAttempts = {};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ALERT_EMAIL,
    pass: process.env.ALERT_EMAIL_PASSWORD
  }
});

function sendSecurityAlert(username) {
  const mailOptions = {
    from: process.env.ALERT_EMAIL,
    to: process.env.SECURITY_TEAM_EMAIL,
    subject: '⚠️ Security Alert: Multiple failed logins',
    text: `There have been more than 3 failed login attempts for username: ${username}`
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.error('❌ Email error:', err);
    else console.log('📧 Alert sent:', info.response);
  });
}

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (!failedAttempts[username]) failedAttempts[username] = { count: 0 };

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    failedAttempts[username].count = 0;
    return res.json({ success: true, message: 'Login successful' });
  } else {
    failedAttempts[username].count++;
    if (failedAttempts[username].count > 3) sendSecurityAlert(username);
    return res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
});

// ✅ Twilio WhatsApp Config
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM;
const whatsappTo = process.env.TWILIO_WHATSAPP_TO;
const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

function sendWhatsAppNotification(saree) {
  if (!client || !whatsappFrom || !whatsappTo) return;
  const message = `🛍 New Saree Added: ${saree.name}\n💰 Price: ₹${saree.price}\n📂 Category: ${saree.category || 'N/A'}`;
  client.messages
    .create({ from: whatsappFrom, to: whatsappTo, body: message })
    .then(msg => console.log('WhatsApp sent:', msg.sid))
    .catch(console.error);
}

// ✅ Saree APIs
app.get('/api/sarees/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*, STRING_AGG(sc.color, ',') AS colors, STRING_AGG(si.image_path, ',') AS images
      FROM sarees s
      LEFT JOIN saree_colors sc ON s.product_id = sc.saree_id
      LEFT JOIN saree_images si ON s.product_id = si.saree_id
      WHERE s.product_id = $1 GROUP BY s.product_id`, [req.params.id]);

    const saree = result.rows[0];
    if (!saree) return res.status(404).json({ error: 'Saree not found' });
    saree.colors = saree.colors ? saree.colors.split(',') : [];
    saree.images = saree.images ? saree.images.split(',') : [];
    res.json(saree);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/sarees/:id/whatsapp-link', async (req, res) => {
  try {
    const result = await pool.query(`SELECT name, price, description FROM sarees WHERE product_id = $1`, [req.params.id]);
    const saree = result.rows[0];
    if (!saree) return res.status(404).json({ error: 'Saree not found' });

    const message = `Hi, I am interested in your product:\n\nSaree Name: ${saree.name}\nPrice: ₹${saree.price}\nDetails: ${saree.description}\nLink: https://yourdomain.com/saree/${req.params.id}`;
    const encoded = encodeURIComponent(message);
    res.json({ whatsappURL: `https://wa.me/919688484344?text=${encoded}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/sarees', cache('5 minutes'), async (req, res) => {
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
      SELECT s.*, STRING_AGG(sc.color, ',') AS colors, STRING_AGG(si.image_path, ',') AS images
      FROM sarees s
      LEFT JOIN saree_colors sc ON s.product_id = sc.saree_id
      LEFT JOIN saree_images si ON s.product_id = si.saree_id
      WHERE s.is_active = TRUE`;
    const params = [];
    let i = 1;

    if (filters.category) { query += ` AND s.category = $${i++}`; params.push(filters.category); }
    if (!isNaN(filters.minPrice)) { query += ` AND s.price >= $${i++}`; params.push(filters.minPrice); }
    if (!isNaN(filters.maxPrice)) { query += ` AND s.price <= $${i++}`; params.push(filters.maxPrice); }
    if (filters.color) { query += ` AND EXISTS (SELECT 1 FROM saree_colors WHERE saree_id = s.product_id AND color = $${i++})`; params.push(filters.color); }
    if (filters.search) { query += ` AND (s.name ILIKE $${i} OR s.description ILIKE $${i + 1})`; params.push(`%${filters.search}%`, `%${filters.search}%`); i += 2; }

    query += ` GROUP BY s.product_id ORDER BY s.product_id LIMIT $${i++} OFFSET $${i++}`;
    params.push(limit, (page - 1) * limit);

    const result = await pool.query(query, params);
    const sarees = result.rows.map(s => ({
      ...s,
      colors: s.colors ? s.colors.split(',') : [],
      images: s.images ? s.images.split(',') : [],
    }));
    res.json(sarees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/sarees', async (req, res) => {
  try {
    const s = req.body;
    await pool.query(`
      INSERT INTO sarees (product_id, name, price, description, category, material, is_active, date_added)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [s.product_id, s.name, s.price, s.description, s.category, s.material, s.is_active, s.date_added]);

    if (Array.isArray(s.colors)) {
      for (const color of s.colors) {
        await pool.query('INSERT INTO saree_colors (saree_id, color) VALUES ($1, $2)', [s.product_id, color]);
      }
    }
    if (Array.isArray(s.images)) {
      for (const img of s.images) {
        await pool.query('INSERT INTO saree_images (saree_id, image_path, is_primary) VALUES ($1, $2, $3)', [s.product_id, img.path, img.is_primary]);
      }
    }
    sendWhatsAppNotification(s);
    res.status(201).json({ message: 'Saree created successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Start Server and Confirm .env is loaded
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`👤 ADMIN_USER: ${ADMIN_USER}`);
  console.log(`🔒 ADMIN_PASS: ${ADMIN_PASS}`);
});

process.on('beforeExit', async () => {
  await pool.end();
  console.log('PostgreSQL pool closed.');
});