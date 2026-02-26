-- ============================================================
-- Migration: Dish Tags for Community Review Feature
-- Created: 2026-02-26
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. Enum type for dish category
CREATE TYPE dish_category AS ENUM ('savory', 'dessert');

-- ============================================================
-- 2. dish_tags — master list of Filipino dishes
-- ============================================================
CREATE TABLE dish_tags (
  id            serial PRIMARY KEY,
  name          text NOT NULL,
  category      dish_category NOT NULL,
  display_order int,
  is_active     boolean DEFAULT true,
  created_at    timestamptz DEFAULT now()
);

-- ============================================================
-- 3. business_dish_tags — community-confirmed dishes per listing
-- ============================================================
CREATE TABLE business_dish_tags (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id       bigint NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  dish_tag_id       int    NOT NULL REFERENCES dish_tags(id) ON DELETE CASCADE,
  confirmed_count   int DEFAULT 1,
  last_verified     timestamptz,
  verified_by_owner boolean DEFAULT false,
  created_at        timestamptz DEFAULT now(),
  UNIQUE (business_id, dish_tag_id)
);

CREATE INDEX idx_business_dish_tags_business_id ON business_dish_tags(business_id);

-- ============================================================
-- 4. review_dish_tags — dishes tagged in individual reviews
-- ============================================================
CREATE TABLE review_dish_tags (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rating_id   bigint NOT NULL REFERENCES ratings(id) ON DELETE CASCADE,
  dish_tag_id int    NOT NULL REFERENCES dish_tags(id) ON DELETE CASCADE,
  created_at  timestamptz DEFAULT now()
);

CREATE INDEX idx_review_dish_tags_rating_id ON review_dish_tags(rating_id);

-- ============================================================
-- 5. Row Level Security
-- ============================================================

-- dish_tags: public read, admin write only
ALTER TABLE dish_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "dish_tags_public_read"
  ON dish_tags FOR SELECT
  USING (true);

-- business_dish_tags: public read, service role write
ALTER TABLE business_dish_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "business_dish_tags_public_read"
  ON business_dish_tags FOR SELECT
  USING (true);

CREATE POLICY "business_dish_tags_service_insert"
  ON business_dish_tags FOR INSERT
  WITH CHECK (true);

CREATE POLICY "business_dish_tags_service_update"
  ON business_dish_tags FOR UPDATE
  USING (true);

-- review_dish_tags: public read, service role write
ALTER TABLE review_dish_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "review_dish_tags_public_read"
  ON review_dish_tags FOR SELECT
  USING (true);

CREATE POLICY "review_dish_tags_service_insert"
  ON review_dish_tags FOR INSERT
  WITH CHECK (true);

-- ============================================================
-- 6. RPC function: atomic upsert with confirmed_count increment
--    Called from the submit-rating API route (service role)
-- ============================================================
CREATE OR REPLACE FUNCTION upsert_business_dish_tag(
  p_business_id  bigint,
  p_dish_tag_ids int[]
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO business_dish_tags (business_id, dish_tag_id, confirmed_count, last_verified)
  SELECT p_business_id, unnest(p_dish_tag_ids), 1, now()
  ON CONFLICT (business_id, dish_tag_id)
  DO UPDATE SET
    confirmed_count = business_dish_tags.confirmed_count + 1,
    last_verified   = now();
END;
$$;
