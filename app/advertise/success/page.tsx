import Link from 'next/link'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

interface Props {
  searchParams: Promise<{ session_id?: string }>
}

export default async function AdvertiseSuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams

  let customerEmail = ''

  if (session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id)
      customerEmail = session.customer_email || ''
    } catch {
      // session retrieval failed — still show success page
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-10 text-center">
        {/* Checkmark */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'linear-gradient(135deg,#62438D 0%,#92345A 40%,#BF2F26 100%)' }}
        >
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">You're in! 🎉</h1>
        <p className="text-lg text-gray-700 mb-2">Your ad submission has been received.</p>
        <p className="text-base font-semibold mb-6" style={{ color: '#D1880D' }}>
          Your Founding Advertiser rate is locked in.
        </p>

        <div className="bg-purple-50 rounded-xl p-5 mb-6 text-left">
          <p className="text-gray-700 text-sm leading-relaxed">
            We'll review your creative and go live within 1 business day.
            {customerEmail && (
              <>
                {' '}You'll receive a confirmation email at{' '}
                <span className="font-semibold text-gray-900">{customerEmail}</span>{' '}
                when your ad is live.
              </>
            )}
            {!customerEmail && (
              <> You'll receive a confirmation email when your ad is live.</>
            )}
          </p>
        </div>

        <p className="text-sm text-gray-500 mb-8">
          Questions?{' '}
          <a
            href="mailto:advertise@filipinofoodnearme.org"
            className="font-semibold"
            style={{ color: '#62438D' }}
          >
            advertise@filipinofoodnearme.org
          </a>
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold"
          style={{ color: '#62438D' }}
        >
          ← Back to FilipinoFoodNearMe.org
        </Link>
      </div>
    </div>
  )
}
