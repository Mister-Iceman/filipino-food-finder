import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | Filipino Food Near Me',
  description: 'Terms of Service for Filipino Food Near Me. Read our terms and conditions for using our Filipino food directory.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">Terms of Service</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          <section>
            <p className="text-sm text-gray-500 mb-4">
              <strong>Last Updated:</strong> January 30, 2026
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Please read these Terms of Service ("Terms") carefully before using Filipino Food Near Me 
              ("the Service," "we," "us," or "our"). By accessing or using our website at filipinofoodnearme.org, 
              you agree to be bound by these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700">
              By accessing and using this Service, you accept and agree to be bound by these Terms and our Privacy Policy. 
              If you do not agree to these Terms, you may not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 mb-4">
              Filipino Food Near Me is a community-driven directory that provides information about Filipino restaurants, 
              bakeries, grocery stores, and food-related businesses across the United States. The Service includes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>A searchable directory of Filipino food businesses</li>
              <li>Business information including addresses, phone numbers, and hours</li>
              <li>Links to third-party websites and services</li>
              <li>A platform for businesses to submit their information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">3. Use of Service</h2>
            
            <h3 className="text-xl font-bold text-gray-800 mb-3">Permitted Use</h3>
            <p className="text-gray-700 mb-4">You may use the Service for lawful purposes only. You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Submit false, misleading, or inaccurate information</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Use automated systems to access the Service without permission</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Upload viruses, malware, or harmful code</li>
              <li>Harass, abuse, or harm other users or businesses</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-800 mb-3 mt-6">Age Requirement</h3>
            <p className="text-gray-700">
              You must be at least 13 years old to use this Service. By using the Service, you represent that you meet 
              this age requirement.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">4. Business Listings</h2>
            
            <h3 className="text-xl font-bold text-gray-800 mb-3">Submission of Listings</h3>
            <p className="text-gray-700 mb-4">
              When you submit a business listing, you represent and warrant that:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>You have the authority to submit the business information</li>
              <li>All information provided is accurate and current</li>
              <li>The business serves Filipino food or products</li>
              <li>You will update us if information changes or the business closes</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-800 mb-3 mt-6">Our Rights</h3>
            <p className="text-gray-700 mb-4">We reserve the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Accept or reject any business listing submission</li>
              <li>Remove or modify listings at our discretion</li>
              <li>Verify business information before publishing</li>
              <li>Contact businesses to confirm details</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">5. Disclaimer of Warranties</h2>
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
              <p className="text-gray-900 font-bold mb-4">IMPORTANT - PLEASE READ CAREFULLY:</p>
              <p className="text-gray-700 mb-4">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, 
                INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Accuracy, completeness, or reliability of business information</li>
                <li>Quality, safety, or legality of businesses listed</li>
                <li>Uninterrupted or error-free operation of the Service</li>
                <li>Fitness for a particular purpose</li>
              </ul>
              <p className="text-gray-700 mt-4">
                <strong>We do not verify all business listings.</strong> Information is provided by third parties and may be 
                outdated, incomplete, or inaccurate. Businesses may close, change hours, or move without notice.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">6. Limitation of Liability</h2>
            <div className="bg-red-50 border-2 border-red-400 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, FILIPINO FOOD NEAR ME SHALL NOT BE LIABLE FOR ANY:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Indirect, incidental, special, or consequential damages</li>
                <li>Loss of profits, revenue, data, or business opportunities</li>
                <li>Damages resulting from use or inability to use the Service</li>
                <li>Damages from incorrect, outdated, or misleading business information</li>
                <li>Damages from interactions with listed businesses</li>
                <li>Damages from third-party websites or services</li>
              </ul>
              <p className="text-gray-700 mt-4">
                <strong>Contact businesses directly</strong> to verify all information before visiting. We are not responsible 
                for any issues, disputes, or damages arising from your interactions with listed businesses.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">7. Indemnification</h2>
            <p className="text-gray-700">
              You agree to indemnify, defend, and hold harmless Filipino Food Near Me, its owners, employees, and 
              affiliates from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-4">
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Information you submit to the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">8. Intellectual Property</h2>
            
            <h3 className="text-xl font-bold text-gray-800 mb-3">Our Content</h3>
            <p className="text-gray-700 mb-4">
              The Service and its original content, features, and functionality are owned by Filipino Food Near Me and are 
              protected by copyright, trademark, and other intellectual property laws.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">User Content</h3>
            <p className="text-gray-700">
              By submitting content to the Service (including business listings, reviews, or comments), you grant us a 
              non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and display such content in 
              connection with operating the Service.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">9. Third-Party Links and Services</h2>
            <p className="text-gray-700 mb-4">
              The Service contains links to third-party websites (including Google Maps, business websites, and social media). 
              We are not responsible for the content, privacy policies, or practices of third-party websites. Use of 
              third-party websites is at your own risk.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3 mt-6">Google Maps</h3>
            <p className="text-gray-700 mb-4">
              Our website contains links to Google Maps for business locations. We are not affiliated with Google LLC 
              and do not control Google Maps content. Google Maps™ is a trademark of Google LLC. Use of Google Maps is 
              subject to Google's Terms of Service and Privacy Policy.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">Ratings and Reviews</h3>
            <p className="text-gray-700">
              Star ratings and review counts displayed on our website are sourced from Google Maps and represent opinions 
              of Google users. We do not create, verify, endorse, or moderate these ratings. Ratings may be outdated or 
              inaccurate. For current ratings and full reviews, please visit the business's Google Maps page directly.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">10. Termination</h2>
            <p className="text-gray-700">
              We reserve the right to terminate or suspend access to the Service immediately, without prior notice, for any 
              reason, including breach of these Terms. Upon termination, your right to use the Service will cease immediately.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">11. Changes to Terms</h2>
            <p className="text-gray-700">
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. 
              Your continued use of the Service after changes constitutes acceptance of the modified Terms. We will update 
              the "Last Updated" date at the top of this page.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">12. Governing Law</h2>
            <p className="text-gray-700">
              These Terms shall be governed by and construed in accordance with the laws of the State of California, 
              United States, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">13. Dispute Resolution</h2>
            <p className="text-gray-700">
              Any disputes arising from these Terms or your use of the Service shall be resolved through binding arbitration 
              in accordance with the rules of the American Arbitration Association, except where prohibited by law.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">14. Severability</h2>
            <p className="text-gray-700">
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or 
              eliminated to the minimum extent necessary so that the Terms shall otherwise remain in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">15. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about these Terms, please contact us:
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-gray-900"><strong>Email:</strong> <a href="mailto:info@filipinofoodnearme.org" className="text-blue-600 hover:text-blue-800">info@filipinofoodnearme.org</a></p>
              <p className="text-gray-900 mt-2"><strong>Subject Line:</strong> Terms of Service Inquiry</p>
            </div>
          </section>

          <section className="border-t pt-6">
            <p className="text-sm text-gray-500">
              By using Filipino Food Near Me, you acknowledge that you have read, understood, and agree to be bound by 
              these Terms of Service.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}