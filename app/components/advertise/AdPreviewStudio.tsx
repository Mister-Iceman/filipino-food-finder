'use client'

import { useState } from 'react'

const MAX_INPUT   = 30
const MAX_DISPLAY = 20

// ── Shared browser chrome ─────────────────────────────────────────────────────
function BrowserChrome({ url }: { url: string }) {
  return (
    <div className="bg-gray-100 px-3 py-1.5 flex items-center gap-1.5 border-b border-gray-200 flex-shrink-0">
      <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
      <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
      <div className="ml-2 flex-1 bg-white rounded-full px-2 py-0.5 text-gray-400 text-[9px] truncate">
        {url}
      </div>
    </div>
  )
}

// ── Mockup wrapper card ───────────────────────────────────────────────────────
function MockupCard({
  index,
  label,
  price,
  children,
}: {
  index:    number
  label:    string
  price:    string
  children: React.ReactNode
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
        Placement {index} of 6
      </p>
      <div className="inline-flex items-center gap-1.5 mb-3 bg-[#0038A8] text-white text-[11px] font-bold px-3 py-1 rounded-full">
        {label}
      </div>
      <div className="relative pb-4">
        <div className="border-2 border-gray-100 rounded-xl overflow-hidden shadow-lg bg-white select-none">
          {children}
        </div>
        {/* Price badge */}
        <div className="absolute -bottom-1 -right-1 bg-[#0038A8] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
          {price}
        </div>
      </div>
    </div>
  )
}

