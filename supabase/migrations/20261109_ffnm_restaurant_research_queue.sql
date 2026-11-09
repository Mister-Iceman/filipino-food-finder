BEGIN;

CREATE TABLE IF NOT EXISTS public.ffnm_restaurant_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_hash text NOT NULL UNIQUE CHECK (draft_hash ~ '^[a-f0-9]{64}$'),
  draft jsonb NOT NULL CHECK (jsonb_typeof(draft) = 'object'),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'rejected')),
  listing_slug text,
  review_note text,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ffnm_restaurant_drafts_status_created_idx
  ON public.ffnm_restaurant_drafts (status, created_at DESC);
ALTER TABLE public.ffnm_restaurant_drafts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.ffnm_restaurant_drafts FROM PUBLIC, anon, authenticated, service_role;
GRANT SELECT, INSERT ON public.ffnm_restaurant_drafts TO service_role;

CREATE OR REPLACE FUNCTION public.ffnm_decide_restaurant_draft(
  p_id uuid, p_hash text, p_action text, p_note text
) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  queued public.ffnm_restaurant_drafts%ROWTYPE;
  candidate public.listings%ROWTYPE;
  slug_base text;
  published_slug text;
  name_key text;
  city_key text;
  address_key text;
BEGIN
  IF p_action IS NULL OR p_action NOT IN ('publish', 'reject') THEN
    RAISE EXCEPTION 'Invalid decision' USING ERRCODE = '22023';
  END IF;
  SELECT * INTO queued FROM public.ffnm_restaurant_drafts WHERE id = p_id FOR UPDATE;
  IF NOT FOUND OR queued.draft_hash IS DISTINCT FROM p_hash THEN
    RAISE EXCEPTION 'Draft version not found.' USING ERRCODE = 'P0001';
  END IF;
  IF (queued.status = 'published' AND p_action = 'publish')
     OR (queued.status = 'rejected' AND p_action = 'reject') THEN
    RETURN jsonb_build_object('status', queued.status, 'slug', queued.listing_slug);
  END IF;
  IF queued.status <> 'pending' THEN
    RAISE EXCEPTION 'This draft already has a decision.' USING ERRCODE = 'P0001';
  END IF;
  IF p_action = 'reject' THEN
    UPDATE public.ffnm_restaurant_drafts SET status = 'rejected', reviewed_at = now(),
      review_note = nullif(p_note, '') WHERE id = p_id;
    RETURN jsonb_build_object('status', 'rejected');
  END IF;

  SELECT * INTO candidate FROM jsonb_populate_record(NULL::public.listings, queued.draft);
  IF nullif(btrim(candidate.name), '') IS NULL OR nullif(btrim(candidate.address_street), '') IS NULL
     OR nullif(btrim(candidate.city), '') IS NULL OR candidate.state IS NULL
     OR candidate.zip IS NULL OR candidate.category_primary IS NULL THEN
    RAISE EXCEPTION 'The draft is missing required listing details.' USING ERRCODE = 'P0001';
  END IF;
  name_key := regexp_replace(lower(candidate.name), '[^[:alnum:]]', '', 'g');
  city_key := regexp_replace(lower(candidate.city), '[^[:alnum:]]', '', 'g');
  address_key := regexp_replace(lower(candidate.address_street), '[^[:alnum:]]', '', 'g');

  LOCK TABLE public.listings, public.business_submissions IN SHARE ROW EXCLUSIVE MODE;
  IF EXISTS (
    SELECT 1 FROM public.listings l WHERE upper(l.state) = candidate.state
      AND regexp_replace(lower(l.city), '[^[:alnum:]]', '', 'g') = city_key
      AND (regexp_replace(lower(l.name), '[^[:alnum:]]', '', 'g') = name_key
        OR regexp_replace(lower(l.address_street), '[^[:alnum:]]', '', 'g') = address_key)
  ) OR EXISTS (
    SELECT 1 FROM public.business_submissions s WHERE s.status = 'pending' AND upper(s.state) = candidate.state
      AND regexp_replace(lower(s.city), '[^[:alnum:]]', '', 'g') = city_key
      AND (regexp_replace(lower(s.business_name), '[^[:alnum:]]', '', 'g') = name_key
        OR regexp_replace(lower(s.address_street), '[^[:alnum:]]', '', 'g') = address_key)
  ) THEN
    RAISE EXCEPTION 'A listing or pending submission matches this name or address. Review the existing record first.'
      USING ERRCODE = 'P0001';
  END IF;

  slug_base := trim(both '-' from regexp_replace(lower(concat_ws('-', candidate.name, candidate.city, candidate.state)), '[^a-z0-9]+', '-', 'g'));
  published_slug := slug_base;
  IF EXISTS (SELECT 1 FROM public.listings WHERE slug = published_slug) THEN
    published_slug := slug_base || '-' || queued.id::text;
  END IF;
  INSERT INTO public.listings (
    name, slug, category_primary, category_secondary, address_street, city, state, zip,
    phone, website, google_maps_url, hours, description, instagram_url, facebook_url,
    tiktok_url, x_url, is_pickup_only
  ) VALUES (
    candidate.name, published_slug, candidate.category_primary, candidate.category_secondary,
    candidate.address_street, candidate.city, candidate.state, candidate.zip, candidate.phone,
    candidate.website, candidate.google_maps_url, candidate.hours, candidate.description,
    candidate.instagram_url, candidate.facebook_url, candidate.tiktok_url, candidate.x_url,
    coalesce(candidate.is_pickup_only, false)
  );
  UPDATE public.ffnm_restaurant_drafts SET status = 'published', listing_slug = published_slug,
    reviewed_at = now(), review_note = nullif(p_note, '') WHERE id = p_id;
  RETURN jsonb_build_object('status', 'published', 'slug', published_slug);
END;
$$;
REVOKE ALL ON FUNCTION public.ffnm_decide_restaurant_draft(uuid, text, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.ffnm_decide_restaurant_draft(uuid, text, text, text) TO service_role;

COMMIT;
