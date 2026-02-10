import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const metadata = {
  title: 'Filipino Food Events | Filipino Food Near Me',
  description: 'Discover Filipino food festivals, pop-ups, grand openings, and community events near you. Join the celebration of Filipino cuisine across America.',
}

export default async function EventsPage() {
  // Fetch upcoming events
  const today = new Date().toISOString().split('T')[0]
  
  const { data: upcomingEvents } = await supabase
    .from('events')
    .select('*')
    .gte('event_date', today)
    .order('event_date', { ascending: true })
    .limit(50)

  const { data: pastEvents } = await supabase
    .from('events')
    .select('*')
    .lt('event_date', today)
    .order('event_date', { ascending: false })
    .limit(10)

  const categoryColors: any = {
    'festival': 'bg-purple-100 text-purple-800',
    'grand_opening': 'bg-green-100 text-green-800',
    'pop_up': 'bg-yellow-100 text-yellow-800',
    'cooking_class': 'bg-blue-100 text-blue-800',
    'community': 'bg-pink-100 text-pink-800',
    'tasting': 'bg-orange-100 text-orange-800'
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
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Filipino Food Events</h1>
          <p className="text-xl text-gray-600">
            Discover festivals, pop-ups, grand openings, and community gatherings celebrating Filipino cuisine across America.
          </p>
        </div>

        {/* Upcoming Events */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
          
          {!upcomingEvents || upcomingEvents.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <p className="text-2xl text-gray-600 mb-4">No upcoming events yet!</p>
              <p className="text-gray-500">Check back soon for Filipino food events in your area.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                  {event.image_url && (
                    <div className="h-48 bg-gray-200 overflow-hidden">
                      <img 
                        src={event.image_url} 
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    {event.is_featured && (
                      <div className="mb-3">
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          ⭐ FEATURED
                        </span>
                      </div>
                    )}

                    {event.category && (
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${categoryColors[event.category]}`}>
                        {categoryLabels[event.category]}
                      </span>
                    )}

                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h3>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <p className="font-semibold text-blue-600">
                        📅 {formatDate(event.event_date)}
                        {event.event_time && ` at ${event.event_time}`}
                      </p>
                      {event.location_name && (
                        <p>📍 {event.location_name}</p>
                      )}
                      {event.city && event.state && (
                        <p className="text-gray-500">{event.city}, {event.state}</p>
                      )}
                    </div>

                    {event.description && (
                      <p className="text-gray-700 mb-4 line-clamp-3">{event.description}</p>
                    )}

                    <div className="flex gap-2">
                      {event.event_url && (
                        <a 
                          href={event.event_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center px-4 py-2 rounded-lg font-semibold text-sm"
                        >
                          Learn More
                        </a>
                      )}
                      {event.ticket_url && (
                        <a 
                          href={event.ticket_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white text-center px-4 py-2 rounded-lg font-semibold text-sm"
                        >
                          Get Tickets
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Past Events */}
        {pastEvents && pastEvents.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Past Events</h2>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="space-y-4">
                {pastEvents.map((event) => (
                  <div key={event.id} className="border-l-4 border-gray-300 pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-gray-700">{event.title}</h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(event.event_date)} • {event.city}, {event.state}
                        </p>
                      </div>
                      {event.category && (
                        <span className={`px-2 py-1 rounded text-xs ${categoryColors[event.category]}`}>
                          {categoryLabels[event.category]}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}