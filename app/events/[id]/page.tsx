import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const revalidate = 3600

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (!event) {
    return {
      title: 'Event Not Found'
    }
  }

  return {
    title: `${event.title} | Filipino Food Events`,
    description: event.description || `Join us for ${event.title} on ${event.event_date}`
  }
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (!event) {
    notFound()
  }

  const categoryLabels: any = {
    'festival': '🎉 Festival',
    'grand_opening': '🏪 Grand Opening',
    'pop_up': '🍽️ Pop-Up',
    'cooking_class': '🎓 Cooking Class',
    'community': '🎊 Community Event',
    'tasting': '🎤 Tasting & Demo'
  }

  const formatDate = (date: string) => {
    const [year, month, day] = date.split('-').map(Number)
    const localDate = new Date(year, month - 1, day)
    
    return localDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/events" className="text-blue-600 hover:underline mb-6 inline-block">
          ← Back to Events
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {event.image_url && (
            <div className="h-96 bg-gray-200 overflow-hidden">
              <img 
                src={event.image_url} 
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            {event.is_featured && (
              <div className="mb-4">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full">
                  ⭐ FEATURED EVENT
                </span>
              </div>
            )}

            {event.category && (
              <p className="text-lg text-gray-600 mb-2">
                {categoryLabels[event.category]}
              </p>
            )}

            <h1 className="text-5xl font-bold text-gray-900 mb-6">{event.title}</h1>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Date & Time</h3>
                  <p className="text-lg text-gray-900">
                    📅 {formatDate(event.event_date)}
                    {event.event_time && (
                      <><br /><span className="text-gray-600">🕐 {event.event_time}</span></>
                    )}
                    {event.end_date && (
                      <><br /><span className="text-gray-600">Ends: {formatDate(event.end_date)}</span></>
                    )}
                  </p>
                </div>

                {(event.location_name || event.address_street || event.city) && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Location</h3>
                    <div className="text-lg text-gray-900">
                      {event.location_name && <p className="font-semibold">📍 {event.location_name}</p>}
                      {event.address_street && <p className="text-gray-600">{event.address_street}</p>}
                      {event.city && event.state && (
                        <p className="text-gray-600">{event.city}, {event.state} {event.zip}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {event.event_url && (
                  <a 
                    href={event.event_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center px-6 py-4 rounded-lg font-bold text-lg"
                  >
                    Learn More →
                  </a>
                )}
                {event.ticket_url && (
                  <a 
                    href={event.ticket_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-green-600 hover:bg-green-700 text-white text-center px-6 py-4 rounded-lg font-bold text-lg"
                  >
                    Get Tickets 🎫
                  </a>
                )}
              </div>
            </div>

            {event.description && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h3>
                <div className="prose prose-lg max-w-none text-gray-700">
                  <p className="whitespace-pre-wrap">{event.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}