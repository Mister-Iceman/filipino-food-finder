import Link from 'next/link'

// The home page's Featured spot. There is no paid featured business yet, so it
// shows an open "Your business here" card that links to Advertise, where the
// labeled sample listing lives. When a featured business is booked, render its
// real listing card here instead. No made-up businesses on the home page.

export default function FeaturedSlot() {
  return (
    <section className="py-14 px-4 border-y border-gray-100" style={{ backgroundColor: '#FAFAF8' }} aria-label="Featured spot">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/advertise"
          className="group block rounded-2xl border-2 border-dashed bg-white p-8 sm:p-10 text-center hover:shadow-lg transition-shadow"
          style={{ borderColor: '#D4A017' }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#B45309' }}>
            ⭐ Featured spot open
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Your business here
          </h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            This spot goes to one featured Filipino food business at a time. See a sample of how your
            listing looks and pick a plan on the Advertise page.
          </p>
          <span
            className="inline-block px-8 py-4 rounded-full font-bold text-white shadow-lg group-hover:brightness-110 transition-all text-base"
            style={{ backgroundColor: '#D4A017' }}
          >
            See how it looks →
          </span>
          <p className="mt-3 text-sm font-medium" style={{ color: '#92400E' }}>
            30% off for life · Limited spots · No contracts
          </p>
        </Link>
      </div>
    </section>
  )
}
