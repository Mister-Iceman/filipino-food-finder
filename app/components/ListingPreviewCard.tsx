// A clearly labeled sample of how a business listing looks on
// FilipinoFoodNearMe.org. "Manila Kitchen" is a made-up example so owners see
// a vivid, filled-in card. Shown only on the Advertise and Add Business pages,
// never as if it were a real business: placeholders instead of a phone number,
// no star ratings or review counts, and buttons that do nothing.

type Props = {
  title?: string
  note?: string
  className?: string
}

export default function ListingPreviewCard({
  title = "Here's how your listing will look",
  note = 'Sample business for illustration only. Your own name, photo, dishes, hours and phone go here.',
  className = '',
}: Props) {
  return (
    <section aria-label="Sample listing preview" className={className}>
      <p className="text-center text-sm font-semibold tracking-wide mb-4" style={{ color: '#B45309' }}>
        {title}
      </p>

      <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-dashed border-amber-300 max-w-xl mx-auto">
        {/* Sample ribbon */}
        <div
          className="absolute top-3 right-3 z-10 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded"
          style={{ backgroundColor: '#1F2937', color: '#fff' }}
        >
          Sample preview
        </div>

        <div style={{ position: 'relative', width: '100%', height: '180px', overflow: 'hidden' }}>
          <img
            src="/images/manila-kitchen-demo.jpg"
            alt="Sample photo of a Filipino food spread showing where your own photo appears"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
          />
          <div
            style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#D4A017', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}
          >
            FEATURED
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Manila Kitchen</h3>
              <p className="text-sm text-gray-500 mt-0.5">📍 Historic Filipinotown, Los Angeles, CA</p>
            </div>
            <span className="inline-block self-start text-xs bg-purple-100 text-purple-700 font-semibold px-3 py-1 rounded-full whitespace-nowrap">
              Filipino Restaurant
            </span>
          </div>

          <p className="text-gray-500 text-sm italic mb-3">
            &ldquo;Authentic home-style Filipino cooking in the heart of HiFi&rdquo;
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {['Adobo', 'Sinigang', 'Kare-Kare', 'Lechon'].map((tag, i) => (
              <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{tag}</span>
            ))}
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-500 mb-5">
            <span>📞 Your phone here</span>
            <span>🕐 Your hours here</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {['Get Directions', 'Visit Website', 'Call Now'].map(label => (
              <span
                key={label}
                aria-hidden="true"
                className="text-sm px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-400 select-none"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-gray-500 mt-3">{note}</p>
    </section>
  )
}
