import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Use | Filipino Food Near Me',
  description: 'Terms of Use for Filipino Food Near Me. A free, community-powered directory of Filipino food businesses across the United States.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">Terms of Use</h1>

        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          <section>
            <p className="text-sm text-gray-500 mb-4">
              <strong>Effective Date:</strong> February 27, 2026
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              FilipinoFoodNearMe.org is a community-powered directory of Filipino food businesses
              across the United States. It is operated by an individual and is free to use. By
              using this site, you agree to these Terms of Use.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">1. About the Site</h2>
            <p className="text-gray-700">
              FilipinoFoodNearMe.org is a free, community-powered directory. We do not charge for
              listings and do not accept payment for placement or ranking.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">2. Accuracy of Information</h2>
            <p className="text-gray-700">
              Business listings are sourced from community submissions and public data. Hours,
              menus, and contact information can change. Always verify details directly with the
              business before visiting. We are not responsible for outdated or incorrect listing
              information.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">3. Community Ratings</h2>
            <p className="text-gray-700">
              Ratings are contributed by real users. By submitting a rating, you confirm that your
              experience is genuine. We reserve the right to remove ratings that are abusive,
              spammy, or violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">4. Acceptable Use</h2>
            <p className="text-gray-700 mb-4">You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Submit false, misleading, or malicious content</li>
              <li>Use the site to harass or target any business or individual</li>
              <li>Attempt to manipulate ratings or game the directory</li>
              <li>Scrape or reproduce directory data without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">5. Intellectual Property</h2>
            <p className="text-gray-700">
              The content, design, and code of FilipinoFoodNearMe.org are owned by the operator.
              Business names, logos, and trademarks belong to their respective owners.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">6. Disclaimer of Warranties</h2>
            <p className="text-gray-700">
              This site is provided &quot;as is&quot; without warranties of any kind. We do not guarantee
              uninterrupted access or the accuracy of any listing.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-700">
              To the fullest extent permitted by California law, we are not liable for any damages
              arising from your use of this site or reliance on its content.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">8. Governing Law</h2>
            <p className="text-gray-700">
              These terms are governed by the laws of the State of California.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">9. Changes to Terms</h2>
            <p className="text-gray-700">
              We may update these terms at any time. Continued use of the site after changes
              constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">10. Contact</h2>
            <p className="text-gray-700 mb-4">Questions? Email us at:</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-gray-900">
                <strong>Email:</strong>{' '}
                <a
                  href="mailto:info@filipinofoodnearme.org"
                  className="text-blue-600 hover:text-blue-800"
                >
                  info@filipinofoodnearme.org
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
