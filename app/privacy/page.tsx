import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Filipino Food Near Me',
  description: 'Privacy Policy for Filipino Food Near Me. Learn how we collect, use, and protect your information when you use our Filipino food directory.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">Privacy Policy</h1>

        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          <section>
            <p className="text-sm text-gray-500">
              <strong>Effective Date:</strong> February 27, 2026
            </p>
            <p className="text-sm text-gray-500 mb-4">
              <strong>Last Updated:</strong> February 27, 2026
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              FilipinoFoodNearMe.org (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is operated by an individual based in
              California. This Privacy Policy explains how we collect, use, and protect your
              information when you use our website.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Email address (when you submit a community rating or sign up for updates)</li>
              <li>Rating and dish tag data you voluntarily submit</li>
              <li>
                IP address (used only for rate limiting to prevent spam — not stored permanently)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>To verify your identity before publishing a community rating</li>
              <li>
                To send you updates about new Filipino restaurants and events (only if you opt in)
              </li>
              <li>To improve the directory and prevent abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">3. We Do Not Sell Your Data</h2>
            <p className="text-gray-700">
              We do not sell, rent, or share your personal information with third parties for
              marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">4. Third-Party Services</h2>
            <p className="text-gray-700 mb-4">
              We use the following services to operate the site:
            </p>
            <ul className="space-y-2 text-gray-700 ml-4">
              <li>
                <strong>Supabase</strong> (database and authentication) —{' '}
                <a
                  href="https://supabase.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  supabase.com/privacy
                </a>
              </li>
              <li>
                <strong>Brevo</strong> (email delivery) —{' '}
                <a
                  href="https://www.brevo.com/legal/privacypolicy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  brevo.com/legal/privacypolicy
                </a>
              </li>
              <li>
                <strong>Cloudflare</strong> (security and CDN) —{' '}
                <a
                  href="https://www.cloudflare.com/privacypolicy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  cloudflare.com/privacypolicy
                </a>
              </li>
              <li>
                <strong>Sentry</strong> (error monitoring) —{' '}
                <a
                  href="https://sentry.io/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  sentry.io/privacy
                </a>
              </li>
              <li>
                <strong>hCaptcha</strong> (spam prevention) —{' '}
                <a
                  href="https://www.hcaptcha.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  hcaptcha.com/privacy
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              5. Your Rights (California Residents — CCPA)
            </h2>
            <p className="text-gray-700 mb-4">
              As a California resident, you have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
              <li>Know what personal data we have collected about you</li>
              <li>Request deletion of your personal data</li>
              <li>Opt out of any future data collection</li>
            </ul>
            <p className="text-gray-700">
              To exercise these rights, email us at:{' '}
              <a
                href="mailto:info@filipinofoodnearme.org"
                className="text-blue-600 hover:underline"
              >
                info@filipinofoodnearme.org
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
            <p className="text-gray-700">
              We retain your email and rating data for as long as your contributions are live on
              the site. You may request deletion at any time.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">7. Children&apos;s Privacy</h2>
            <p className="text-gray-700">
              This site is not directed at children under 13. We do not knowingly collect data
              from children.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">8. Changes to This Policy</h2>
            <p className="text-gray-700">
              We may update this policy from time to time. The effective date at the top of this
              page will reflect the most recent update.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">9. Contact</h2>
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
