import Link from 'next/link'

export const metadata = {
  title: 'Community Guidelines | Filipino Food Near Me',
  description: 'Our community guidelines for rating and reviewing Filipino restaurants and markets',
}

export default function CommunityGuidelines() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Home
        </Link>

        <h1 className="text-5xl font-bold text-gray-900 mb-4">Community Guidelines</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              Filipino Food Near Me is a positive community directory helping Filipino-Americans discover 
              authentic food and support local businesses. We celebrate Filipino cuisine and the hardworking 
              entrepreneurs who bring it to our communities.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Rating Guidelines</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-green-700 mb-2">✅ We Welcome:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Honest, helpful ratings about your experience</li>
                  <li>Constructive insights (taste, price, portions, atmosphere)</li>
                  <li>Respectful feedback that helps others make informed choices</li>
                  <li>Genuine experiences from real customers</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-red-700 mb-2">❌ We Don't Allow:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Personal attacks on staff or owners</li>
                  <li>Spam or fake ratings</li>
                  <li>Ratings from business owners about their own establishments</li>
                  <li>Multiple accounts to manipulate ratings</li>
                  <li>Offensive language or harassment</li>
                  <li>Ratings based on hearsay rather than personal experience</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Why We Require Email Verification</h2>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
              <p className="text-gray-700 mb-4">
                <strong>To protect our community and businesses:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Prevents spam and fake ratings</li>
                <li>Ensures one rating per person per business</li>
                <li>Maintains rating quality and trustworthiness</li>
                <li>Protects businesses from coordinated attacks</li>
              </ul>
              <p className="text-gray-600 mt-4 text-sm">
                Your email is never shared publicly and is only used for verification.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Our Approach</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Unlike review sites with negative text reviews, we use structured ratings:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>5 simple categories (taste, price, portions, atmosphere, parking)</li>
              <li>Visual scales and checkboxes (no lengthy reviews)</li>
              <li>Aggregated community insights (not individual opinions)</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              This keeps our directory positive and supportive while providing useful information.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Reporting Issues</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              If you see suspicious ratings or inappropriate content:
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">
                <strong>Email:</strong> <a href="mailto:info@filipinofoodnearme.org" className="text-blue-600 hover:underline">info@filipinofoodnearme.org</a>
              </p>
              <p className="text-gray-600 text-sm mt-2">
                We review all reports within 24-48 hours
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Privacy</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We take your privacy seriously:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Emails are encrypted and stored securely</li>
              <li>Individual ratings are never displayed publicly</li>
              <li>Only aggregated community data is shown</li>
              <li>We will never sell or share your information</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Read our full <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
            </p>
          </section>

          <section className="border-t pt-6">
            <p className="text-sm text-gray-500">
              <strong>Last updated:</strong> February 9, 2026
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Questions? Contact us at <a href="mailto:info@filipinofoodnearme.org" className="text-blue-600 hover:underline">info@filipinofoodnearme.org</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}