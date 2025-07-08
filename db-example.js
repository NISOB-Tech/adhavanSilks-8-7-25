const Database = require('better-sqlite3');
const fs = require('fs');

const db = new Database('sarees.db');

// Run migration (once)
const migration = fs.readFileSync('migrations/001_create_saree_tables.sql', 'utf8');
db.exec(migration);

// Insert a saree
const saree = {
  id: 'ADSAR-2024-001',
  name: 'Kanchipuram Silk Saree',
  description: 'Pure silk with zari border...',
  category: 'Traditional',
  sub_category: 'Kanchipuram',
  price: 4299.00,
  discount_price: 3999.00,
  cost_price: 2500.00,
  stock: 15,
  sku: 'KAN-RED-6Y',
  material: 'Pure Silk',
  weight_grams: 450,
  origin: 'Kanchipuram, TN',
  care_instructions: 'Dry clean only',
  is_featured: 1,
  is_active: 1,
  date_added: '2024-03-15',
  last_updated: '2024-03-20 10:00:00'
};

db.prepare(`
  INSERT OR REPLACE INTO sarees (
    id, name, description, category, sub_category, price, discount_price, cost_price, stock, sku, material, weight_grams, origin, care_instructions, is_featured, is_active, date_added, last_updated
  ) VALUES (
    @id, @name, @description, @category, @sub_category, @price, @discount_price, @cost_price, @stock, @sku, @material, @weight_grams, @origin, @care_instructions, @is_featured, @is_active, @date_added, @last_updated
  )
`).run(saree);

// Insert colors
const colors = ['Red', 'Gold'];
for (const color of colors) {
  db.prepare(`INSERT INTO saree_colors (saree_id, color) VALUES (?, ?)`)
    .run(saree.id, color);
}

// Insert images
const images = [
  { path: 'sarees/kanchi-red-1.jpg', is_primary: 1 },
  { path: 'sarees/kanchi-red-2.jpg', is_primary: 0 }
];
for (const img of images) {
  db.prepare(`INSERT INTO saree_images (saree_id, image_path, is_primary) VALUES (?, ?, ?)`)
    .run(saree.id, img.path, img.is_primary);
}

// Query sarees
const sarees = db.prepare('SELECT * FROM sarees').all();
console.log('Sarees:', sarees);

const sareeColors = db.prepare('SELECT * FROM saree_colors WHERE saree_id = ?').all(saree.id);
console.log('Colors:', sareeColors);

const sareeImages = db.prepare('SELECT * FROM saree_images WHERE saree_id = ?').all(saree.id);
console.log('Images:', sareeImages); 