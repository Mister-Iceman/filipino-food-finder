import Link from 'next/link'

export const metadata = {
  title: 'Support Us | Filipino Food Near Me',
  description: 'Learn how to support Filipino Food Near Me and help us grow the community',
}

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Home
        </Link>

        <h1 className="text-5xl font-bold text-gray-900 mb-4">Support Us</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              Filipino Food Near Me is a free community directory helping Filipino-Americans discover 
              authentic food and support local businesses across the United States. We're built by the 
              community, for the community.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Independent Community Ratings</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Your ratings are authentic and unbiased. Businesses cannot pay for better ratings or influence community insights. All ratings come from verified community members through email verification - ensuring real experiences from real people in the Filipino-American community.
            </p>
            <p className="text-sm text-gray-600 italic">
              Note: We may feature business partnerships and advertising, but ratings always remain independent and community-driven.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Ways to Support Us</h2>

            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-400 rounded-xl p-8 mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">☕ Buy Us Coffee</h3>
              <p className="text-gray-700 mb-4">
                Help us keep the servers running and continue building features the community loves.
              </p>
              <a 
                href="https://www.buymeacoffee.com/filipinofood" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg transition"
              >
                Support on Buy Me a Coffee
              </a>
            </div>

            <div className="space-y-6">
              <div className="border-l-4 border-blue-600 bg-blue-50 p-6 rounded-r-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-2">📢 Spread the Word</h3>
                <p className="text-gray-700 mb-3">
                  Share Filipino Food Near Me with friends, family, and your favorite Filipino businesses!
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Post about us on social media</li>
                  <li>Tell your Filipino community groups</li>
                  <li>Ask businesses to share their listings</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-600 bg-green-50 p-6 rounded-r-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-2">⭐ Rate & Review</h3>
                <p className="text-gray-700 mb-3">
                  Your ratings help others discover amazing Filipino food. Every review makes the directory more valuable!
                </p>
              </div>

              <div className="border-l-4 border-purple-600 bg-purple-50 p-6 rounded-r-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-2">📍 Submit New Listings</h3>
                <p className="text-gray-700 mb-3">
                  Know a Filipino restaurant, bakery, or grocery store that's not listed? Let us know!
                </p>
                <Link 
                  href="/add-business" 
                  className="text-purple-600 hover:underline font-medium"
                >
                  Submit a Business →
                </Link>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How We Use Your Support</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-2xl mr-3">🖥️</span>
                <div>
                  <strong>Server & Hosting Costs:</strong> Keeping the site fast and reliable
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">🔍</span>
                <div>
                  <strong>Research & Updates:</strong> Finding new businesses and keeping listings accurate
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">✨</span>
                <div>
                  <strong>New Features:</strong> Building tools the community requests
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">📧</span>
                <div>
                  <strong>Communication:</strong> Email services, newsletters, and community updates
                </div>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">100% Community-Driven</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We don't charge businesses for listings or charge users for access. Every dollar goes directly 
              into making this resource better for the Filipino-American community.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Whether you contribute $3 or $30, you're helping preserve and promote Filipino food culture 
              across America. Salamat po! 🙏
            </p>
          </section>

          <section className="border-t pt-6">
            <p className="text-sm text-gray-500">
              Questions about supporting us? Email us at{' '}
              <a href="mailto:info@filipinofoodnearme.org" className="text-blue-600 hover:underline">
                info@filipinofoodnearme.org
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}