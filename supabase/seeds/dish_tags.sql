-- ============================================================
-- Seed: 16 Filipino Dish Tags
-- Run AFTER the migration (20260226_dish_tags.sql)
-- ============================================================

INSERT INTO dish_tags (name, category, display_order) VALUES
  -- SAVORY (1–14)
  ('Adobo (Chicken / Pork)',                  'savory',  1),
  ('Lumpia (Shanghai / Fresh)',                'savory',  2),
  ('Sinigang (Pork / Shrimp / Fish)',          'savory',  3),
  ('Sisig',                                    'savory',  4),
  ('Pancit (Bihon / Canton / Palabok)',        'savory',  5),
  ('Lechon / Lechon Kawali',                   'savory',  6),
  ('Kare-Kare',                                'savory',  7),
  ('Inihaw / Filipino BBQ (Skewers / Liempo)', 'savory',  8),
  ('Silog Plates (Tapsilog / Tocilog / Longsilog)', 'savory', 9),
  ('Chicken Inasal',                           'savory', 10),
  ('Crispy Pata',                              'savory', 11),
  ('Bulalo',                                   'savory', 12),
  ('Caldereta / Afritada / Mechado',           'savory', 13),
  ('Kamayan / Boodle Fight',                   'savory', 14),
  -- DESSERTS (15–16)
  ('Halo-Halo',                                'dessert', 15),
  ('Ube Desserts (Halaya / Ice Cream / Cake / Latte)', 'dessert', 16);
