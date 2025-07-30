// server.js
import express from 'express';
import bodyParser from 'body-parser';
import { Pool } from 'pg'; // Use pg for PostgreSQL
import twilio from 'twilio'; 
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import apicache from 'apicache';
import dotenv from 'dotenv'; // Import dotenv
import { fileURLToPath } from 'url'; // Import fileURLToPath
dotenv.config(); // Call config after import

const __filename = fileURLToPath(import.meta.url); // Correct way to get __filename
const __dirname = path.dirname(__filename); // Correctly derive __dirname

const app = express();
// const db = new Database('sarees.db'); // Removed SQLite database connection
const cache = apicache.middleware;
const PORT = process.env.PORT || 3001;

// Database Connection for PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'adhavansilks_db',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

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
app.get('/api/sarees/:id', async (req, res) => {
  try {
    // Replaced GROUP_CONCAT with STRING_AGG and ? with $1
    const result = await pool.query(`
      SELECT
        s.*,
        STRING_AGG(sc.color, ',') AS colors,
        STRING_AGG(si.image_path, ',') AS images
      FROM sarees s
      LEFT JOIN saree_colors sc ON s.product_id = sc.saree_id
      LEFT JOIN saree_images si ON s.product_id = si.saree_id
      WHERE s.product_id = $1
      GROUP BY s.product_id
    `, [req.params.id]); // Changed to use array for parameters

    const saree = result.rows[0];

    if (!saree) return res.status(404).json({ error: 'Saree not found' });

    // Colors and images are already strings from STRING_AGG, split them
    saree.colors = saree.colors ? saree.colors.split(',') : [];
    saree.images = saree.images ? saree.images.split(',') : [];
    res.json(saree);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// WhatsApp Link Endpoint
app.get('/api/sarees/:id/whatsapp-link', async (req, res) => {
  try {
    const result = await pool.query(`SELECT name, price, description FROM sarees WHERE product_id = $1`, [req.params.id]);
    const saree = result.rows[0];
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
      SELECT
        s.*,
        STRING_AGG(sc.color, ',') AS colors,
        STRING_AGG(si.image_path, ',') AS images
      FROM sarees s
      LEFT JOIN saree_colors sc ON s.product_id = sc.saree_id
      LEFT JOIN saree_images si ON s.product_id = si.saree_id
      WHERE s.is_active = TRUE
    `;
    const params = [];
    let paramIndex = 1;

    if (filters.category) {
      query += ` AND s.category = $${paramIndex++}`;
      params.push(filters.category);
    }

    if (!isNaN(filters.minPrice)) {
      query += ` AND s.price >= $${paramIndex++}`;
      params.push(filters.minPrice);
    }

    if (!isNaN(filters.maxPrice)) {
      query += ` AND s.price <= $${paramIndex++}`;
      params.push(filters.maxPrice);
    }

    if (filters.color) {
      query += ` AND EXISTS (SELECT 1 FROM saree_colors WHERE saree_id = s.product_id AND color = $${paramIndex++})`;
      params.push(filters.color);
    }

    if (filters.search) {
      query += ` AND (s.name ILIKE $${paramIndex++} OR s.description ILIKE $${paramIndex++})`; // ILIKE for case-insensitive search in PostgreSQL
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    query += ` GROUP BY s.product_id ORDER BY s.product_id LIMIT $${paramIndex++} OFFSET $${paramIndex++}`; // Added ORDER BY for consistent LIMIT/OFFSET behavior
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

// Dummy Saree Create (simplified)
app.post('/api/sarees', async (req, res) => {
  try {
    const s = req.body;
    // Changed id to product_id
    await pool.query(`
      INSERT INTO sarees (product_id, name, price, description, category, material, is_active, date_added)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [s.product_id, s.name, s.price, s.description, s.category, s.material, s.is_active, s.date_added]); // Use product_id

    if (Array.isArray(s.colors)) {
      for (const color of s.colors) {
        await pool.query('INSERT INTO saree_colors (saree_id, color) VALUES ($1, $2)', [s.product_id, color]);
      }
    }

    if (Array.isArray(s.images)) {
      for (const img of s.images) {
        await pool.query('INSERT INTO saree_images (saree_id, image_path, is_primary) VALUES ($1, $2, $3)', [s.product_id, img.path, img.is_primary]); // is_primary directly
      }
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

// Close the PostgreSQL pool when the application exits
// process.on('beforeExit', async () => {
//   await pool.end();
//   console.log('PostgreSQL pool closed.');
// });