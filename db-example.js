const { Pool } = require('pg'); // Use pg for PostgreSQL
const fs = require('fs');

// Database Connection for PostgreSQL (using environment variables)
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'adhavansilks_db',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Removed migration execution as schema is already applied in PostgreSQL
// const migration = fs.readFileSync('migrations/001_create_saree_tables.sql', 'utf8');
// db.exec(migration);

async function runExample() {
  try {
    // Insert a saree
    const saree = {
      product_id: 'ADSAR-2024-001',
      name: 'Kanchipuram Silk Saree',
      description: 'Pure silk with zari border...',
      category: 'Traditional',
      sub_category: 'Kanchipuram',
      price: 4299.00,
      discount_price: 3999.00,
      cost_price: 2500.00,
      stock_quantity: 15, // Changed to stock_quantity
      sku: 'KAN-RED-6Y',
      material: 'Pure Silk',
      weight_grams: 450,
      origin: 'Kanchipuram, TN',
      care_instructions: 'Dry clean only',
      is_featured: true, // Changed to boolean
      is_active: true, // Changed to boolean
      date_added: '2024-03-15',
      last_updated: '2024-03-20 10:00:00'
    };

    await pool.query(`
      INSERT INTO sarees (
        product_id, name, description, category, sub_category, price, discount_price, cost_price, stock_quantity, sku, material, weight_grams, origin, care_instructions, is_featured, is_active, date_added, last_updated
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
      )
      ON CONFLICT (product_id) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        category = EXCLUDED.category,
        sub_category = EXCLUDED.sub_category,
        price = EXCLUDED.price,
        discount_price = EXCLUDED.discount_price,
        cost_price = EXCLUDED.cost_price,
        stock_quantity = EXCLUDED.stock_quantity,
        sku = EXCLUDED.sku,
        material = EXCLUDED.material,
        weight_grams = EXCLUDED.weight_grams,
        origin = EXCLUDED.origin,
        care_instructions = EXCLUDED.care_instructions,
        is_featured = EXCLUDED.is_featured,
        is_active = EXCLUDED.is_active,
        date_added = EXCLUDED.date_added,
        last_updated = EXCLUDED.last_updated
    `, [
      saree.product_id, saree.name, saree.description, saree.category, saree.sub_category, saree.price, saree.discount_price, saree.cost_price, saree.stock_quantity, saree.sku, saree.material, saree.weight_grams, saree.origin, saree.care_instructions, saree.is_featured, saree.is_active, saree.date_added, saree.last_updated
    ]);

    console.log('Saree inserted/updated successfully.');

    // Insert colors
    const colors = ['Red', 'Gold'];
    for (const color of colors) {
      await pool.query(`INSERT INTO saree_colors (saree_id, color) VALUES ($1, $2)`, [saree.product_id, color]);
    }
    console.log('Colors inserted successfully.');

    // Insert images
    const images = [
      { path: 'sarees/kanchi-red-1.jpg', is_primary: true }, // Changed to boolean
      { path: 'sarees/kanchi-red-2.jpg', is_primary: false } // Changed to boolean
    ];
    for (const img of images) {
      await pool.query(`INSERT INTO saree_images (saree_id, image_path, is_primary) VALUES ($1, $2, $3)`, [saree.product_id, img.path, img.is_primary]);
    }
    console.log('Images inserted successfully.');

    // Query sarees
    const sareesResult = await pool.query('SELECT * FROM sarees');
    console.log('Sarees:', sareesResult.rows);

    const sareeColorsResult = await pool.query('SELECT * FROM saree_colors WHERE saree_id = $1', [saree.product_id]);
    console.log('Colors:', sareeColorsResult.rows);

    const sareeImagesResult = await pool.query('SELECT * FROM saree_images WHERE saree_id = $1', [saree.product_id]);
    console.log('Images:', sareeImagesResult.rows);

  } catch (err) {
    console.error('Database operation failed:', err);
  } finally {
    await pool.end(); // Close the pool after example runs
  }
}

runExample(); 