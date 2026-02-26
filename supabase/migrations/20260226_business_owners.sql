-- ============================================================
-- Migration: Business Owners Table + Owner Verification RPCs
-- Created: 2026-02-26
-- Run AFTER all previous migrations
-- ============================================================

-- ============================================================
-- 1. business_owners — links approved owners to their listings
--    Access is token-based (no Supabase Auth required for owners)
-- ============================================================
CREATE TABLE IF NOT EXISTS business_owners (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id      bigint NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  owner_email     text NOT NULL,
  owner_name      text,
  is_primary      boolean DEFAULT true,
  claimed_at      timestamptz DEFAULT now(),
  dashboard_token text NOT NULL UNIQUE,  -- 64-char hex, sent to owner via email
  created_at      timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_business_owners_listing_id ON business_owners(listing_id);
CREATE INDEX IF NOT EXISTS idx_business_owners_token ON business_owners(dashboard_token);

ALTER TABLE business_owners ENABLE ROW LEVEL SECURITY;

-- Public read so API routes can look up by token
CREATE POLICY "business_owners_public_read"
  ON business_owners FOR SELECT
  USING (true);

-- Service role write only
CREATE POLICY "business_owners_service_insert"
  ON business_owners FOR INSERT
  WITH CHECK (true);

CREATE POLICY "business_owners_service_update"
  ON business_owners FOR UPDATE
  USING (true);

-- ============================================================
-- 2. RPC: owner_set_dish_verified
--    Upserts dish tags with verified_by_owner flag.
--    Does NOT overwrite existing confirmed_count from community.
-- ============================================================
CREATE OR REPLACE FUNCTION owner_set_dish_verified(
  p_business_id  bigint,
  p_dish_tag_ids int[],
  p_verified     boolean
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF array_length(p_dish_tag_ids, 1) IS NULL THEN RETURN; END IF;

  IF p_verified THEN
    -- Insert new rows with confirmed_count=0; update verified_by_owner if already exists
    INSERT INTO business_dish_tags (business_id, dish_tag_id, confirmed_count, verified_by_owner, last_verified)
    SELECT p_business_id, unnest(p_dish_tag_ids), 0, true, now()
    ON CONFLICT (business_id, dish_tag_id)
    DO UPDATE SET
      verified_by_owner = true,
      last_verified     = now();
  ELSE
    -- Unverify without deleting — preserve community confirmed_count
    UPDATE business_dish_tags
    SET verified_by_owner = false
    WHERE business_id = p_business_id
      AND dish_tag_id = ANY(p_dish_tag_ids);
  END IF;
END;
$$;

-- ============================================================
-- 3. RPC: owner_set_grocery_verified
-- ============================================================
CREATE OR REPLACE FUNCTION owner_set_grocery_verified(
  p_business_id    bigint,
  p_grocery_tag_ids int[],
  p_verified       boolean
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF array_length(p_grocery_tag_ids, 1) IS NULL THEN RETURN; END IF;

  IF p_verified THEN
    INSERT INTO business_grocery_tags (business_id, grocery_tag_id, confirmed_count, verified_by_owner, last_verified)
    SELECT p_business_id, unnest(p_grocery_tag_ids), 0, true, now()
    ON CONFLICT (business_id, grocery_tag_id)
    DO UPDATE SET
      verified_by_owner = true,
      last_verified     = now();
  ELSE
    UPDATE business_grocery_tags
    SET verified_by_owner = false
    WHERE business_id = p_business_id
      AND grocery_tag_id = ANY(p_grocery_tag_ids);
  END IF;
END;
$$;

-- ============================================================
-- 4. RPC: owner_set_universal_verified
-- ============================================================
CREATE OR REPLACE FUNCTION owner_set_universal_verified(
  p_business_id       bigint,
  p_universal_tag_ids int[],
  p_verified          boolean
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF array_length(p_universal_tag_ids, 1) IS NULL THEN RETURN; END IF;

  IF p_verified THEN
    INSERT INTO business_universal_tags (business_id, universal_tag_id, confirmed_count, verified_by_owner, last_verified)
    SELECT p_business_id, unnest(p_universal_tag_ids), 0, true, now()
    ON CONFLICT (business_id, universal_tag_id)
    DO UPDATE SET
      verified_by_owner = true,
      last_verified     = now();
  ELSE
    UPDATE business_universal_tags
    SET verified_by_owner = false
    WHERE business_id = p_business_id
      AND universal_tag_id = ANY(p_universal_tag_ids);
  END IF;
END;
$$;
