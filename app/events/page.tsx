// v2
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import AdSlot from '../components/AdSlot'

export const revalidate = 3600

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
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div className="flex-1">
              <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
                ← Back to Home
              </Link>
              <h1 className="text-5xl font-bold text-gray-900 mb-4">Filipino Food Events</h1>
              <p className="text-xl text-gray-600">
                Discover festivals, pop-ups, grand openings, and community gatherings celebrating Filipino cuisine across America.
              </p>
            </div>
            <Link
              href="/submit-event"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold whitespace-nowrap"
            >
              + Submit Event
            </Link>
          </div>
        </div>

        {/* Top Banner Ad */}
        <div className="mb-8">
          <AdSlot 
            slot="1111111111" 
            format="horizontal"
          />
        </div>

        {/* Upcoming Events */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
          
          {!upcomingEvents || upcomingEvents.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <p className="text-2xl text-gray-600 mb-4">No upcoming events yet!</p>
              <p className="text-gray-500 mb-6">Check back soon for Filipino food events in your area.</p>
              <Link
                href="/submit-event"
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold"
              >
                Submit an Event
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.flatMap((event, index) => {
                const items = []
                
                // Add ad after every 6 events
                if (index > 0 && index % 6 === 0) {
                  items.push(
                    <div className="md:col-span-2 lg:col-span-3 mb-6" key={`ad-${index}`}>
                      <AdSlot 
                        slot="2222222222" 
                        format="horizontal"
                      />
                    </div>
                  )
                }
                
                // Add event card
                items.push(
                  <Link
                    href={`/events/${event.id}`}
                    key={`event-${event.id}`}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow block cursor-pointer"
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {event.is_featured && (
                          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            ⭐ FEATURED
                          </span>
                        )}
                        {event.category && (
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${categoryColors[event.category]}`}>
                            {categoryLabels[event.category]}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-1.5">{event.title}</h3>
                      
                      <div className="space-y-1 text-sm text-gray-600 mb-3">
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
                        <p className="text-gray-700 mb-3 text-sm line-clamp-2">{event.description}</p>
                      )}

                      <div className="flex gap-2">
                        {event.event_url && (
                          <span className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center px-4 py-2 rounded-lg font-semibold text-sm">
                            Learn More
                          </span>
                        )}
                        {event.ticket_url && (
                          <span className="flex-1 bg-green-600 hover:bg-green-700 text-white text-center px-4 py-2 rounded-lg font-semibold text-sm">
                            Get Tickets
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                )
                
                return items
              })}
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
                  <Link 
                    href={`/events/${event.id}`}
                    key={event.id} 
                    className="border-l-4 border-gray-300 pl-4 py-2 block hover:border-blue-500 transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-gray-700 hover:text-blue-600">{event.title}</h3>
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
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}