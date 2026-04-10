import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const categoryColors: Record<string, string> = {
  'festival':                 'bg-purple-100 text-purple-800',
  'grand-opening':            'bg-green-100 text-green-800',
  'pop-up':                   'bg-yellow-100 text-yellow-800',
  'cooking-class':            'bg-orange-100 text-orange-800',
  'community-event':          'bg-blue-100 text-blue-800',
  'tasting-demo':             'bg-pink-100 text-pink-800',
  'grand_opening':            'bg-green-100 text-green-800',
  'pop_up':                   'bg-yellow-100 text-yellow-800',
  'cooking_class':            'bg-orange-100 text-orange-800',
  'community':                'bg-blue-100 text-blue-800',
  'tasting':                  'bg-pink-100 text-pink-800',
  'food-markets':             'bg-orange-100 text-orange-800',
  'festivals-fiestas':        'bg-purple-100 text-purple-800',
  'culture-heritage':         'bg-blue-100 text-blue-800',
  'faith-tradition':          'bg-indigo-100 text-indigo-800',
  'arts-music-entertainment': 'bg-pink-100 text-pink-800',
  'community-family':         'bg-green-100 text-green-800',
  'business-networking':      'bg-gray-100 text-gray-800',
  'sports-wellness':          'bg-teal-100 text-teal-800',
}

const categoryLabels: Record<string, string> = {
  'festival':                 '🎉 Festival',
  'grand-opening':            '🎊 Grand Opening',
  'pop-up':                   '🍱 Pop-Up',
  'cooking-class':            '👨‍🍳 Cooking Class',
  'community-event':          '🤝 Community Event',
  'tasting-demo':             '🍴 Tasting & Demo',
  'grand_opening':            '🎊 Grand Opening',
  'pop_up':                   '🍱 Pop-Up',
  'cooking_class':            '👨‍🍳 Cooking Class',
  'community':                '🤝 Community Event',
  'tasting':                  '🍴 Tasting & Demo',
  'food-markets':             '🍽️ Food & Markets',
  'festivals-fiestas':        '🎉 Festivals & Fiestas',
  'culture-heritage':         '🏛️ Culture & Heritage',
  'faith-tradition':          '⛪ Faith & Tradition',
  'arts-music-entertainment': '🎭 Arts, Music & Ent.',
  'community-family':         '👨‍👩‍👧 Community & Family',
  'business-networking':      '💼 Business & Networking',
  'sports-wellness':          '🏅 Sports & Wellness',
}

function formatDate(date: string) {
  const [year, month, day] = date.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatTime(time: string) {
  const [hourStr, minuteStr] = time.split(':')
  const hour = parseInt(hourStr, 10)
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  return `${displayHour}:${minuteStr} ${period}`
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: event } = await supabase
    .from('fenm_events')
    .select('*')
    .eq('id', id)
    .single()

  if (!event) return { title: 'Event Not Found' }

  const description = event.description
    ? event.description.slice(0, 160)
    : `Join us for ${event.title}`

  return {
    title: `${event.title} | Filipino Food Events`,
    description,
    alternates: {
      canonical: `https://www.filipinofoodnearme.org/events/${id}`,
    },
    openGraph: {
      title: event.title,
      description,
      ...(event.image_url ? { images: [{ url: event.image_url }] } : {}),
    },
  }
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: event } = await supabase
    .from('fenm_events')
    .select('*')
    .eq('id', id)
    .single()

  if (!event) notFound()

  const startDate = event.start_date
  const startTime = event.start_time
  const endDate = event.end_date
  const venueName = event.venue_name
  const address = event.address

  const priceLabel = (() => {
    if (event.is_free) return null
    if (event.price_min != null && event.price_max != null) {
      return `$${event.price_min}–$${event.price_max}`
    }
    if (event.price_min != null) return `From $${event.price_min}`
    if (event.price_max != null) return `Up to $${event.price_max}`
    return null
  })()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/events" className="text-blue-600 hover:underline mb-6 inline-block">
          ← Back to Events
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {event.image_url && (
            <div className="h-80 md:h-96 overflow-hidden">
              <img
                src={event.image_url}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {event.is_featured && (
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold px-4 py-1.5 rounded-full">
                  ⭐ FEATURED
                </span>
              )}
              {event.category && categoryLabels[event.category] && (
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${categoryColors[event.category] ?? 'bg-gray-100 text-gray-800'}`}>
                  {categoryLabels[event.category]}
                </span>
              )}
              {event.is_free ? (
                <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                  ✅ Free Admission
                </span>
              ) : priceLabel ? (
                <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                  🎟️ Ticketed · {priceLabel}
                </span>
              ) : (
                <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                  🎟️ Ticketed Event
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{event.title}</h1>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Left: Date + Location */}
              <div className="space-y-5">
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Date &amp; Time</h3>
                  <p className="text-gray-900 font-medium">
                    📅 {formatDate(startDate)}
                  </p>
                  {startTime && (
                    <p className="text-gray-600">🕐 {formatTime(startTime)}</p>
                  )}
                  {endDate && endDate !== startDate && (
                    <p className="text-gray-500 text-sm mt-1">Ends: {formatDate(endDate)}</p>
                  )}
                </div>

                {(venueName || address || event.city) && (
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Location</h3>
                    {venueName && <p className="text-gray-900 font-medium">📍 {venueName}</p>}
                    {address && <p className="text-gray-600">{address}</p>}
                    {event.city && event.state && (
                      <p className="text-gray-600">{event.city}, {event.state}{event.zip ? ` ${event.zip}` : ''}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Right: Action buttons */}
              <div className="space-y-3 flex flex-col justify-start">
                {event.ticket_url && (
                  <a
                    href={event.ticket_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center px-6 py-4 rounded-lg font-bold text-lg transition-colors"
                  >
                    Get Tickets →
                  </a>
                )}
              </div>
            </div>

            {event.description && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{event.description}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/events" className="text-blue-600 hover:underline">
            ← Back to All Events
          </Link>
        </div>

        <div className="mt-12 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50 p-8 text-center">
          <div className="text-3xl mb-3">📣</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Is this your event?</h3>
          <p className="text-gray-600 mb-2 max-w-lg mx-auto">
            Get your event featured to thousands of Filipino-Americans actively searching for things to do. Add more photos, highlight your sponsors, and drive more ticket sales.
          </p>
          <p className="text-sm text-amber-700 font-medium mb-6">
            Featured events get 3x more visibility across FilipinoFoodNearMe.org and FilipinoEventsNearMe.org.
          </p>
          <a href="/advertise" className="inline-block px-6 py-3 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-full transition-all hover:scale-105">
            Feature This Event →
          </a>
        </div>
      </div>
    </div>
  )
}
