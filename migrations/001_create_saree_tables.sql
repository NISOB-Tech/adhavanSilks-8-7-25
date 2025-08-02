CREATE TABLE IF NOT EXISTS sarees (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    sub_category VARCHAR(50),
    price DECIMAL(10,2) NOT NULL,
    discount_price DECIMAL(10,2),
    cost_price DECIMAL(10,2),
    stock INTEGER NOT NULL DEFAULT 0,
    sku VARCHAR(50),
    material VARCHAR(50),
    weight_grams INTEGER,
    origin VARCHAR(100),
    care_instructions TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    date_added DATE,
    last_updated TIMESTAMP
);

CREATE TABLE IF NOT EXISTS saree_colors (
    id SERIAL PRIMARY KEY,
    saree_id VARCHAR(20),
    color VARCHAR(50),
    FOREIGN KEY (saree_id) REFERENCES sarees(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS saree_images (
    id SERIAL PRIMARY KEY,
    saree_id VARCHAR(20),
    image_path VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (saree_id) REFERENCES sarees(id) ON DELETE CASCADE
);
