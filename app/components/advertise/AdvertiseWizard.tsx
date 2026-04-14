'use client'

import { useState, useRef, useEffect } from 'react'
import { PACKAGES, calculateOrderTotal } from '../../../lib/ad-packages'
import type { FfnmPackage, FenmPackage } from '../../../lib/ad-packages'
import { supabase } from '../../../lib/supabase'

type Site = 'ffnm' | 'fenm' | 'both' | null

const IMAGE_SLOTS = [
  {
    label: 'Logo or primary image',
    hint: 'Square · min 800×800px · JPG/PNG · max 2MB',
    accept: 'image/jpeg,image/png',
    maxMB: 2,
  },
  {
    label: 'Food photo or flyer',
    hint: 'Landscape · 1200×675px · JPG/PNG · max 2MB',
    accept: 'image/jpeg,image/png',
    maxMB: 2,
  },
  {
    label: 'Coupon or offer',
    hint: 'Any ratio · JPG/PNG · max 2MB',
    accept: 'image/jpeg,image/png',
    maxMB: 2,
  },
  {
    label: 'Event flyer',
    hint: 'PDF/JPG/PNG · max 5MB',
    accept: 'image/jpeg,image/png,application/pdf',
    maxMB: 5,
  },
]

const LINK_TYPES = ['Website', 'Instagram', 'Facebook', 'TikTok', 'X (Twitter)', 'Ticket link'] as const


function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

const GEO_HINTS_FFNM: Record<string, string> = {
  local: 'Enter your city and state — e.g. Los Angeles, CA or Daly City, CA',
  regional: 'Enter your state or up to 3 cities — e.g. California or Los Angeles, San Diego, Riverside',
  national: 'Leave blank for nationwide coverage, or enter target regions — e.g. West Coast, Texas, East Coast',
}

const GEO_HINTS_FENM: Record<string, string> = {
  boost: 'Enter your event city and state — e.g. Los Angeles, CA',
  spotlight: 'Enter your state or region — e.g. California or Pacific Northwest',
  headliner: 'Leave blank for nationwide, or enter target regions',
}

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-500">Step {step} of 5</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all duration-300"
          style={{ width: `${(step / 5) * 100}%`, background: '#62438D' }}
        />
      </div>
    </div>
  )
}

function PackageCard({
  pkg,
  selected,
  color,
  onClick,
}: {
  pkg: FfnmPackage | FenmPackage
  selected: boolean
  color: 'violet' | 'teal'
  onClick: () => void
}) {
  const borderColor = color === 'violet' ? '#62438D' : '#085041'
  const priceColor = color === 'violet' ? '#62438D' : '#085041'

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-xl border-2 bg-white p-5 transition-all hover:shadow-md"
      style={{
        borderColor: selected ? borderColor : '#e5e7eb',
        boxShadow: selected ? `0 0 0 3px ${borderColor}22` : undefined,
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold text-gray-900">{pkg.name}</h3>
        {selected && (
          <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: borderColor }}>
            Selected
          </span>
        )}
      </div>
      <p className="text-xs text-gray-400 mb-3">{pkg.geo}</p>

      <div className="mb-3">
        <span className="line-through text-gray-400 text-sm mr-2">${pkg.standardPrice}{pkg.cadence}</span>
        <span className="text-2xl font-bold" style={{ color: priceColor }}>
          ${pkg.foundingPrice}
        </span>
        <span className="text-sm text-gray-500">{pkg.cadence}</span>
        <span
          className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: '#FEF3C7', color: '#D1880D' }}
        >
          Save ${pkg.savings}
        </span>
      </div>

      <ul className="space-y-1 mb-4">
        {pkg.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
            <span className="mt-0.5" style={{ color: borderColor }}>✓</span>
            {f}
          </li>
        ))}
      </ul>

      <p className="text-xs font-semibold" style={{ color: '#D1880D' }}>
        🔒 Founding rate locked in — stays this price as long as your subscription remains active
      </p>
    </div>
  )
}

async function uploadToCloudinary(file: File, slotIndex: number): Promise<{ url?: string; error?: string }> {
  const maxSize = slotIndex === 3 ? 5 * 1024 * 1024 : 2 * 1024 * 1024
  if (file.size > maxSize) {
    return { error: `File too large. Max ${slotIndex === 3 ? '5MB' : '2MB'}.` }
  }
  const allowed = slotIndex === 3
    ? ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
    : ['image/jpeg', 'image/png', 'image/webp']
  if (!allowed.includes(file.type)) {
    return { error: 'Invalid file type.' }
  }
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'ffnm_ads')
    const res = await fetch(
      'https://api.cloudinary.com/v1_1/dwpbqhyrm/upload',
      { method: 'POST', body: formData }
    )
    const data = await res.json()
    if (data.error) {
      console.error('Cloudinary error:', data.error)
      return { error: data.error.message }
    }
    return { url: data.secure_url }
  } catch (err) {
    console.error('Upload exception:', err)
    return { error: 'Upload failed. Please try again.' }
  }
}

