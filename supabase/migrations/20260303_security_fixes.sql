-- ============================================================
-- Migration: Security Fixes (Supabase Security Advisor)
-- Created: 2026-03-03
-- Run in the Supabase SQL editor (Dashboard → SQL Editor)
-- ============================================================

-- ============================================================
-- STEP 0 — VERIFY FUNCTION SIGNATURES BEFORE RUNNING
-- Run this block separately first and compare against the
-- ALTER FUNCTION statements in Fix 2 below.
-- ============================================================
/*
SELECT
  p.proname                                      AS function_name,
  pg_catalog.pg_get_function_arguments(p.oid)   AS arguments
FROM pg_catalog.pg_proc   p
JOIN pg_catalog.pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.proname IN (
    'update_articles_updated_at',
    'upsert_business_dish_tag',
    'upsert_business_grocery_tag',
    'upsert_business_universal_tag',
    'owner_set_dish_verified',
    'owner_set_grocery_verified',
    'owner_set_universal_verified'
  )
ORDER BY p.proname;
*/

-- ============================================================
-- STEP 0b — VERIFY POLICY NAMES ON PUBLIC SUBMISSION TABLES
-- Run this block separately to get exact policy names before
-- the DROP statements in Fix 3b execute.
-- ============================================================
/*
SELECT tablename, policyname, roles, cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'listing_claims',
    'business_submissions',
    'claims',
    'event_submissions',
    'listing_update_requests'
  )
ORDER BY tablename, policyname;
*/


-- ============================================================
-- FIX 1: Enable RLS on public.listing_claims
-- ERROR — table has no RLS at all
-- ============================================================

ALTER TABLE public.listing_claims ENABLE ROW LEVEL SECURITY;

-- Service role: unrestricted access for admin API routes
CREATE POLICY "listing_claims_service_all"
  ON public.listing_claims
  AS PERMISSIVE
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Authenticated users: read only their own claim rows.
-- Verified against production schema (2026-03-03): listing_claims has no
-- user_id column. The user identity column is claimant_email (text).
CREATE POLICY "listing_claims_owner_select"
  ON public.listing_claims
  FOR SELECT
  TO authenticated
  USING (auth.email() = claimant_email);


-- ============================================================
-- FIX 2: Lock down mutable search_path on 7 SECURITY DEFINER functions
-- WARN — functions have no fixed search_path
-- ============================================================
-- Setting search_path = '' (empty string) prevents an attacker from
-- placing a malicious object earlier in the search path that a
-- SECURITY DEFINER function would inadvertently pick up.
--
-- *** IMPORTANT — READ BEFORE RUNNING ***
-- All 6 upsert/owner functions reference unqualified table names
-- (e.g. business_dish_tags, not public.business_dish_tags).
-- With search_path = '' those references will throw
-- "relation does not exist" at runtime.
--
-- Two options:
--   A) Use the safer intermediate fix: SET search_path = 'public'
--      This resolves the Advisor warning and keeps functions working
--      without changing their bodies.
--
--   B) Keep SET search_path = '' (strictest) AND run the
--      CREATE OR REPLACE blocks that follow each ALTER to schema-qualify
--      every table reference. This is what is shown below.
--
-- Choose Option A or Option B; do NOT run both.
-- The ALTER statements below implement Option B (empty string + recreated bodies).
-- To use Option A instead, change each SET search_path = '' to SET search_path = 'public'
-- and skip the CREATE OR REPLACE blocks.

-- -----------------------------------------------
-- 2a. update_articles_updated_at  (trigger function, no args)
-- Signature confirmed: () — trigger functions do not appear in gen types
-- because they return trigger, not a data type. The no-args form is correct.
-- Trigger functions reference NEW/OLD (not schema-qualified tables),
-- so search_path = '' is safe here without recreating the body.
-- -----------------------------------------------
ALTER FUNCTION public.update_articles_updated_at()
  SET search_path = '';

-- -----------------------------------------------
-- 2b. upsert_business_dish_tag(bigint, integer[])
-- -----------------------------------------------
ALTER FUNCTION public.upsert_business_dish_tag(bigint, integer[])
  SET search_path = '';

