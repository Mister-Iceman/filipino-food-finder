import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | Filipino Food Near Me',
  description: 'Get in touch with Filipino Food Near Me. Submit questions, report issues, suggest businesses, or inquire about partnerships.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">Contact Us</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <p className="text-lg text-gray-700 mb-6">
            We'd love to hear from you! Whether you have questions, feedback, or want to add your business to our directory, 
            we're here to help.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-blue-900 mb-3">General Inquiries</h2>
              <p className="text-gray-700 mb-4">Questions about our directory or how to use the site</p>
              <a 
                href="mailto:info@filipinofoodnearme.org?subject=General Inquiry"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                info@filipinofoodnearme.org
              </a>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-yellow-900 mb-3">Add Your Business</h2>
              <p className="text-gray-700 mb-4">Want to be featured in our directory?</p>
              <a 
                href="/add-business"
                className="text-yellow-700 hover:text-yellow-900 font-medium"
              >
                Submit Your Business →
              </a>
            </div>

            <div className="bg-red-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-red-900 mb-3">Report an Issue</h2>
              <p className="text-gray-700 mb-4">Found incorrect information or a closed business?</p>
              <a 
                href="mailto:info@filipinofoodnearme.org?subject=Report Issue"
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Report Issue
              </a>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-green-900 mb-3">Partnerships</h2>
              <p className="text-gray-700 mb-4">Interested in partnering or advertising?</p>
              <a 
                href="mailto:info@filipinofoodnearme.org?subject=Partnership Inquiry"
                className="text-green-600 hover:text-green-800 font-medium"
              >
                Contact Us
              </a>
            </div>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Send Us a Message</h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Juan Dela Cruz"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">Select a topic</option>
                  <option value="general">General Inquiry</option>
                  <option value="business">Add My Business</option>
                  <option value="issue">Report an Issue</option>
                  <option value="partnership">Partnership/Advertising</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  placeholder="Tell us how we can help..."
                ></textarea>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> This is a demonstration form. In production, this will send an email to 
                  info@filipinofoodnearme.org. For now, please email us directly at the address above.
                </p>
              </div>

              <button
                type="submit"
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold transition-all hover:scale-105"
              >
                Send Message
              </button>
            </form>
          </div>

          <div className="border-t pt-8 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Response Time</h2>
            <p className="text-gray-700">
              We typically respond to inquiries within <strong>24-48 hours</strong> during business days. 
              For urgent matters regarding incorrect business information, we'll prioritize your request.
            </p>
          </div>
        </div>

        <div className="bg-blue-600 text-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Looking to Add Your Business?</h2>
          <p className="text-lg mb-6">
            Join 990+ Filipino businesses already featured in our directory
          </p>
          <a 
            href="/add-business"
            className="inline-block bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-bold transition-all hover:scale-105"
          >
            Add Your Business Now →
          </a>
        </div>
      </div>
    </div>
  )
}