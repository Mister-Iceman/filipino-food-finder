-- ============================================================
-- Seed: Search Tags (slugs for dish_tags, grocery_tags, universal_tags)
-- Run AFTER the migration (20260226_search_tags.sql)
-- ============================================================

-- ============================================================
-- 1. Add slugs to existing dish_tags
-- ============================================================
UPDATE dish_tags SET slug = 'adobo'       WHERE name LIKE 'Adobo%';
UPDATE dish_tags SET slug = 'lumpia'      WHERE name LIKE 'Lumpia%';
UPDATE dish_tags SET slug = 'sinigang'    WHERE name LIKE 'Sinigang%';
UPDATE dish_tags SET slug = 'sisig'       WHERE name = 'Sisig';
UPDATE dish_tags SET slug = 'pancit'      WHERE name LIKE 'Pancit%';
UPDATE dish_tags SET slug = 'lechon'      WHERE name LIKE 'Lechon%';
UPDATE dish_tags SET slug = 'kare-kare'   WHERE name LIKE 'Kare-Kare%';
UPDATE dish_tags SET slug = 'inihaw'      WHERE name LIKE 'Inihaw%';
UPDATE dish_tags SET slug = 'silog'       WHERE name LIKE 'Silog%';
UPDATE dish_tags SET slug = 'inasal'      WHERE name LIKE 'Chicken Inasal%';
UPDATE dish_tags SET slug = 'crispy-pata' WHERE name LIKE 'Crispy Pata%';
UPDATE dish_tags SET slug = 'bulalo'      WHERE name LIKE 'Bulalo%';
UPDATE dish_tags SET slug = 'caldereta'   WHERE name LIKE 'Caldereta%';
UPDATE dish_tags SET slug = 'kamayan'     WHERE name LIKE 'Kamayan%';
UPDATE dish_tags SET slug = 'halo-halo'   WHERE name LIKE 'Halo-Halo%';
UPDATE dish_tags SET slug = 'ube'         WHERE name LIKE 'Ube%';

-- ============================================================
-- 2. Grocery product category tags (10 items)
--    Shown on Supermarket & Grocery listings only
-- ============================================================
INSERT INTO grocery_tags (name, slug, emoji, display_order) VALUES
  ('Fresh Produce',           'fresh-produce',  '🥬', 1),
  ('Filipino Meats',          'filipino-meats',  '🥩', 2),
  ('Frozen Goods',            'frozen-goods',    '🧊', 3),
  ('Pantry Staples',          'pantry-staples',  '🫙', 4),
  ('Baked Goods',             'baked-goods',     '🥐', 5),
  ('Beverages',               'beverages',       '🧃', 6),
  ('Rice Varieties',          'rice',            '🍚', 7),
  ('Filipino Snacks',         'snacks',          '🍿', 8),
  ('Ready-to-Cook Foods',     'ready-to-cook',   '🍱', 9),
  ('Condiments & Sauces',     'condiments',      '🌶️',  10)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- 3. Universal tags (8 items)
--    Shown for all business types
-- ============================================================
INSERT INTO universal_tags (name, slug, emoji, display_order) VALUES
  ('Dine-In Available',           'dine-in',         '🪑', 1),
  ('Takeout Available',           'takeout',          '🥡', 2),
  ('Delivery Available',          'delivery',         '🚗', 3),
  ('Catering Available',          'catering',         '🎉', 4),
  ('Open Late / 24 Hours',        'open-late',        '🌙', 5),
  ('Halal Options',               'halal',            '🌙', 6),
  ('Vegetarian / Vegan Options',  'vegetarian',       '🌿', 7),
  ('Online Ordering',             'online-ordering',  '📱', 8)
ON CONFLICT (slug) DO NOTHING;
