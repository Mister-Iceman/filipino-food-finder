import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Accessibility Statement | Filipino Food Near Me',
  description: 'Our commitment to accessibility. Learn about our efforts to ensure Filipino Food Near Me is accessible to all users, including those with disabilities.',
}

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">Accessibility Statement</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          <section>
            <p className="text-sm text-gray-500 mb-4">
              <strong>Last Updated:</strong> January 30, 2026
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Filipino Food Near Me is committed to ensuring digital accessibility for people with disabilities. We are 
              continually improving the user experience for everyone and applying the relevant accessibility standards.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Commitment</h2>
            <p className="text-gray-700 mb-4">
              We believe that everyone should have equal access to information about Filipino food and businesses in their 
              community. We strive to make our website accessible to all users, regardless of ability or technology.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-blue-900 font-bold">
                Our goal is to conform to WCAG 2.1 Level AA standards.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Accessibility Features</h2>
            <p className="text-gray-700 mb-4">
              We have implemented the following features to improve accessibility:
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">⌨️ Keyboard Navigation</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>All interactive elements are accessible via keyboard</li>
                  <li>Tab key navigation through all links, buttons, and form fields</li>
                  <li>Visible focus indicators (yellow outline) for keyboard users</li>
                  <li>Skip navigation link to jump to main content</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">🔊 Screen Reader Support</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Semantic HTML with proper heading hierarchy (H1, H2, H3)</li>
                  <li>ARIA labels and landmarks for navigation</li>
                  <li>Alternative text for icons and images</li>
                  <li>Descriptive link text (no "click here")</li>
                  <li>Form labels properly associated with inputs</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">👁️ Visual Design</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Sufficient color contrast ratios (WCAG AA compliant)</li>
                  <li>Text is resizable without breaking layout</li>
                  <li>Content is readable and functional when zoomed to 200%</li>
                  <li>No reliance on color alone to convey information</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">🎯 User Control</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Reduced motion support for users with vestibular disorders</li>
                  <li>No auto-playing audio or video</li>
                  <li>No content that flashes more than 3 times per second</li>
                  <li>Sufficient time to read and interact with content</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">📱 Responsive Design</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Mobile-friendly and tablet-friendly layouts</li>
                  <li>Touch targets sized appropriately (minimum 44x44 pixels)</li>
                  <li>Content adapts to different screen sizes</li>
                  <li>Portrait and landscape orientation support</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Standards Compliance</h2>
            <p className="text-gray-700 mb-4">
              Our website has been designed with the following standards in mind:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>WCAG 2.1 Level AA:</strong> Web Content Accessibility Guidelines</li>
              <li><strong>Section 508:</strong> U.S. Federal accessibility standards</li>
              <li><strong>ADA:</strong> Americans with Disabilities Act compliance</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Known Limitations</h2>
            <p className="text-gray-700 mb-4">
              While we strive for full accessibility, we acknowledge the following limitations:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Third-party content (Google Maps, external business websites) may not meet accessibility standards</li>
              <li>Some older business listings may have incomplete information</li>
              <li>We are continuously working to improve accessibility across all features</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Assistive Technologies</h2>
            <p className="text-gray-700 mb-4">
              Our website is designed to work with the following assistive technologies:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Screen readers (JAWS, NVDA, VoiceOver)</li>
              <li>Screen magnification software</li>
              <li>Speech recognition software</li>
              <li>Keyboard-only navigation</li>
              <li>Alternative input devices</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Testing</h2>
            <p className="text-gray-700 mb-4">
              We regularly test our website for accessibility using:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Automated accessibility testing tools</li>
              <li>Manual keyboard navigation testing</li>
              <li>Screen reader testing</li>
              <li>Color contrast analysis</li>
              <li>User feedback and reports</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Feedback and Assistance</h2>
            <p className="text-gray-700 mb-4">
              We welcome your feedback on the accessibility of Filipino Food Near Me. If you encounter any accessibility 
              barriers or have suggestions for improvement, please let us know:
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-green-900 mb-3">Report an Accessibility Issue</h3>
              <p className="text-gray-900 mb-2">
                <strong>Email:</strong> <a href="mailto:info@filipinofoodnearme.org?subject=Accessibility Issue" className="text-blue-600 hover:text-blue-800">info@filipinofoodnearme.org</a>
              </p>
              <p className="text-gray-900 mb-2">
                <strong>Subject Line:</strong> Accessibility Issue
              </p>
              <p className="text-gray-700 text-sm mt-4">
                Please include:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm ml-4 mt-2">
                <li>The page or feature you were trying to access</li>
                <li>The accessibility barrier you encountered</li>
                <li>Your assistive technology (if applicable)</li>
                <li>Any suggestions for improvement</li>
              </ul>
              <p className="text-gray-700 text-sm mt-4">
                We aim to respond to accessibility feedback within 5 business days.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Alternative Access</h2>
            <p className="text-gray-700 mb-4">
              If you are unable to access information on our website due to accessibility barriers, we will provide 
              alternative access methods:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Email us for specific business information: info@filipinofoodnearme.org</li>
              <li>Request information in alternative formats</li>
              <li>Assistance with navigation and finding businesses</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ongoing Improvements</h2>
            <p className="text-gray-700">
              Accessibility is an ongoing effort. We are committed to continuously improving the accessibility of our 
              website and will:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-4">
              <li>Regularly audit our website for accessibility issues</li>
              <li>Address reported accessibility barriers promptly</li>
              <li>Stay informed about accessibility best practices</li>
              <li>Incorporate accessibility into our development process</li>
              <li>Update this statement as we make improvements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Legal</h2>
            <p className="text-gray-700">
              This accessibility statement applies to filipinofoodnearme.org. We are committed to compliance with the 
              Americans with Disabilities Act (ADA) and other applicable accessibility laws and regulations.
            </p>
          </section>

          <section className="border-t pt-6">
            <p className="text-sm text-gray-500">
              We believe digital accessibility is not just a legal requirement but a moral imperative. Every person 
              deserves equal access to information about Filipino food and culture in their community.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}