// Sends diners on a FilipinoFoodNearMe.org city page to the same city on
// FilipinoEventsNearMe.org, the other half of the food-and-events funnel.

const FENM_ORIGIN = 'https://www.filipinoeventsnearme.org'

// FFNM city slugs that differ from the FENM city slug.
const FENM_CITY_ALIASES: Record<string, string> = {
  'new-york': 'new-york-city',
}

export default function CityEventsLink({ city, citySlug }: { city: string; citySlug: string }) {
  const fenmSlug = FENM_CITY_ALIASES[citySlug] ?? citySlug
  return (
    <section className="bg-white border-t border-gray-100 py-10 px-4" aria-label={`Filipino events in ${city}`}>
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-purple-100 bg-purple-50 p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-purple-700 mb-1">FilAm Network</p>
          <p className="font-semibold text-gray-900">Filipino events in {city}</p>
          <p className="text-sm text-gray-600 mt-0.5">
            Festivals, fiestas, Simbang Gabi and community gatherings near you on FilipinoEventsNearMe.org.
          </p>
        </div>
        <a
          href={`${FENM_ORIGIN}/city/${fenmSlug}`}
          className="inline-block whitespace-nowrap px-5 py-2.5 rounded-full font-semibold text-white text-sm"
          style={{ backgroundColor: '#62438D' }}
        >
          See events &rarr;
        </a>
      </div>
    </section>
  )
}
