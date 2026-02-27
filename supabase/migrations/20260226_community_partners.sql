-- Community Partners table
create table if not exists community_partners (
  id uuid primary key default gen_random_uuid(),
  org_name text not null,
  full_name text,
  website text,
  contact_email text not null,
  description text,
  category text not null default 'Organization',
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

-- RLS: allow anon full access (admin protected at app layer; public page filters by status in query)
alter table community_partners enable row level security;

create policy "Anon full access to community_partners"
  on community_partners for all
  to anon
  using (true)
  with check (true);

-- Seed 3 pending partners
insert into community_partners (org_name, contact_email, website, category, status) values
  (
    'Filipino American National Historical Society (FANHS)',
    'info@fanhs-national.org',
    'https://fanhs-national.org',
    'Organization',
    'pending'
  ),
  (
    'National Federation of Filipino American Associations (NaFFAA)',
    'info@naffaa.org',
    'https://naffaa.org',
    'Organization',
    'pending'
  ),
  (
    'Filipino American Chamber of Commerce',
    'info@filipinoamericanchamber.org',
    'https://filipinoamericanchamber.org',
    'Business Association',
    'pending'
  );