-- Recreate body with schema-qualified references (required for Option B)
CREATE OR REPLACE FUNCTION public.upsert_business_dish_tag(
  p_business_id  bigint,
  p_dish_tag_ids integer[]
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.business_dish_tags (business_id, dish_tag_id, confirmed_count, last_verified)
  SELECT p_business_id, unnest(p_dish_tag_ids), 1, now()
  ON CONFLICT (business_id, dish_tag_id)
  DO UPDATE SET
    confirmed_count = public.business_dish_tags.confirmed_count + 1,
    last_verified   = now();
END;
$$;

-- -----------------------------------------------
-- 2c. upsert_business_grocery_tag(bigint, integer[])
-- -----------------------------------------------
ALTER FUNCTION public.upsert_business_grocery_tag(bigint, integer[])
  SET search_path = '';

CREATE OR REPLACE FUNCTION public.upsert_business_grocery_tag(
  p_business_id     bigint,
  p_grocery_tag_ids integer[]
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.business_grocery_tags (business_id, grocery_tag_id, confirmed_count, last_verified)
  SELECT p_business_id, unnest(p_grocery_tag_ids), 1, now()
  ON CONFLICT (business_id, grocery_tag_id)
  DO UPDATE SET
    confirmed_count = public.business_grocery_tags.confirmed_count + 1,
    last_verified   = now();
END;
$$;

-- -----------------------------------------------
-- 2d. upsert_business_universal_tag(bigint, integer[])
-- -----------------------------------------------
ALTER FUNCTION public.upsert_business_universal_tag(bigint, integer[])
  SET search_path = '';

CREATE OR REPLACE FUNCTION public.upsert_business_universal_tag(
  p_business_id       bigint,
  p_universal_tag_ids integer[]
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.business_universal_tags (business_id, universal_tag_id, confirmed_count, last_verified)
  SELECT p_business_id, unnest(p_universal_tag_ids), 1, now()
  ON CONFLICT (business_id, universal_tag_id)
  DO UPDATE SET
    confirmed_count = public.business_universal_tags.confirmed_count + 1,
    last_verified   = now();
END;
$$;

-- -----------------------------------------------
-- 2e. owner_set_dish_verified(bigint, integer[], boolean)
-- -----------------------------------------------
ALTER FUNCTION public.owner_set_dish_verified(bigint, integer[], boolean)
  SET search_path = '';

CREATE OR REPLACE FUNCTION public.owner_set_dish_verified(
  p_business_id  bigint,
  p_dish_tag_ids integer[],
  p_verified     boolean
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF array_length(p_dish_tag_ids, 1) IS NULL THEN RETURN; END IF;

  IF p_verified THEN
    INSERT INTO public.business_dish_tags (business_id, dish_tag_id, confirmed_count, verified_by_owner, last_verified)
    SELECT p_business_id, unnest(p_dish_tag_ids), 0, true, now()
    ON CONFLICT (business_id, dish_tag_id)
    DO UPDATE SET
      verified_by_owner = true,
      last_verified     = now();
  ELSE
    UPDATE public.business_dish_tags
    SET verified_by_owner = false
    WHERE business_id = p_business_id
      AND dish_tag_id = ANY(p_dish_tag_ids);
  END IF;
END;
$$;

-- -----------------------------------------------
-- 2f. owner_set_grocery_verified(bigint, integer[], boolean)
-- -----------------------------------------------
ALTER FUNCTION public.owner_set_grocery_verified(bigint, integer[], boolean)
  SET search_path = '';

CREATE OR REPLACE FUNCTION public.owner_set_grocery_verified(
  p_business_id     bigint,
  p_grocery_tag_ids integer[],
  p_verified        boolean
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF array_length(p_grocery_tag_ids, 1) IS NULL THEN RETURN; END IF;

  IF p_verified THEN
    INSERT INTO public.business_grocery_tags (business_id, grocery_tag_id, confirmed_count, verified_by_owner, last_verified)
    SELECT p_business_id, unnest(p_grocery_tag_ids), 0, true, now()
    ON CONFLICT (business_id, grocery_tag_id)
    DO UPDATE SET
      verified_by_owner = true,
      last_verified     = now();
  ELSE
    UPDATE public.business_grocery_tags
    SET verified_by_owner = false
    WHERE business_id = p_business_id
      AND grocery_tag_id = ANY(p_grocery_tag_ids);
  END IF;
END;
$$;

-- -----------------------------------------------
-- 2g. owner_set_universal_verified(bigint, integer[], boolean)
-- -----------------------------------------------
ALTER FUNCTION public.owner_set_universal_verified(bigint, integer[], boolean)
  SET search_path = '';

CREATE OR REPLACE FUNCTION public.owner_set_universal_verified(
  p_business_id       bigint,
  p_universal_tag_ids integer[],
  p_verified          boolean
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF array_length(p_universal_tag_ids, 1) IS NULL THEN RETURN; END IF;

  IF p_verified THEN
    INSERT INTO public.business_universal_tags (business_id, universal_tag_id, confirmed_count, verified_by_owner, last_verified)
    SELECT p_business_id, unnest(p_universal_tag_ids), 0, true, now()
    ON CONFLICT (business_id, universal_tag_id)
    DO UPDATE SET
      verified_by_owner = true,
      last_verified     = now();
  ELSE
    UPDATE public.business_universal_tags
    SET verified_by_owner = false
    WHERE business_id = p_business_id
      AND universal_tag_id = ANY(p_universal_tag_ids);
  END IF;
END;
$$;


-- ============================================================
-- FIX 3a: Tighten _service_insert and _service_update policies
-- WARN — policies apply to all roles; restrict to service_role only
-- Affected tables: business_dish_tags, business_grocery_tags,
--   business_owners, business_universal_tags, review_dish_tags
-- ============================================================

-- --- business_dish_tags ---
DROP POLICY IF EXISTS "business_dish_tags_service_insert" ON public.business_dish_tags;
DROP POLICY IF EXISTS "business_dish_tags_service_update" ON public.business_dish_tags;

CREATE POLICY "business_dish_tags_service_insert"
  ON public.business_dish_tags FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "business_dish_tags_service_update"
  ON public.business_dish_tags FOR UPDATE
  TO service_role
  USING (true);

-- --- business_grocery_tags ---
DROP POLICY IF EXISTS "business_grocery_tags_service_insert" ON public.business_grocery_tags;
DROP POLICY IF EXISTS "business_grocery_tags_service_update" ON public.business_grocery_tags;

CREATE POLICY "business_grocery_tags_service_insert"
  ON public.business_grocery_tags FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "business_grocery_tags_service_update"
  ON public.business_grocery_tags FOR UPDATE
  TO service_role
  USING (true);

-- --- business_owners ---
DROP POLICY IF EXISTS "business_owners_service_insert" ON public.business_owners;
DROP POLICY IF EXISTS "business_owners_service_update" ON public.business_owners;

CREATE POLICY "business_owners_service_insert"
  ON public.business_owners FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "business_owners_service_update"
  ON public.business_owners FOR UPDATE
  TO service_role
  USING (true);

-- --- business_universal_tags ---
DROP POLICY IF EXISTS "business_universal_tags_service_insert" ON public.business_universal_tags;
DROP POLICY IF EXISTS "business_universal_tags_service_update" ON public.business_universal_tags;

CREATE POLICY "business_universal_tags_service_insert"
  ON public.business_universal_tags FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "business_universal_tags_service_update"
  ON public.business_universal_tags FOR UPDATE
  TO service_role
  USING (true);

-- --- review_dish_tags ---
DROP POLICY IF EXISTS "review_dish_tags_service_insert" ON public.review_dish_tags;
DROP POLICY IF EXISTS "review_dish_tags_service_update" ON public.review_dish_tags;

CREATE POLICY "review_dish_tags_service_insert"
  ON public.review_dish_tags FOR INSERT
  TO service_role
  WITH CHECK (true);

-- review_dish_tags has no update path in business logic; omitting service_update.
-- If the Advisor flagged a service_update policy, add it here:
-- CREATE POLICY "review_dish_tags_service_update"
--   ON public.review_dish_tags FOR UPDATE
--   TO service_role
--   USING (true);


-- ============================================================
-- FIX 3b: Scope public submission policies to anon + authenticated
-- WARN — policies are intentionally open but should not implicitly
-- cover privileged roles (service_role, authenticator, etc.)
-- Affected tables: business_submissions, claims, event_submissions,
--   listing_update_requests
-- ============================================================
-- NOTE: These four tables were created directly in the Supabase dashboard —
-- no migration files exist for them locally. The DROP statements below cover
-- the four most common policy name patterns the dashboard generates.
-- If the Advisor shows a different policy name, add it as another DROP IF EXISTS
-- line before running. Run the STEP 0b query in the SQL Editor to confirm exact names.

-- --- business_submissions ---
DROP POLICY IF EXISTS "business_submissions_public_insert"   ON public.business_submissions;
DROP POLICY IF EXISTS "Allow public submissions"             ON public.business_submissions;
DROP POLICY IF EXISTS "Enable insert for anonymous users"    ON public.business_submissions;
DROP POLICY IF EXISTS "Public insert"                        ON public.business_submissions;

CREATE POLICY "business_submissions_public_insert"
  ON public.business_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- --- claims ---
DROP POLICY IF EXISTS "claims_public_insert"              ON public.claims;
DROP POLICY IF EXISTS "Allow public claims"               ON public.claims;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON public.claims;
DROP POLICY IF EXISTS "Public insert"                     ON public.claims;

CREATE POLICY "claims_public_insert"
  ON public.claims FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- --- event_submissions ---
DROP POLICY IF EXISTS "event_submissions_public_insert"   ON public.event_submissions;
DROP POLICY IF EXISTS "Allow public event submissions"    ON public.event_submissions;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON public.event_submissions;
DROP POLICY IF EXISTS "Public insert"                     ON public.event_submissions;

CREATE POLICY "event_submissions_public_insert"
  ON public.event_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- --- listing_update_requests ---
DROP POLICY IF EXISTS "listing_update_requests_public_insert" ON public.listing_update_requests;
DROP POLICY IF EXISTS "Allow public update requests"          ON public.listing_update_requests;
DROP POLICY IF EXISTS "Enable insert for anonymous users"     ON public.listing_update_requests;
DROP POLICY IF EXISTS "Public insert"                         ON public.listing_update_requests;

CREATE POLICY "listing_update_requests_public_insert"
  ON public.listing_update_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);


-- ============================================================
-- FIX 4: Leaked Password Protection
-- WARN — cannot be enabled via SQL migration
-- ============================================================
-- ACTION REQUIRED — manual step in the Supabase Dashboard:
--   Authentication → Providers → Email
--   → Toggle ON "Leaked Password Protection"
--
-- This feature checks submitted passwords against the HaveIBeenPwned
-- database of known breached credentials and blocks sign-ups/password
-- changes where the password has been exposed in a known data breach.
-- No code changes are required; it is a platform-level setting.
