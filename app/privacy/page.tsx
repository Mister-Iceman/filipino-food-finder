import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Filipino Food Near Me',
  description: 'Privacy Policy for Filipino Food Near Me. Learn how we collect, use, and protect your information in compliance with GDPR and CCPA.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          <section>
            <p className="text-sm text-gray-500 mb-4">
              <strong>Last Updated:</strong> January 30, 2026
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Filipino Food Near Me ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you visit our website 
              filipinofoodnearme.org.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
            
            <h3 className="text-xl font-bold text-gray-800 mb-3">Information You Provide</h3>
            <p className="text-gray-700 mb-4">
              We may collect personal information that you voluntarily provide when you:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Submit a business listing (name, email, business details)</li>
              <li>Contact us through our contact form (name, email, message)</li>
              <li>Subscribe to updates or newsletters (email address)</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-800 mb-3 mt-6">Automatically Collected Information</h3>
            <p className="text-gray-700 mb-4">
              When you visit our website, we may automatically collect:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Device information (browser type, operating system)</li>
              <li>Usage data (pages visited, time spent on site)</li>
              <li>IP address and general location (city/state level)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Operate and maintain our website and directory services</li>
              <li>Process business listing submissions and updates</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Send administrative information and updates</li>
              <li>Improve our website functionality and user experience</li>
              <li>Analyze usage patterns and trends</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">3. Information Sharing and Disclosure</h2>
            <p className="text-gray-700 mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information with:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Service Providers:</strong> Third-party vendors who assist with hosting (Vercel), database management (Supabase), and analytics</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or legal process</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, sale, or transfer of assets</li>
              <li><strong>Public Directory:</strong> Business information you submit for listing is publicly displayed on our website</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">4. Cookies and Tracking Technologies</h2>
            <p className="text-gray-700 mb-4">
              We use cookies and similar technologies to enhance your experience. You can control cookies through your browser 
              settings. Types of cookies we may use:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Essential Cookies:</strong> Necessary for website functionality</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
            </ul>
          </section>

          <section id="ccpa">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">5. Your Privacy Rights</h2>
            
            <h3 className="text-xl font-bold text-gray-800 mb-3">GDPR Rights (European Users)</h3>
            <p className="text-gray-700 mb-4">If you are in the European Economic Area, you have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Access your personal data</li>
              <li>Rectify inaccurate personal data</li>
              <li>Request erasure of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request restriction of processing your personal data</li>
              <li>Request transfer of your personal data</li>
              <li>Withdraw consent at any time</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-800 mb-3 mt-6">CCPA Rights (California Residents)</h3>
            <p className="text-gray-700 mb-4">California residents have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Know what personal information is collected</li>
              <li>Know whether personal information is sold or disclosed</li>
              <li>Say no to the sale of personal information</li>
              <li>Access your personal information</li>
              <li>Request deletion of your personal information</li>
              <li>Non-discrimination for exercising your privacy rights</li>
            </ul>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
              <h4 className="text-lg font-bold text-yellow-900 mb-2">Do Not Sell My Personal Information</h4>
              <p className="text-yellow-800">
                <strong>We do not sell your personal information.</strong> We do not and will not sell your personal data to third parties.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">6. Data Security</h2>
            <p className="text-gray-700">
              We implement reasonable security measures to protect your information from unauthorized access, alteration, 
              disclosure, or destruction. However, no internet transmission is completely secure, and we cannot guarantee 
              absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">7. Data Retention</h2>
            <p className="text-gray-700">
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this 
              Privacy Policy, unless a longer retention period is required by law.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">8. Third-Party Services</h2>
            <p className="text-gray-700 mb-4">Our website may contain links to third-party websites and services, including:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Vercel:</strong> Website hosting</li>
              <li><strong>Supabase:</strong> Database and authentication services</li>
              <li><strong>Google Maps:</strong> Location services</li>
            </ul>
            <p className="text-gray-700 mt-4">
              We are not responsible for the privacy practices of these third parties. Please review their privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
            <p className="text-gray-700">
              Our website is not intended for children under 13 years of age. We do not knowingly collect personal information 
              from children under 13. If you believe we have collected information from a child under 13, please contact us 
              immediately.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">10. International Users</h2>
            <p className="text-gray-700">
              Our website is operated in the United States. If you access our website from outside the United States, your 
              information may be transferred to, stored, and processed in the United States where our servers are located.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
              Privacy Policy on this page and updating the "Last Updated" date. Changes are effective immediately upon posting.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about this Privacy Policy or wish to exercise your privacy rights, please contact us:
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-gray-900"><strong>Email:</strong> <a href="mailto:info@filipinofoodnearme.org" className="text-blue-600 hover:text-blue-800">info@filipinofoodnearme.org</a></p>
              <p className="text-gray-900 mt-2"><strong>Subject Line:</strong> Privacy Request</p>
              <p className="text-gray-700 mt-4 text-sm">
                Please include "Privacy Request" in your subject line and provide details about your request. 
                We will respond within 30 days.
              </p>
            </div>
          </section>

          <section className="border-t pt-6">
            <p className="text-sm text-gray-500">
              By using Filipino Food Near Me, you acknowledge that you have read and understood this Privacy Policy and 
              agree to its terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}