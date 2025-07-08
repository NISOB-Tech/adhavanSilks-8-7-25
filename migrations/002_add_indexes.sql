CREATE INDEX IF NOT EXISTS idx_saree_category ON sarees(category);
CREATE INDEX IF NOT EXISTS idx_saree_price ON sarees(price);
CREATE INDEX IF NOT EXISTS idx_saree_active ON sarees(is_active); 