// ── The main component ────────────────────────────────────────────────────────
export default function AdPreviewStudio() {
  const [brand, setBrand] = useState('')
  const b = brand.trim().slice(0, MAX_DISPLAY) || 'Your Brand'

  return (
    <section id="preview" className="py-20 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">

        {/* ── Heading ──────────────────────────────────────────────────────── */}
        <div className="text-center mb-12">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#0038A8] mb-2">
            Interactive Preview
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            See Your Brand in Action
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed mb-8">
            Type your brand name below and watch it appear across all placements in real time.
          </p>

          {/* Input */}
          <div className="max-w-sm mx-auto">
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value.slice(0, MAX_INPUT))}
              placeholder="Type your brand name here..."
              maxLength={MAX_INPUT}
              className="w-full px-5 py-4 text-base border-2 border-gray-200 rounded-xl text-center
                         focus:outline-none focus:border-[#FCD116] focus:ring-4 focus:ring-[#FCD116]/20
                         transition-all placeholder-gray-400 font-medium"
            />
            <p className="text-[11px] text-gray-400 text-right mt-1.5 pr-1">
              {brand.length}/{MAX_INPUT}
            </p>
          </div>
        </div>

        {/* ── 6 Mockup Grid ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-14">

          {/* ── 1. Homepage Hero Banner ───────────────────────────────────── */}
          <MockupCard index={1} label="Homepage Hero Banner" price="From $299/mo">
            <BrowserChrome url="filipinoeventsnearne.org" />
            {/* Nav bar */}
            <div className="bg-[#0038A8] px-4 py-2 flex items-center justify-between">
              <span className="text-white font-bold text-[11px]">
                🇵🇭 FilipinoEventsNearMe.org
              </span>
              <div className="flex gap-3">
                <span className="text-white/60 text-[9px]">Events</span>
                <span className="text-white/60 text-[9px]">Cities</span>
              </div>
            </div>
            {/* Sponsor ribbon */}
            <div className="bg-[#FCD116] px-4 py-2 text-center border-b border-yellow-400">
              <span className="text-[11px] font-bold text-gray-900">
                Proudly presented by{' '}
                <span className="underline decoration-gray-700">{b}</span>
              </span>
            </div>
            {/* Hero */}
            <div className="bg-gradient-to-br from-[#0038A8] via-blue-800 to-blue-900 px-4 py-8 text-center">
              <p className="text-white font-bold text-sm mb-1">Filipino Events Near You</p>
              <p className="text-blue-200 text-[10px] mb-4">Festivals · Fiestas · Cultural Gatherings</p>
              <div className="bg-[#FCD116] text-gray-900 text-[10px] font-bold px-5 py-1.5 rounded-full inline-block">
                Browse Events →
              </div>
            </div>
          </MockupCard>

          {/* ── 2. Category Page Sponsor ──────────────────────────────────── */}
          <MockupCard index={2} label="Category Page Sponsor" price="From $199/mo">
            <BrowserChrome url="filipinoeventsnearne.org/category/festivals-fiestas" />
            <div className="bg-[#0038A8] px-4 py-2">
              <span className="text-white font-bold text-[11px]">🇵🇭 FilipinoEventsNearMe.org</span>
            </div>
            {/* Category hero */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 px-4 py-4">
              <p className="text-white font-bold text-sm">🎉 Festivals &amp; Fiestas</p>
              <p className="text-white/70 text-[10px] mt-0.5">123 upcoming events nationwide</p>
            </div>
            {/* Sponsor ribbon */}
            <div className="bg-yellow-50 border-y border-yellow-200 px-4 py-2.5 flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center text-[8px] text-gray-400 flex-shrink-0 font-medium">
                LOGO
              </div>
              <div>
                <p className="text-[9px] text-gray-400 leading-none mb-0.5">Presented by</p>
                <p className="text-[12px] font-bold text-[#0038A8] leading-none">{b}</p>
              </div>
            </div>
            {/* Event list */}
            <div className="px-4 py-3 space-y-1.5">
              {[
                'Pistahan Festival · San Francisco, CA',
                'Barrio Fiesta · Los Angeles, CA',
                'Cultural Night · Chicago, IL',
              ].map((e) => (
                <div key={e} className="flex items-center gap-2 bg-gray-50 rounded-lg px-2.5 py-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0038A8] flex-shrink-0" />
                  <span className="text-[9px] text-gray-600 truncate">{e}</span>
                </div>
              ))}
            </div>
          </MockupCard>

          {/* ── 3. City Page Sponsor ──────────────────────────────────────── */}
          <MockupCard index={3} label="City Page Sponsor" price="From $249/mo">
            <BrowserChrome url="filipinoeventsnearne.org/city/los-angeles" />
            <div className="bg-[#0038A8] px-4 py-2">
              <span className="text-white font-bold text-[11px]">🇵🇭 FilipinoEventsNearMe.org</span>
            </div>
            {/* City hero */}
            <div className="bg-gradient-to-r from-[#0038A8] to-blue-700 px-4 py-4">
              <p className="text-white font-bold text-sm">Filipino Los Angeles</p>
              <p className="text-blue-200 text-[10px] mt-0.5">48 upcoming events</p>
            </div>
            {/* Sponsor card */}
            <div className="mx-4 my-3 border-2 border-[#FCD116] rounded-xl p-3.5">
              <p className="text-[9px] text-gray-400 mb-2">This city guide is brought to you by</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center text-[8px] text-gray-400 flex-shrink-0 font-medium">
                  LOGO
                </div>
                <div>
                  <p className="text-[12px] font-bold text-gray-900">{b}</p>
                  <p className="text-[9px] text-gray-500">Supporting the FilAm community</p>
                </div>
              </div>
            </div>
            <p className="text-center text-[9px] text-gray-400 pb-3">Events this weekend ↓</p>
          </MockupCard>

          {/* ── 4. Featured Event Card ────────────────────────────────────── */}
          <MockupCard index={4} label="Featured Event Card" price="$99/event">
            <div className="p-4">
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-3">
                Event results — stand out from the crowd
              </p>
              <div className="grid grid-cols-2 gap-3">
                {/* Regular card */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="h-14 bg-gradient-to-br from-gray-100 to-gray-200" />
                  <div className="p-2.5">
                    <p className="text-[9px] font-semibold text-gray-700 leading-snug">
                      Cultural Night 2026
                    </p>
                    <p className="text-[8px] text-gray-400 mt-0.5">Los Angeles, CA</p>
                    <p className="text-[8px] text-gray-400">Mar 15</p>
                  </div>
                </div>
                {/* Featured card */}
                <div className="border-2 border-[#FCD116] rounded-xl overflow-hidden shadow-md relative">
                  <div className="absolute top-1.5 left-1.5 z-10">
                    <span className="bg-[#FCD116] text-gray-900 text-[8px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                      ⭐ Featured
                    </span>
                  </div>
                  <div className="h-14 bg-gradient-to-br from-[#0038A8] to-blue-700" />
                  <div className="p-2.5">
                    <p className="text-[9px] font-bold text-gray-900 leading-snug">
                      Pistahan Festival
                    </p>
                    <p className="text-[8px] text-gray-500 mt-0.5">San Francisco, CA</p>
                    <p className="text-[8px] text-gray-500">Aug 10</p>
                  </div>
                  <div className="bg-[#FCD116]/15 border-t border-[#FCD116]/40 px-2.5 py-1.5">
                    <p className="text-[9px] font-bold text-[#0038A8] truncate">
                      Sponsored by {b}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </MockupCard>

          {/* ── 5. Event Detail Page Banner ───────────────────────────────── */}
          <MockupCard index={5} label="Event Detail Page Banner" price="From $199/mo">
            <BrowserChrome url="filipinoeventsnearne.org/events/pistahan-festival" />
            <div className="bg-[#0038A8] px-4 py-2">
              <span className="text-white font-bold text-[11px]">🇵🇭 FilipinoEventsNearMe.org</span>
            </div>
            {/* Event header */}
            <div className="px-4 pt-3.5 pb-2.5">
              <p className="text-[9px] text-orange-500 font-bold uppercase tracking-wide mb-1">
                🎉 Festivals &amp; Fiestas
              </p>
              <p className="text-[13px] font-bold text-gray-900 leading-tight mb-1">
                Pistahan Parade &amp; Festival 2026
              </p>
              <p className="text-[9px] text-gray-500">Aug 10, 2026 · San Francisco, CA</p>
            </div>
            {/* Sponsor banner */}
            <div className="mx-4 mb-4 bg-[#0038A8] rounded-xl px-4 py-3">
              <p className="text-[9px] text-blue-300 mb-2">This event is supported by</p>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center text-[8px] text-white/50 flex-shrink-0 font-medium">
                  LOGO
                </div>
                <div>
                  <p className="text-[12px] font-bold text-[#FCD116] leading-none mb-0.5">{b}</p>
                  <p className="text-[9px] text-blue-200">Supporting Filipino-American culture</p>
                </div>
              </div>
            </div>
          </MockupCard>

          {/* ── 6. Newsletter Sponsor Block ───────────────────────────────── */}
          <MockupCard index={6} label="Weekly Newsletter Sponsor" price="From $75/send">
            {/* Email header */}
            <div className="bg-[#0038A8] px-4 py-3 text-center">
              <p className="text-white font-bold text-[12px]">
                <img
                  src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f1f5-1f1ed.svg"
                  alt=""
                  className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5"
                  aria-hidden="true"
                />
                FilAm Weekend Guide
              </p>
              <p className="text-blue-200 text-[9px] mt-0.5">Your weekly Filipino community digest</p>
            </div>
            {/* Gold divider */}
            <div className="h-0.5 bg-gradient-to-r from-transparent via-[#FCD116] to-transparent" />
            {/* Sponsor block */}
            <div className="bg-yellow-50/60 border-b border-yellow-100 px-4 py-3.5">
              <p className="text-[9px] text-gray-500 text-center mb-3">
                This week's newsletter is brought to you by
              </p>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-[8px] text-gray-400 flex-shrink-0 font-medium">
                  LOGO
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-gray-900 truncate">{b}</p>
                  <p className="text-[9px] text-gray-500">Your tagline goes here</p>
                </div>
              </div>
              <div className="text-center">
                <span className="bg-[#0038A8] text-white text-[9px] font-bold px-4 py-1.5 rounded-full inline-block cursor-default">
                  Learn More →
                </span>
              </div>
            </div>
            {/* Gold divider */}
            <div className="h-0.5 bg-gradient-to-r from-transparent via-[#FCD116] to-transparent" />
            {/* Newsletter preview */}
            <div className="px-4 py-3 space-y-1.5">
              <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-widest mb-2">
                This Week
              </p>
              {[
                '🎉 Pistahan Festival — San Francisco',
                '🕯️ Simbang Gabi — Los Angeles',
                '🍜 New FilAm restaurant opens in Chicago',
              ].map((item) => (
                <p key={item} className="text-[9px] text-gray-600">{item}</p>
              ))}
            </div>
          </MockupCard>

        </div>

        {/* ── CTA below mockups ────────────────────────────────────────────── */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-xl font-bold text-gray-900 mb-2">Ready to see your brand here?</p>
          <p className="text-gray-500 text-sm mb-6">
            All placements are exclusive — one sponsor per city, category, or season.
          </p>
          <a
            href="#packages"
            className="inline-block bg-[#0038A8] hover:bg-blue-900 text-white font-bold px-10 py-3.5 rounded-xl text-base transition-colors"
          >
            View Packages →
          </a>
        </div>

      </div>
    </section>
  )
}
