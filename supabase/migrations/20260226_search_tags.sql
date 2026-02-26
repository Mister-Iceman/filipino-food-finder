-- ============================================================
-- Migration: Search Tag Tables (Grocery + Universal)
-- Created: 2026-02-26
-- Run AFTER 20260226_dish_tags.sql
-- Run in the Supabase SQL editor (Dashboard → SQL Editor)
-- ============================================================

-- ============================================================
-- 1. Add slug column to existing dish_tags table
-- ============================================================
ALTER TABLE dish_tags ADD COLUMN IF NOT EXISTS slug text;

CREATE UNIQUE INDEX IF NOT EXISTS dish_tags_slug_idx
  ON dish_tags(slug) WHERE slug IS NOT NULL;

-- ============================================================
-- 2. grocery_tags — master list of grocery/market product categories
-- ============================================================
CREATE TABLE IF NOT EXISTS grocery_tags (
  id            serial PRIMARY KEY,
  name          text NOT NULL,
  slug          text NOT NULL UNIQUE,
  emoji         text,
  display_order int,
  is_active     boolean DEFAULT true,
  created_at    timestamptz DEFAULT now()
);

-- ============================================================
-- 3. business_grocery_tags — community-confirmed grocery categories per listing
-- ============================================================
CREATE TABLE IF NOT EXISTS business_grocery_tags (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id       bigint NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  grocery_tag_id    int    NOT NULL REFERENCES grocery_tags(id) ON DELETE CASCADE,
  confirmed_count   int DEFAULT 1,
  last_verified     timestamptz,
  verified_by_owner boolean DEFAULT false,
  created_at        timestamptz DEFAULT now(),
  UNIQUE (business_id, grocery_tag_id)
);

CREATE INDEX IF NOT EXISTS idx_business_grocery_tags_business_id
  ON business_grocery_tags(business_id);

-- ============================================================
-- 4. universal_tags — tags that apply to all business types
-- ============================================================
CREATE TABLE IF NOT EXISTS universal_tags (
  id            serial PRIMARY KEY,
  name          text NOT NULL,
  slug          text NOT NULL UNIQUE,
  emoji         text,
  display_order int,
  is_active     boolean DEFAULT true,
  created_at    timestamptz DEFAULT now()
);

-- ============================================================
-- 5. business_universal_tags — community-confirmed features per listing
-- ============================================================
CREATE TABLE IF NOT EXISTS business_universal_tags (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id       bigint NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  universal_tag_id  int    NOT NULL REFERENCES universal_tags(id) ON DELETE CASCADE,
  confirmed_count   int DEFAULT 1,
  last_verified     timestamptz,
  verified_by_owner boolean DEFAULT false,
  created_at        timestamptz DEFAULT now(),
  UNIQUE (business_id, universal_tag_id)
);

CREATE INDEX IF NOT EXISTS idx_business_universal_tags_business_id
  ON business_universal_tags(business_id);

-- ============================================================
-- 6. Row Level Security
-- ============================================================

-- grocery_tags: public read, admin write only
ALTER TABLE grocery_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "grocery_tags_public_read"
  ON grocery_tags FOR SELECT
  USING (true);

-- business_grocery_tags: public read, service role write
ALTER TABLE business_grocery_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "business_grocery_tags_public_read"
  ON business_grocery_tags FOR SELECT
  USING (true);

CREATE POLICY "business_grocery_tags_service_insert"
  ON business_grocery_tags FOR INSERT
  WITH CHECK (true);

CREATE POLICY "business_grocery_tags_service_update"
  ON business_grocery_tags FOR UPDATE
  USING (true);

-- universal_tags: public read, admin write only
ALTER TABLE universal_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "universal_tags_public_read"
  ON universal_tags FOR SELECT
  USING (true);

-- business_universal_tags: public read, service role write
ALTER TABLE business_universal_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "business_universal_tags_public_read"
  ON business_universal_tags FOR SELECT
  USING (true);

CREATE POLICY "business_universal_tags_service_insert"
  ON business_universal_tags FOR INSERT
  WITH CHECK (true);

CREATE POLICY "business_universal_tags_service_update"
  ON business_universal_tags FOR UPDATE
  USING (true);

-- ============================================================
-- 7. RPC: atomic upsert with confirmed_count increment (grocery)
-- ============================================================
CREATE OR REPLACE FUNCTION upsert_business_grocery_tag(
  p_business_id    bigint,
  p_grocery_tag_ids int[]
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO business_grocery_tags (business_id, grocery_tag_id, confirmed_count, last_verified)
  SELECT p_business_id, unnest(p_grocery_tag_ids), 1, now()
  ON CONFLICT (business_id, grocery_tag_id)
  DO UPDATE SET
    confirmed_count = business_grocery_tags.confirmed_count + 1,
    last_verified   = now();
END;
$$;

-- ============================================================
-- 8. RPC: atomic upsert with confirmed_count increment (universal)
-- ============================================================
CREATE OR REPLACE FUNCTION upsert_business_universal_tag(
  p_business_id      bigint,
  p_universal_tag_ids int[]
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO business_universal_tags (business_id, universal_tag_id, confirmed_count, last_verified)
  SELECT p_business_id, unnest(p_universal_tag_ids), 1, now()
  ON CONFLICT (business_id, universal_tag_id)
  DO UPDATE SET
    confirmed_count = business_universal_tags.confirmed_count + 1,
    last_verified   = now();
END;
$$;