function ImageUploadSlot({
  slot,
  slotIndex,
  url,
  onUpload,
  onRemove,
}: {
  slot: typeof IMAGE_SLOTS[0]
  slotIndex: number
  url: string
  onUpload: (url: string) => void
  onRemove: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setUploading(true)
    const result = await uploadToCloudinary(file, slotIndex)
    if (result.error) {
      setError(result.error)
    } else if (result.url) {
      onUpload(result.url)
    }
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={slot.accept}
        className="hidden"
        onChange={handleFile}
      />
      {url ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-200">
          <img src={url} alt={slot.label} className="w-full h-32 object-cover" />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-black/80"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-purple-400 hover:bg-purple-50 transition-all"
          disabled={uploading}
        >
          {uploading ? (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Uploading...
            </div>
          ) : (
            <>
              <div className="text-2xl mb-1">📷</div>
              <p className="text-sm font-medium text-gray-700">{slot.label}</p>
              <p className="text-xs text-gray-400 mt-1">{slot.hint}</p>
            </>
          )}
        </button>
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

// ── Why advertise section ──────────────────────────────────────────────────


const VALUE_PROPS = [
  {
    icon: '🎯',
    title: 'Highly intentional audience',
    body: 'People who visit FilipinoFoodNearMe.org are actively searching for Filipino food — not passively scrolling. Your ad reaches people ready to eat, visit, and spend.',
  },
  {
    icon: '🏘️',
    title: 'Community-first, not pay-to-rank',
    body: 'Your free listing stays in the organic directory regardless. Featured placement is optional promotion — never a penalty for not paying. Community trust is our most valuable asset.',
  },
  {
    icon: '📊',
    title: 'Full transparency',
    body: 'Every ad run includes a delivery report: impressions, clicks, CTR, and a screenshot of your live placement. Plus automatic UTM tracking so you can measure results in your own analytics.',
  },
]

function WhyAdvertise() {
  const [ffnmCounts, setFfnmCounts] = useState({ businesses: '1,237+', states: '34', cities: '423+' })
  const [fenmCounts, setFenmCounts] = useState({
    events: '102+',
    cities: '64+',
    states: '18+',
    categories: '7+',
  })

  useEffect(() => {
    async function fetchStats() {
      const [bizRes, stateRes, cityRes] = await Promise.all([
        supabase.from('listings').select('*', { count: 'exact', head: true }),
        supabase.from('listings').select('state').not('state', 'is', null),
        supabase.from('listings').select('city').not('city', 'is', null),
      ])
      const businesses = bizRes.count ?? null
      const states = stateRes.data ? new Set(stateRes.data.map((r: any) => r.state)).size : null
      const cities = cityRes.data ? new Set(cityRes.data.map((r: any) => r.city)).size : null
      setFfnmCounts({
        businesses: businesses !== null ? `${businesses.toLocaleString()}+` : '1,237+',
        states: states !== null ? String(states) : '34',
        cities: cities !== null ? `${cities.toLocaleString()}+` : '423+',
      })

      // FENM stats — query fenm_events table
      const [fenmEventsRes, fenmCitiesRes, fenmStatesRes, fenmCatsRes] = await Promise.all([
        supabase.from('fenm_events').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('fenm_events').select('city').eq('status', 'active'),
        supabase.from('fenm_events').select('state').eq('status', 'active'),
        supabase.from('fenm_events').select('category').eq('status', 'active'),
      ])
      const fenmEventCount = fenmEventsRes.count ?? null
      const fenmCityCount = fenmCitiesRes.data ? new Set(fenmCitiesRes.data.map((r: any) => r.city).filter(Boolean)).size : null
      const fenmStateCount = fenmStatesRes.data ? new Set(fenmStatesRes.data.map((r: any) => r.state).filter(Boolean)).size : null
      const fenmCatCount = fenmCatsRes.data ? new Set(fenmCatsRes.data.map((r: any) => r.category).filter(Boolean)).size : null
      setFenmCounts({
        events:     fenmEventCount !== null ? fenmEventCount + '+' : '102+',
        cities:     fenmCityCount  !== null ? fenmCityCount  + '+' : '64+',
        states:     fenmStateCount !== null ? fenmStateCount + '+' : '18+',
        categories: fenmCatCount   !== null ? fenmCatCount   + '+' : '7+',
      })
    }
    fetchStats()
  }, [])

  const FFNM_STATS = [
    { icon: '🍽️', number: ffnmCounts.businesses, label: 'Filipino food businesses listed' },
    { icon: '🗺️', number: ffnmCounts.states,     label: 'States with listings' },
    { icon: '📍', number: ffnmCounts.cities,      label: 'Cities represented' },
    { icon: '👥', number: '4.2M+',                label: 'Filipino-Americans in the U.S.' },
  ]

  return (
    <div className="mb-8">
      {/* Section header */}
      <div className="text-center mb-6">
        <span
          className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3"
          style={{ background: '#FEF3C7', color: '#D1880D' }}
        >
          Why advertise with us
        </span>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          The most trusted Filipino-American platform in the U.S.
        </h2>
        <p className="text-sm text-gray-500 max-w-lg mx-auto">
          The FilAm Network connects Filipino-Americans to food, events, and culture across the U.S. — through
          FilipinoFoodNearMe.org and FilipinoEventsNearMe.org. 1,237+ food businesses. 64+ events. Community-built. Zero pay-to-rank.
        </p>
      </div>

      {/* FFNM stats */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">FilipinoFoodNearMe.org</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {FFNM_STATS.map((s) => (
          <div
            key={s.label}
            className="bg-white border border-gray-200 rounded-xl p-4 text-center"
          >
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-semibold mb-0.5" style={{ color: '#62438D' }}>
              {s.number}
            </div>
            <div className="text-xs text-gray-500 leading-tight">{s.label}</div>
          </div>
        ))}
      </div>

      {/* FENM stats */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">FilipinoEventsNearMe.org</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {[
          { icon: '📅', number: fenmCounts.events,     label: 'Events listed' },
          { icon: '📍', number: fenmCounts.cities,     label: 'Cities' },
          { icon: '🗺️', number: fenmCounts.states,     label: 'States covered' },
          { icon: '🎭', number: fenmCounts.categories, label: 'Event categories' },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white border border-gray-200 rounded-xl p-4 text-center"
          >
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-semibold mb-0.5" style={{ color: '#0038A8' }}>
              {s.number}
            </div>
            <div className="text-xs text-gray-500 leading-tight">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Value props — stacked mobile, 3-col desktop */}
      <div className="grid md:grid-cols-3 gap-3">
        {VALUE_PROPS.map((v) => (
          <div
            key={v.title}
            className="bg-white border border-gray-200 rounded-xl p-5"
            style={{ borderLeft: '3px solid #62438D' }}
          >
            <p className="font-bold text-gray-900 mb-2">
              {v.icon} {v.title}
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">{v.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Placement preview helpers ──────────────────────────────────────────────

function YourAdSlot({ label, twoLine }: { label: string; twoLine?: boolean }) {
  return (
    <div
      className="rounded border-2 border-dashed flex items-center justify-center p-1.5 min-h-[48px]"
      style={{ borderColor: '#D1880D', background: '#FFFBEB' }}
    >
      <span
        className={`font-bold text-center leading-tight ${twoLine ? 'text-[9px]' : 'text-[10px]'}`}
        style={{ color: '#D1880D' }}
      >
        {label}
      </span>
    </div>
  )
}

function SampleCard({ name, accent }: { name: string; accent: string }) {
  return (
    <div className="rounded border border-gray-200 overflow-hidden">
      <div className="h-7" style={{ background: accent, opacity: 0.85 }} />
      <div className="px-1.5 py-1">
        <div className="text-[9px] font-semibold text-gray-700 truncate">{name}</div>
        <div className="w-6 h-0.5 rounded mt-0.5 bg-gray-200" />
      </div>
    </div>
  )
}

function MockupTopbar({ site }: { site: 'ffnm' | 'fenm' }) {
  const bg =
    site === 'ffnm'
      ? 'linear-gradient(135deg,#62438D,#92345A,#BF2F26)'
      : 'linear-gradient(135deg,#085041,#1D9E75)'
  return (
    <div className="flex items-center gap-1 px-2 py-1.5" style={{ background: bg }}>
      <div className="flex gap-0.5 mr-1">
        <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
        <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
        <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
      </div>
      <span className="text-[9px] font-bold text-white truncate">
        {site === 'ffnm' ? 'FilipinoFoodNearMe.org' : 'FilipinoEventsNearMe.org'}
      </span>
    </div>
  )
}

function MockupHero({
  site,
  page,
}: {
  site: 'ffnm' | 'fenm'
  page: 'home' | 'city'
}) {
  if (page === 'home') {
    const bg =
      site === 'ffnm'
        ? 'linear-gradient(135deg,#62438D,#BF2F26)'
        : 'linear-gradient(135deg,#085041,#1D9E75)'
    return (
      <div className="px-2 py-3 flex items-center justify-center" style={{ background: bg }}>
        <span className="text-[9px] font-bold text-white text-center">
          {site === 'ffnm' ? 'The Filipino Food Directory' : 'Filipino Events Near You'}
        </span>
      </div>
    )
  }
  const bgColor = site === 'ffnm' ? '#F3EEFF' : '#ECFDF5'
  const color = site === 'ffnm' ? '#62438D' : '#085041'
  return (
    <div className="px-2 py-2" style={{ background: bgColor }}>
      <div className="text-[9px] font-bold" style={{ color }}>
        Filipino {site === 'ffnm' ? 'Food' : 'Events'} in Los Angeles
      </div>
      <div className="text-[8px] text-gray-400">Discover the best spots near you</div>
    </div>
  )
}

function MockupBody({
  site,
  page,
  isMobile,
}: {
  site: 'ffnm' | 'fenm'
  page: 'home' | 'city'
  isMobile: boolean
}) {
  const accent = site === 'ffnm' ? '#62438D' : '#085041'
  const adLabel = site === 'ffnm' ? 'Your ad here' : 'Your event here'
  const stripLabel =
    page === 'home'
      ? site === 'ffnm'
        ? 'Featured Businesses'
        : 'Featured Events'
      : site === 'ffnm'
      ? 'Featured in Los Angeles'
      : 'Featured Events in LA'
  const samples =
    site === 'ffnm'
      ? ["Nanay Gloria's", 'Manila Sunset']
      : ['Barrio Fiesta', 'Kapamilya Fest']
  const cols = isMobile ? 1 : page === 'home' ? 3 : 2

  return (
    <div className="px-2 py-2 bg-gray-50">
      {/* Featured strip */}
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[9px] font-bold text-gray-700">{stripLabel}</span>
        <span
          className="text-[7px] font-bold px-1.5 py-0.5 rounded-full text-white"
          style={{ background: accent }}
        >
          Sponsored
        </span>
      </div>

      <div
        className="grid gap-1 mb-1.5"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        <YourAdSlot label={adLabel} twoLine={cols === 3} />
        {cols >= 2 && <SampleCard name={samples[0]} accent={accent} />}
        {cols >= 3 && <SampleCard name={samples[1]} accent={accent} />}
      </div>

      {/* Swipe dots on mobile */}
      {isMobile && (
        <div className="flex justify-center gap-1 mb-1.5">
          <div className="w-2 h-1 rounded-full" style={{ background: '#D1880D' }} />
          <div className="w-1 h-1 rounded-full bg-gray-300" />
          <div className="w-1 h-1 rounded-full bg-gray-300" />
        </div>
      )}

      {/* Organic results — homepage only */}
      {page === 'home' && (
        <>
          <div className="border-t border-gray-200 my-1.5" />
          <p className="text-[7px] text-gray-400 mb-1">
            Organic results — not affected by sponsorship
          </p>
          <div className="grid grid-cols-3 gap-1">
            {[0, 1, 2].map((k) => (
              <div key={k} className="rounded border border-gray-200 h-7 bg-white" />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

const MOCKUP_CONFIGS = [
  {
    label: 'Homepage placement',
    site: 'ffnm' as const,
    page: 'home' as const,
    packages: 'Regional Spotlight + National Partner',
  },
  {
    label: 'City page placement',
    site: 'ffnm' as const,
    page: 'city' as const,
    packages: 'Local Hero + Regional Spotlight',
  },
  {
    label: 'Events homepage',
    site: 'fenm' as const,
    page: 'home' as const,
    packages: 'City Spotlight + Headliner',
  },
  {
    label: 'City events page',
    site: 'fenm' as const,
    page: 'city' as const,
    packages: 'Local Boost + City Spotlight',
  },
]

function MockupKBArticle() {
  return (
    <div className="rounded-xl border-2 border-gray-200 overflow-hidden shadow-sm">
      {/* Browser chrome */}
      <div className="flex items-center gap-1 px-2 py-1.5" style={{ background: 'linear-gradient(135deg,#62438D,#92345A)' }}>
        <div className="flex gap-0.5 mr-1">
          <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
        </div>
        <span className="text-[9px] font-bold text-white truncate">FilipinoFoodNearMe.org / cultural-knowledge-base</span>
      </div>

      {/* Article hero */}
      <div className="px-3 py-2" style={{ background: '#F9F5FF' }}>
        <div className="text-[8px] font-bold uppercase tracking-wide mb-1" style={{ color: '#62438D' }}>
          Cultural Knowledge Base
        </div>
        <div className="text-[10px] font-bold text-gray-900 leading-tight mb-1">
          The Long Life of Pancit: Filipino Noodle Culture
        </div>
        <div className="space-y-1">
          <div className="h-1.5 bg-gray-200 rounded w-full" />
          <div className="h-1.5 bg-gray-200 rounded w-4/5" />
        </div>
      </div>

      {/* Article body (simulated) */}
      <div className="px-3 py-2 bg-white">
        <div className="space-y-1 mb-2">
          <div className="h-1.5 bg-gray-100 rounded w-full" />
          <div className="h-1.5 bg-gray-100 rounded w-full" />
          <div className="h-1.5 bg-gray-100 rounded w-3/4" />
        </div>

        {/* Where to Try section */}
        <div className="rounded-lg p-2 mt-2" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
          <div className="text-[8px] font-bold text-gray-900 mb-1.5">Where to Try Pancit Near You</div>
          <div className="grid grid-cols-3 gap-1">
            {/* Sponsored card */}
            <div
              className="rounded p-1.5 flex flex-col gap-1"
              style={{ background: '#fff', border: '2px solid #FBBF24' }}
            >
              <span
                className="text-[6px] font-bold px-1 py-0.5 rounded-full self-start"
                style={{ background: '#FEF3C7', color: '#D1880D' }}
              >
                Featured Sponsor
              </span>
              {/* Logo placeholder */}
              <div
                className="rounded flex items-center justify-center h-4"
                style={{ border: '1px dashed #D1880D', background: '#FFFBEB' }}
              >
                <span className="text-[5px] font-bold" style={{ color: '#D1880D' }}>Your logo</span>
              </div>
              <div className="h-1 bg-gray-200 rounded w-full" />
              <div className="h-1 bg-gray-200 rounded w-3/4" />
              <div
                className="text-[5px] font-bold text-white text-center rounded px-1 py-0.5 mt-0.5"
                style={{ background: '#62438D' }}
              >
                View Listing
              </div>
            </div>
            {/* Organic cards */}
            {[0, 1].map((k) => (
              <div key={k} className="rounded p-1.5 flex flex-col gap-1" style={{ background: '#fff', border: '1px solid #e5e7eb' }}>
                <div className="h-1 bg-gray-200 rounded w-full" />
                <div className="h-1 bg-gray-200 rounded w-3/4" />
                <div className="h-1 bg-gray-100 rounded w-1/2" />
                <div className="h-3 bg-gray-100 rounded w-full mt-0.5" />
                <div
                  className="text-[5px] font-bold text-white text-center rounded px-1 py-0.5"
                  style={{ background: '#62438D' }}
                >
                  View Listing
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function PlacementPreviews() {
  const [open, setOpen] = useState(false)
  const [mobileViews, setMobileViews] = useState([false, false, false, false])

  const setView = (i: number, mobile: boolean) =>
    setMobileViews((prev) => prev.map((v, idx) => (idx === i ? mobile : v)))

  return (
    <div className="mb-8">
      {/* Gold badge above banner */}
      <div className="flex mb-2">
        <span
          className="text-xs font-bold px-3 py-1 rounded-full"
          style={{ background: '#D1880D', color: '#fff' }}
        >
          Preview your placement
        </span>
      </div>

      {/* Banner toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left transition-all"
        style={{
          background: 'linear-gradient(135deg,#62438D,#92345A)',
          borderRadius: open ? '12px 12px 0 0' : '12px',
          filter: 'brightness(1)',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.1)' }}
        onMouseLeave={(e) => { e.currentTarget.style.filter = 'brightness(1)' }}
      >
        <span className="text-base font-semibold text-white">
          👁️ See where your ad appears — click to preview
        </span>
        {open ? (
          <span
            className="text-xs font-bold px-3 py-1 rounded-full shrink-0 ml-3"
            style={{ background: '#62438D', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}
          >
            Collapse ▴
          </span>
        ) : (
          <span className="text-xl font-bold shrink-0 ml-3" style={{ color: '#D1880D' }}>
            ›
          </span>
        )}
      </button>

      {open && (
        <div
          className="p-6"
          style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderTop: '3px solid #D1880D',
            borderRadius: '0 0 12px 12px',
          }}
        >
          <p className="text-sm text-gray-500 mb-5">
            Your featured ad appears in dedicated sponsored slots — always clearly above organic results.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {MOCKUP_CONFIGS.slice(0, 2).map((m, i) => {
              const isMobile = mobileViews[i]
              const accent = '#62438D'
              const siteLabel = '🍽️ FilipinoFoodNearMe.org'

              return (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{siteLabel}</p>
                      <p className="text-sm font-semibold text-gray-800">{m.label}</p>
                    </div>
                    <div className="flex gap-1 shrink-0 mt-0.5">
                      {(['Desktop', 'Mobile'] as const).map((view) => {
                        const active = view === 'Mobile' ? isMobile : !isMobile
                        return (
                          <button
                            key={view}
                            type="button"
                            onClick={() => setView(i, view === 'Mobile')}
                            className="text-[10px] px-2 py-1 rounded-full font-semibold border transition-all"
                            style={{
                              background: active ? accent : 'transparent',
                              color: active ? '#fff' : '#6b7280',
                              borderColor: active ? accent : '#e5e7eb',
                            }}
                          >
                            {view}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <div
                    className="rounded-xl border-2 border-gray-200 overflow-hidden shadow-sm transition-all duration-200 mx-auto w-full"
                    style={{ maxWidth: isMobile ? '200px' : '100%' }}
                  >
                    <MockupTopbar site={m.site} />
                    <MockupHero site={m.site} page={m.page} />
                    <MockupBody site={m.site} page={m.page} isMobile={isMobile} />
                  </div>
                  <p className="text-xs text-gray-500">
                    <span className="font-semibold" style={{ color: accent }}>Included in:</span>{' '}{m.packages}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Cultural KB article preview */}
          <div className="mt-6 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">📚 FilipinoFoodNearMe.org — Cultural Knowledge Base</p>
            </div>
            <p className="text-sm font-semibold text-gray-800">Cultural Knowledge Base article</p>
            <p className="text-xs text-gray-500 mb-1">Your business featured in high-traffic educational content</p>
            <MockupKBArticle />
            <p className="text-xs text-gray-500">
              <span className="font-semibold" style={{ color: '#62438D' }}>Included in:</span>{' '}
              Regional Spotlight + Cultural KB, National Partner + Cultural KB, Heritage Sponsor
            </p>
            <p className="text-xs text-gray-400 italic">
              Sponsor a specific Cultural KB article and get featured in the &ldquo;Where to Try&rdquo; section reaching thousands of Filipino food enthusiasts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {MOCKUP_CONFIGS.slice(2).map((m, i) => {
              const isMobile = mobileViews[i + 2]
              const accent = '#085041'
              const siteLabel = '📅 FilipinoEventsNearMe.org'

              return (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{siteLabel}</p>
                      <p className="text-sm font-semibold text-gray-800">{m.label}</p>
                    </div>
                    <div className="flex gap-1 shrink-0 mt-0.5">
                      {(['Desktop', 'Mobile'] as const).map((view) => {
                        const active = view === 'Mobile' ? isMobile : !isMobile
                        return (
                          <button
                            key={view}
                            type="button"
                            onClick={() => setView(i + 2, view === 'Mobile')}
                            className="text-[10px] px-2 py-1 rounded-full font-semibold border transition-all"
                            style={{
                              background: active ? accent : 'transparent',
                              color: active ? '#fff' : '#6b7280',
                              borderColor: active ? accent : '#e5e7eb',
                            }}
                          >
                            {view}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <div
                    className="rounded-xl border-2 border-gray-200 overflow-hidden shadow-sm transition-all duration-200 mx-auto w-full"
                    style={{ maxWidth: isMobile ? '200px' : '100%' }}
                  >
                    <MockupTopbar site={m.site} />
                    <MockupHero site={m.site} page={m.page} />
                    <MockupBody site={m.site} page={m.page} isMobile={isMobile} />
                  </div>
                  <p className="text-xs text-gray-500">
                    <span className="font-semibold" style={{ color: accent }}>Included in:</span>{' '}{m.packages}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main wizard ────────────────────────────────────────────────────────────

export default function AdvertiseWizard() {
  const [step, setStep] = useState(1)
  const [site, setSite] = useState<Site>(null)
  const [selectedFfnm, setSelectedFfnm] = useState<FfnmPackage | null>(null)
  const [selectedFenm, setSelectedFenm] = useState<FenmPackage | null>(null)

  // Step 3 - Creative
  const [activeTab, setActiveTab] = useState<'ffnm' | 'fenm'>('ffnm')
  const [sameCreative, setSameCreative] = useState(true)
  const [businessNameFfnm, setBusinessNameFfnm] = useState('')
  const [descriptionFfnm, setDescriptionFfnm] = useState('')
  const [ctaFfnm, setCtaFfnm] = useState('View listing')
  const [imagesFfnm, setImagesFfnm] = useState<string[]>(['', '', '', ''])
  const [eventNameFenm, setEventNameFenm] = useState('')
  const [eventDateFenm, setEventDateFenm] = useState('')
  const [descriptionFenm, setDescriptionFenm] = useState('')
  const [ctaFenm, setCtaFenm] = useState('Get tickets')
  const [imagesFenm, setImagesFenm] = useState<string[]>(['', '', '', ''])

  // Step 4 - Links
  const [linkTypeFfnm, setLinkTypeFfnm] = useState('Website')
  const [destinationUrlFfnm, setDestinationUrlFfnm] = useState('')
  const [geoFfnm, setGeoFfnm] = useState('')
  const [linkTypeFenm, setLinkTypeFenm] = useState('Website')
  const [destinationUrlFenm, setDestinationUrlFenm] = useState('')
  const [geoFenm, setGeoFenm] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')

  // Step 3 - Cultural KB preferences (regional_kb, national_kb, heritage packages)
  const [kbArticle, setKbArticle] = useState('')
  const [kbTiming, setKbTiming] = useState('flexible')
  const [kbSpecialty, setKbSpecialty] = useState('')

  // UI state
  const [stepError, setStepError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')

  const isBundle = site === 'both'
  const { subtotal, bundleDiscount, total } = calculateOrderTotal(
    selectedFfnm,
    selectedFenm,
    isBundle
  )


  const validate = () => {
    if (step === 1 && !site) {
      setStepError('Please select where you want to advertise.')
      return false
    }
    if (step === 2) {
      if ((site === 'ffnm' || site === 'both') && !selectedFfnm) {
        setStepError('Please select a FilipinoFoodNearMe.org package.')
        return false
      }
      if ((site === 'fenm' || site === 'both') && !selectedFenm) {
        setStepError('Please select a FilipinoEventsNearMe.org package.')
        return false
      }
    }
    if (step === 3) {
      if ((site === 'ffnm' || site === 'both') && !businessNameFfnm.trim()) {
        setStepError('Please enter your business name.')
        return false
      }
      if ((site === 'fenm' || site === 'both') && !eventNameFenm.trim()) {
        setStepError('Please enter your event name.')
        return false
      }
      if (selectedFfnm?.val === 'heritage' && !kbArticle) {
        setStepError('Please select a Cultural KB article for the Heritage Sponsor package.')
        return false
      }
    }
    if (step === 4) {
      if (!contactName.trim()) {
        setStepError('Please enter your contact name.')
        return false
      }
      if (!contactEmail.trim()) {
        setStepError('Please enter your contact email.')
        return false
      }
    }
    setStepError('')
    return true
  }

  const next = () => {
    if (!validate()) return
    setStep((s) => Math.min(s + 1, 5))
  }

  const back = () => {
    setStepError('')
    setStep((s) => Math.max(s - 1, 1))
  }

  const handleCheckout = async () => {
    if (!contactName.trim() || !contactEmail.trim()) {
      setCheckoutError('Contact name and email are required.')
      return
    }
    setLoading(true)
    setCheckoutError('')

    const effectiveImagesFenm = sameCreative && site === 'both' ? imagesFfnm : imagesFenm
    const effectiveDescriptionFenm = sameCreative && site === 'both' ? descriptionFfnm : descriptionFenm

    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          sites: site,
          package_ffnm: selectedFfnm?.val || null,
          package_fenm: selectedFenm?.val || null,
          is_founding: true,
          is_bundle: isBundle,
          contact_email: contactEmail,
          contact_name: contactName,
          contact_phone: contactPhone,
          business_name_ffnm: businessNameFfnm,
          description_ffnm: descriptionFfnm,
          cta_ffnm: ctaFfnm,
          link_type_ffnm: linkTypeFfnm,
          destination_url_ffnm: destinationUrlFfnm,
          geo_ffnm: geoFfnm,
          event_name_fenm: eventNameFenm,
          event_date_fenm: eventDateFenm,
          description_fenm: effectiveDescriptionFenm,
          cta_fenm: ctaFenm,
          link_type_fenm: linkTypeFenm,
          destination_url_fenm: destinationUrlFenm,
          geo_fenm: geoFenm,
          images_ffnm: imagesFfnm.filter(Boolean),
          images_fenm: effectiveImagesFenm.filter(Boolean),
          kb_article: kbArticle || null,
          kb_timing: kbTiming || null,
          kb_specialty: kbSpecialty || null,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      window.location.href = data.url
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const updateImageFfnm = (i: number, url: string) => {
    setImagesFfnm((prev) => prev.map((v, idx) => (idx === i ? url : v)))
  }
  const updateImageFenm = (i: number, url: string) => {
    setImagesFenm((prev) => prev.map((v, idx) => (idx === i ? url : v)))
  }

  const utmFfnm = destinationUrlFfnm && businessNameFfnm
    ? `${destinationUrlFfnm}?utm_source=filipinofoodnearme&utm_medium=featured&utm_campaign=${toSlug(businessNameFfnm)}`
    : ''

  const utmFenm = destinationUrlFenm && eventNameFenm
    ? `${destinationUrlFenm}?utm_source=filipinoeventsnearm&utm_medium=featured&utm_campaign=${toSlug(eventNameFenm)}`
    : ''

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Founding Advertiser Banner */}
        <div
          className="rounded-xl px-5 py-4 mb-6 text-center"
          style={{ background: 'linear-gradient(135deg,#633806,#D1880D)' }}
        >
          <p className="font-semibold text-sm" style={{ color: '#FEF3C7' }}>
            🏅 Founding Advertiser Pricing — 30% off, locked in for life as long as your subscription stays active. Available for early supporters only.
          </p>
        </div>

        {/* Why advertise */}
        <WhyAdvertise />

        {/* Placement preview */}
        <PlacementPreviews />

        {/* Wizard card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <StepIndicator step={step} />

          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Where do you want to advertise?</h2>
              <p className="text-gray-500 mb-6">Choose one or both platforms</p>

              <div className="space-y-4">
                {/* FFNM */}
                <div
                  onClick={() => setSite('ffnm')}
                  className="cursor-pointer rounded-xl border-2 p-5 flex items-center gap-4 transition-all hover:shadow-md"
                  style={{
                    borderColor: site === 'ffnm' ? '#62438D' : '#e5e7eb',
                    background: site === 'ffnm' ? '#F3EEFF' : '#fff',
                  }}
                >
                  <span className="text-3xl">🍽️</span>
                  <div>
                    <p className="font-bold text-gray-900">FilipinoFoodNearMe.org</p>
                    <p className="text-sm text-gray-500">Feature your food business</p>
                  </div>
                </div>

                {/* FENM */}
                <div
                  onClick={() => setSite('fenm')}
                  className="cursor-pointer rounded-xl border-2 p-5 flex items-center gap-4 transition-all hover:shadow-md"
                  style={{
                    borderColor: site === 'fenm' ? '#085041' : '#e5e7eb',
                    background: site === 'fenm' ? '#ECFDF5' : '#fff',
                  }}
                >
                  <span className="text-3xl">📅</span>
                  <div>
                    <p className="font-bold text-gray-900">FilipinoEventsNearMe.org</p>
                    <p className="text-sm text-gray-500">Promote your event</p>
                  </div>
                </div>

                {/* Both */}
                <div
                  onClick={() => setSite('both')}
                  className="cursor-pointer rounded-xl border-2 p-5 flex items-center gap-4 transition-all hover:shadow-md"
                  style={{
                    borderColor: site === 'both' ? '#D1880D' : '#e5e7eb',
                    background: site === 'both' ? '#FFFBEB' : '#fff',
                  }}
                >
                  <span className="text-3xl">🌐</span>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">Both sites</p>
                    <p className="text-sm text-gray-500">Maximum reach across food + events</p>
                  </div>
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full shrink-0"
                    style={{ background: '#FEF3C7', color: '#D1880D' }}
                  >
                    💰 Save 15% bundle + 30% Founding rate
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Select your package</h2>
              <p className="text-gray-500 mb-6">All prices are Founding Advertiser rates — 30% off standard</p>

              <div className={site === 'both' ? 'grid md:grid-cols-2 gap-6' : ''}>
                {(site === 'ffnm' || site === 'both') && (
                  <div>
                    {site === 'both' && (
                      <p className="font-bold text-sm mb-3" style={{ color: '#62438D' }}>
                        🍽️ FilipinoFoodNearMe.org
                      </p>
                    )}
                    <div className="space-y-4">
                      {PACKAGES.ffnm.map((pkg) => (
                        <PackageCard
                          key={pkg.val}
                          pkg={pkg}
                          selected={selectedFfnm?.val === pkg.val}
                          color="violet"
                          onClick={() => setSelectedFfnm(pkg)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {(site === 'fenm' || site === 'both') && (
                  <div>
                    {site === 'both' && (
                      <p className="font-bold text-sm mb-3" style={{ color: '#085041' }}>
                        📅 FilipinoEventsNearMe.org
                      </p>
                    )}
                    <div className="space-y-4">
                      {PACKAGES.fenm.map((pkg) => (
                        <PackageCard
                          key={pkg.val}
                          pkg={pkg}
                          selected={selectedFenm?.val === pkg.val}
                          color="teal"
                          onClick={() => setSelectedFenm(pkg)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bundle summary */}
              {site === 'both' && selectedFfnm && selectedFenm && (
                <div
                  className="mt-6 rounded-xl p-5 border"
                  style={{ background: '#FFFBEB', borderColor: '#D1880D' }}
                >
                  <p className="font-bold text-gray-900 mb-3">Bundle Summary</p>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-gray-700">
                      <span>FilipinoFoodNearMe.org — {selectedFfnm.name}</span>
                      <span>${selectedFfnm.foundingPrice}/mo</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>FilipinoEventsNearMe.org — {selectedFenm.name}</span>
                      <span>${selectedFenm.foundingPrice}/event</span>
                    </div>
                    <div className="flex justify-between font-semibold" style={{ color: '#D1880D' }}>
                      <span>Bundle discount (15%)</span>
                      <span>−${bundleDiscount}</span>
                    </div>
                    <div className="flex justify-between font-bold text-base pt-1 border-t border-yellow-200">
                      <span>Total</span>
                      <span style={{ color: '#62438D' }}>${total}</span>
                    </div>
                  </div>
                  <p className="text-xs mt-3 font-semibold" style={{ color: '#D1880D' }}>
                    🔒 Founding rates applied
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload your creative</h2>
              <p className="text-gray-500 mb-6">Images, copy, and CTA for your ad</p>

              {/* Tab for both sites */}
              {site === 'both' && (
                <div className="mb-6">
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => setActiveTab('ffnm')}
                      className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
                      style={{
                        background: activeTab === 'ffnm' ? '#62438D' : '#f3f4f6',
                        color: activeTab === 'ffnm' ? '#fff' : '#374151',
                      }}
                    >
                      🍽️ FilipinoFoodNearMe.org
                    </button>
                    <button
                      onClick={() => setActiveTab('fenm')}
                      className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
                      style={{
                        background: activeTab === 'fenm' ? '#085041' : '#f3f4f6',
                        color: activeTab === 'fenm' ? '#fff' : '#374151',
                      }}
                    >
                      📅 FilipinoEventsNearMe.org
                    </button>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={sameCreative}
                      onChange={(e) => setSameCreative(e.target.checked)}
                      className="rounded"
                    />
                    Use same images and copy on both sites
                  </label>
                </div>
              )}

              {/* FFNM creative */}
              {(site === 'ffnm' || (site === 'both' && activeTab === 'ffnm')) && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Business name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={50}
                      value={businessNameFfnm}
                      onChange={(e) => setBusinessNameFfnm(e.target.value)}
                      placeholder="Your business name"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Description <span className="text-gray-400">(optional)</span>
                    </label>
                    <textarea
                      maxLength={120}
                      value={descriptionFfnm}
                      onChange={(e) => setDescriptionFfnm(e.target.value)}
                      placeholder="Short tagline or description"
                      rows={2}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                    />
                    <p className="text-xs text-gray-400 text-right">{descriptionFfnm.length}/120</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      CTA button text <span className="text-gray-400">(optional, max 20 chars)</span>
                    </label>
                    <input
                      type="text"
                      maxLength={20}
                      value={ctaFfnm}
                      onChange={(e) => setCtaFfnm(e.target.value)}
                      placeholder="View listing"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">Images</p>
                    <div className="grid grid-cols-2 gap-3">
                      {IMAGE_SLOTS.map((slot, i) => (
                        <ImageUploadSlot
                          key={i}
                          slot={slot}
                          slotIndex={i}
                          url={imagesFfnm[i]}
                          onUpload={(url) => updateImageFfnm(i, url)}
                          onRemove={() => updateImageFfnm(i, '')}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-3">
                      📐 Not sure about image sizes? Upload anything — a simple crop tool will help you adjust before going live.
                    </p>
                  </div>
                </div>
              )}

              {/* FENM creative */}
              {(site === 'fenm' || (site === 'both' && activeTab === 'fenm')) && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Event name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={50}
                      value={eventNameFenm}
                      onChange={(e) => setEventNameFenm(e.target.value)}
                      placeholder="Your event name"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Event date &amp; venue
                    </label>
                    <input
                      type="text"
                      value={eventDateFenm}
                      onChange={(e) => setEventDateFenm(e.target.value)}
                      placeholder="e.g. June 15, 2026 · Manila Garden Ballroom"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                  </div>

                  {!(sameCreative && site === 'both') && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Description <span className="text-gray-400">(optional)</span>
                      </label>
                      <textarea
                        maxLength={120}
                        value={descriptionFenm}
                        onChange={(e) => setDescriptionFenm(e.target.value)}
                        placeholder="Short event description"
                        rows={2}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
                      />
                      <p className="text-xs text-gray-400 text-right">{descriptionFenm.length}/120</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      CTA button text <span className="text-gray-400">(optional, max 20 chars)</span>
                    </label>
                    <input
                      type="text"
                      maxLength={20}
                      value={ctaFenm}
                      onChange={(e) => setCtaFenm(e.target.value)}
                      placeholder="Get tickets"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                  </div>

                  {!(sameCreative && site === 'both') && (
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-3">Images</p>
                      <div className="grid grid-cols-2 gap-3">
                        {IMAGE_SLOTS.map((slot, i) => (
                          <ImageUploadSlot
                            key={i}
                            slot={slot}
                            slotIndex={i}
                            url={imagesFenm[i]}
                            onUpload={(url) => updateImageFenm(i, url)}
                            onRemove={() => updateImageFenm(i, '')}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-3">
                        📐 Not sure about image sizes? Upload anything — a simple crop tool will help you adjust before going live.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Cultural KB Preferences — only for KB packages */}
              {selectedFfnm && ['regional_kb', 'national_kb', 'heritage'].includes(selectedFfnm.val) && (
                <div className="mt-8 p-5 rounded-xl border-2 border-amber-200 bg-amber-50 space-y-5">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-0.5">📚 Cultural Knowledge Base Preferences</h3>
                    <p className="text-xs text-gray-500">
                      Tell us which article you&rsquo;d like to be featured in. Not sure yet? You can finalize article selection via email after checkout.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Which Cultural KB article interests you?{' '}
                      {selectedFfnm.val === 'heritage' && <span className="text-red-500">*</span>}
                      {selectedFfnm.val !== 'heritage' && <span className="text-gray-400">(optional)</span>}
                    </label>
                    <select
                      value={kbArticle}
                      onChange={(e) => setKbArticle(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 bg-white"
                      style={{ focusRingColor: '#D1880D' } as React.CSSProperties}
                    >
                      <option value="">Select an article…</option>
                      <option>New Wave Filipino-American Cuisine</option>
                      <option>Regional Masterpieces</option>
                      <option>Ultimate Sawsawan Guide</option>
                      <option>Beyond Ube: Filipino Desserts</option>
                      <option>Golden Crunch Lumpia</option>
                      <option>Balut, Betamax &amp; Beyond</option>
                      <option>Long Life of Pancit</option>
                      <option>Sour Power and Sawsawan</option>
                      <option>Tapestry of Tastes</option>
                      <option>Sabaw Season</option>
                      <option>Filipino Food Month Guide</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Preferred spotlight timing
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { val: 'this_quarter', label: 'This Quarter' },
                        { val: 'next_quarter', label: 'Next Quarter' },
                        { val: 'flexible', label: 'Flexible' },
                      ].map((opt) => (
                        <label key={opt.val} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="kbTiming"
                            value={opt.val}
                            checked={kbTiming === opt.val}
                            onChange={() => setKbTiming(opt.val)}
                            className="accent-amber-500"
                          />
                          <span className="text-sm text-gray-700">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      What specialty aligns with this article?{' '}
                      <span className="text-gray-400">(optional, max 80 chars)</span>
                    </label>
                    <input
                      type="text"
                      maxLength={80}
                      value={kbSpecialty}
                      onChange={(e) => setKbSpecialty(e.target.value)}
                      placeholder="e.g. We specialize in traditional Ilocano cuisine"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                    <p className="text-xs text-gray-400 text-right mt-0.5">{kbSpecialty.length}/80</p>
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-500 mt-6 p-3 bg-gray-50 rounded-lg">
                ✏️ 2 free creative swaps included per billing period (1 swap for event packages). Additional changes via email within 1 business day.
              </p>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Destination links + contact</h2>
              <p className="text-gray-500 mb-6">Where should your ad send people?</p>

              {(site === 'ffnm' || site === 'both') && (
                <div className="mb-6 p-5 rounded-xl border border-gray-200 space-y-4">
                  <p className="font-bold text-sm" style={{ color: '#62438D' }}>🍽️ FilipinoFoodNearMe.org link</p>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Link type</label>
                    <div className="flex flex-wrap gap-2">
                      {LINK_TYPES.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setLinkTypeFfnm(t)}
                          className="px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-all"
                          style={{
                            borderColor: linkTypeFfnm === t ? '#62438D' : '#e5e7eb',
                            background: linkTypeFfnm === t ? '#F3EEFF' : '#fff',
                            color: linkTypeFfnm === t ? '#62438D' : '#374151',
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">URL</label>
                    <input
                      type="url"
                      value={destinationUrlFfnm}
                      onChange={(e) => setDestinationUrlFfnm(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  {utmFfnm && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Your tracked URL:</p>
                      <p className="font-mono text-xs p-2 rounded bg-yellow-50 break-all" style={{ color: '#D1880D' }}>
                        {utmFfnm}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Geographic target</label>
                    <input
                      type="text"
                      value={geoFfnm}
                      onChange={(e) => setGeoFfnm(e.target.value)}
                      placeholder="e.g. Los Angeles, CA"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    {selectedFfnm && GEO_HINTS_FFNM[selectedFfnm.val] && (
                      <p className="text-xs text-gray-400 mt-1">{GEO_HINTS_FFNM[selectedFfnm.val]}</p>
                    )}
                  </div>
                </div>
              )}

              {(site === 'fenm' || site === 'both') && (
                <div className="mb-6 p-5 rounded-xl border border-gray-200 space-y-4">
                  <p className="font-bold text-sm" style={{ color: '#085041' }}>📅 FilipinoEventsNearMe.org link</p>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Link type</label>
                    <div className="flex flex-wrap gap-2">
                      {LINK_TYPES.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setLinkTypeFenm(t)}
                          className="px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-all"
                          style={{
                            borderColor: linkTypeFenm === t ? '#085041' : '#e5e7eb',
                            background: linkTypeFenm === t ? '#ECFDF5' : '#fff',
                            color: linkTypeFenm === t ? '#085041' : '#374151',
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">URL</label>
                    <input
                      type="url"
                      value={destinationUrlFenm}
                      onChange={(e) => setDestinationUrlFenm(e.target.value)}
                      placeholder="https://yourticketlink.com"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                  </div>

                  {utmFenm && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Your tracked URL:</p>
                      <p className="font-mono text-xs p-2 rounded bg-yellow-50 break-all" style={{ color: '#D1880D' }}>
                        {utmFenm}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Geographic target</label>
                    <input
                      type="text"
                      value={geoFenm}
                      onChange={(e) => setGeoFenm(e.target.value)}
                      placeholder="e.g. San Francisco Bay Area"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                    {selectedFenm && GEO_HINTS_FENM[selectedFenm.val] && (
                      <p className="text-xs text-gray-400 mt-1">{GEO_HINTS_FENM[selectedFenm.val]}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Contact */}
              <div className="p-5 rounded-xl border border-gray-200 space-y-4">
                <p className="font-bold text-sm text-gray-700">Contact details (for delivery reports)</p>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Your name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Full name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Phone <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & checkout</h2>
              <p className="text-gray-500 mb-6">Confirm your order before paying</p>

              <div className="space-y-4 mb-6">
                {selectedFfnm && (
                  <div className="rounded-xl border border-gray-200 overflow-hidden">
                    <div
                      className="p-4 text-white text-sm font-bold"
                      style={{ background: 'linear-gradient(135deg,#62438D 0%,#92345A 40%,#BF2F26 100%)' }}
                    >
                      🍽️ FilipinoFoodNearMe.org
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Package</span>
                        <span className="text-sm font-semibold">{selectedFfnm.name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Price</span>
                        <span>
                          <span className="line-through text-gray-400 text-xs mr-2">${selectedFfnm.standardPrice}/mo</span>
                          <span className="font-bold" style={{ color: '#62438D' }}>${selectedFfnm.foundingPrice}/mo</span>
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Coverage</span>
                        <span className="text-sm">{selectedFfnm.geo}</span>
                      </div>
                      {businessNameFfnm && (
                        <div className="mt-3 p-3 rounded-lg text-white text-sm" style={{ background: 'linear-gradient(135deg,#62438D,#BF2F26)' }}>
                          <p className="font-bold">{businessNameFfnm}</p>
                          {descriptionFfnm && <p className="text-xs opacity-90 mt-1">{descriptionFfnm}</p>}
                          {ctaFfnm && (
                            <span className="inline-block mt-2 text-xs bg-white px-3 py-1 rounded-full font-semibold" style={{ color: '#62438D' }}>
                              {ctaFfnm}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedFenm && (
                  <div className="rounded-xl border border-gray-200 overflow-hidden">
                    <div
                      className="p-4 text-white text-sm font-bold"
                      style={{ background: 'linear-gradient(135deg,#085041 0%,#1D9E75 100%)' }}
                    >
                      📅 FilipinoEventsNearMe.org
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Package</span>
                        <span className="text-sm font-semibold">{selectedFenm.name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Price</span>
                        <span>
                          <span className="line-through text-gray-400 text-xs mr-2">${selectedFenm.standardPrice}/event</span>
                          <span className="font-bold" style={{ color: '#085041' }}>${selectedFenm.foundingPrice}/event</span>
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Coverage</span>
                        <span className="text-sm">{selectedFenm.geo}</span>
                      </div>
                      {eventNameFenm && (
                        <div className="mt-3 p-3 rounded-lg text-white text-sm" style={{ background: 'linear-gradient(135deg,#085041,#1D9E75)' }}>
                          <p className="font-bold">{eventNameFenm}</p>
                          {eventDateFenm && <p className="text-xs opacity-90 mt-0.5">{eventDateFenm}</p>}
                          {ctaFenm && (
                            <span className="inline-block mt-2 text-xs bg-white px-3 py-1 rounded-full font-semibold" style={{ color: '#085041' }}>
                              {ctaFenm}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Pricing breakdown */}
              {isBundle && selectedFfnm && selectedFenm && (
                <div className="rounded-xl p-4 mb-6 border" style={{ background: '#FFFBEB', borderColor: '#D1880D' }}>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-gray-700">
                      <span>FilipinoFoodNearMe.org — {selectedFfnm.name}</span>
                      <span>${selectedFfnm.foundingPrice}/mo</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>FilipinoEventsNearMe.org — {selectedFenm.name}</span>
                      <span>${selectedFenm.foundingPrice}/event</span>
                    </div>
                    <div className="flex justify-between font-semibold" style={{ color: '#D1880D' }}>
                      <span>Bundle discount (15%): Save ${bundleDiscount}</span>
                      <span>−${bundleDiscount}</span>
                    </div>
                    <div className="flex justify-between font-bold text-base pt-1 border-t border-yellow-200">
                      <span>Total</span>
                      <span style={{ color: '#62438D' }}>${total}</span>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-sm font-semibold mb-6" style={{ color: '#D1880D' }}>
                🔒 Founding rate locked in — stays this price as long as your subscription remains active
              </p>

              {checkoutError && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {checkoutError}
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full py-4 rounded-full text-white font-bold text-lg shadow-lg transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-3"
                style={{ background: 'linear-gradient(135deg,#62438D 0%,#92345A 40%,#BF2F26 100%)' }}
              >
                {loading && (
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {loading ? 'Redirecting to Stripe...' : 'Pay & Submit'}
              </button>
            </div>
          )}

          {/* Error */}
          {stepError && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {stepError}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={back}
              disabled={step === 1}
              className="px-6 py-2.5 rounded-full border-2 font-semibold text-sm transition-all disabled:opacity-30"
              style={{ borderColor: '#62438D', color: '#62438D' }}
            >
              ← Back
            </button>

            {step < 5 && (
              <button
                onClick={next}
                className="px-8 py-2.5 rounded-full font-semibold text-sm text-white transition-all hover:opacity-90"
                style={{ background: '#62438D' }}
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
