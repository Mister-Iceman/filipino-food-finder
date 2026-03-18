-- ============================================================
-- FFNM First-Party Analytics Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- or via: node scripts/setup-analytics.mjs
-- ============================================================

-- 1. page_views
CREATE TABLE IF NOT EXISTS page_views (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id text NOT NULL,
  visitor_id text NOT NULL,
  page_path text NOT NULL,
  page_title text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  device_type text,
  browser text,
  os text,
  country text,
  region text,
  city text,
  screen_width integer,
  screen_height integer,
  duration_seconds integer,
  scroll_depth integer,
  is_bounce boolean DEFAULT false,
  step_number integer,
  created_at timestamptz DEFAULT NOW()
);

-- 2. sessions
CREATE TABLE IF NOT EXISTS sessions (
  id text PRIMARY KEY,
  visitor_id text NOT NULL,
  started_at timestamptz DEFAULT NOW(),
  ended_at timestamptz,
  duration_seconds integer,
  page_count integer DEFAULT 1,
  entry_page text,
  exit_page text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  device_type text,
  browser text,
  os text,
  country text,
  city text,
  converted boolean DEFAULT false,
  created_at timestamptz DEFAULT NOW()
);

-- 3. listing_interactions
CREATE TABLE IF NOT EXISTS listing_interactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id text NOT NULL,
  visitor_id text NOT NULL,
  interaction_type text NOT NULL,
  listing_id text,
  listing_name text,
  listing_category text,
  listing_city text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT NOW()
);

-- 4. search_queries
CREATE TABLE IF NOT EXISTS search_queries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id text NOT NULL,
  visitor_id text NOT NULL,
  query text NOT NULL,
  results_count integer,
  clicked_result_id text,
  clicked_result_name text,
  filters_used jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT NOW()
);

-- 5. user_journeys
CREATE TABLE IF NOT EXISTS user_journeys (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id text NOT NULL,
  visitor_id text NOT NULL,
  step_number integer NOT NULL,
  page_path text NOT NULL,
  action text,
  action_detail text,
  time_on_previous_page integer,
  created_at timestamptz DEFAULT NOW()
);

-- 6. outbound_clicks
CREATE TABLE IF NOT EXISTS outbound_clicks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id text NOT NULL,
  visitor_id text NOT NULL,
  destination_url text NOT NULL,
  link_type text,
  source_page text,
  listing_id text,
  created_at timestamptz DEFAULT NOW()
);

-- 7. category_views
CREATE TABLE IF NOT EXISTS category_views (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id text NOT NULL,
  visitor_id text NOT NULL,
  category_slug text NOT NULL,
  filters_applied jsonb DEFAULT '{}',
  results_shown integer,
  listings_clicked integer DEFAULT 0,
  duration_seconds integer,
  created_at timestamptz DEFAULT NOW()
);

-- 8. city_views
CREATE TABLE IF NOT EXISTS city_views (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id text NOT NULL,
  visitor_id text NOT NULL,
  city_slug text NOT NULL,
  city_name text,
  state text,
  results_shown integer,
  listings_clicked integer DEFAULT 0,
  duration_seconds integer,
  created_at timestamptz DEFAULT NOW()
);

-- ─── RLS Policies ────────────────────────────────────────────────────────────

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE outbound_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE city_views ENABLE ROW LEVEL SECURITY;

-- INSERT: allow anon
CREATE POLICY "allow anon insert page_views" ON page_views FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "allow anon insert sessions" ON sessions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "allow anon insert listing_interactions" ON listing_interactions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "allow anon insert search_queries" ON search_queries FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "allow anon insert user_journeys" ON user_journeys FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "allow anon insert outbound_clicks" ON outbound_clicks FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "allow anon insert category_views" ON category_views FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "allow anon insert city_views" ON city_views FOR INSERT TO anon WITH CHECK (true);

-- UPDATE: allow anon (for duration/scroll updates on same session)
CREATE POLICY "allow anon update page_views" ON page_views FOR UPDATE TO anon USING (true);
CREATE POLICY "allow anon update sessions" ON sessions FOR UPDATE TO anon USING (true);

-- SELECT: authenticated only (admin dashboard)
CREATE POLICY "allow auth select page_views" ON page_views FOR SELECT TO authenticated USING (true);
CREATE POLICY "allow auth select sessions" ON sessions FOR SELECT TO authenticated USING (true);
CREATE POLICY "allow auth select listing_interactions" ON listing_interactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "allow auth select search_queries" ON search_queries FOR SELECT TO authenticated USING (true);
CREATE POLICY "allow auth select user_journeys" ON user_journeys FOR SELECT TO authenticated USING (true);
CREATE POLICY "allow auth select outbound_clicks" ON outbound_clicks FOR SELECT TO authenticated USING (true);
CREATE POLICY "allow auth select category_views" ON category_views FOR SELECT TO authenticated USING (true);
CREATE POLICY "allow auth select city_views" ON city_views FOR SELECT TO authenticated USING (true);

-- ─── Indexes ─────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_page_views_session ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_created ON page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_page_views_visitor ON page_views(visitor_id);

CREATE INDEX IF NOT EXISTS idx_sessions_visitor ON sessions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_sessions_created ON sessions(created_at);

CREATE INDEX IF NOT EXISTS idx_listing_interactions_listing ON listing_interactions(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_interactions_created ON listing_interactions(created_at);
CREATE INDEX IF NOT EXISTS idx_listing_interactions_type ON listing_interactions(interaction_type);

CREATE INDEX IF NOT EXISTS idx_search_queries_query ON search_queries(query);
CREATE INDEX IF NOT EXISTS idx_search_queries_created ON search_queries(created_at);

CREATE INDEX IF NOT EXISTS idx_user_journeys_session ON user_journeys(session_id);
CREATE INDEX IF NOT EXISTS idx_outbound_clicks_type ON outbound_clicks(link_type);
CREATE INDEX IF NOT EXISTS idx_outbound_clicks_created ON outbound_clicks(created_at);
