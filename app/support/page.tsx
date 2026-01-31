import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Support Us | Filipino Food Near Me',
  description: 'Help us maintain and improve the first community Filipino food directory in America. Your support keeps this free resource available to everyone.',
}

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">Support Our Mission</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8">
            <p className="text-lg text-blue-900">
              <strong>Filipino Food Near Me</strong> is a free, community-driven directory built to connect 
              Filipino-Americans and food lovers to authentic Filipino cuisine across the United States.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why We Need Your Support</h2>
            <p className="text-lg text-gray-700 mb-4">
              Running a nationwide directory takes time, effort, and resources. Your support helps us:
            </p>
            <ul className="space-y-3 list-none">
              <li className="flex items-start gap-3">
                <span className="text-2xl" role="img" aria-label="Server">💻</span>
                <div>
                  <strong className="text-gray-900">Maintain the website</strong>
                  <p className="text-gray-700">Hosting, database, domain renewal, and technical infrastructure</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl" role="img" aria-label="Update">🔄</span>
                <div>
                  <strong className="text-gray-900">Keep information current</strong>
                  <p className="text-gray-700">Verify listings, update closed businesses, add new restaurants</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl" role="img" aria-label="Growth">📈</span>
                <div>
                  <strong className="text-gray-900">Expand the directory</strong>
                  <p className="text-gray-700">Research and add more Filipino businesses across all 50 states</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl" role="img" aria-label="Features">✨</span>
                <div>
                  <strong className="text-gray-900">Add new features</strong>
                  <p className="text-gray-700">User reviews, mobile app, advanced search, and more</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl" role="img" aria-label="Time">⏰</span>
                <div>
                  <strong className="text-gray-900">Dedicate more time</strong>
                  <p className="text-gray-700">Respond to submissions, moderate content, improve user experience</p>
                </div>
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Commitment to You</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-green-900 mb-2">Always Free</h3>
                <p className="text-gray-700">
                  The directory will always be free to access. No paywalls, no premium tiers, no subscriptions.
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-blue-900 mb-2">Community-Driven</h3>
                <p className="text-gray-700">
                  Built by the community, for the community. Your input shapes what we become.
                </p>
              </div>
              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-yellow-900 mb-2">Transparent</h3>
                <p className="text-gray-700">
                  We're open about our costs, challenges, and improvements. This is your directory.
                </p>
              </div>
              <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-red-900 mb-2">Independent</h3>
                <p className="text-gray-700">
                  We don't accept payments from businesses for better placement or fake reviews.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Ways to Support Us</h2>
            
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-400 rounded-xl p-8 mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">💛 Financial Support</h3>
              <p className="text-gray-700 mb-6">
                Every contribution, no matter how small, helps us maintain and improve this free resource.
              </p>
              
              <div className="space-y-4">
                {/* Placeholder for payment buttons - you'll add these after setting up accounts */}
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <p className="text-gray-700 mb-6 text-lg">
                    Support our mission with a one-time contribution:
                  </p>
                  
                  <a 
                    href="https://buymeacoffee.com/filipinofoodnearme" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <img 
                      src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" 
                      alt="Buy Me A Coffee" 
                      className="h-16 hover:scale-105 transition-transform"
                    />
                  </a>

                  <p className="text-sm text-gray-500 mt-6">
                    Or visit: <a 
                      href="https://buymeacoffee.com/filipinofoodnearme" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      buymeacoffee.com/filipinofoodnearme
                    </a>
                  </p>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      💡 <strong>Suggested amounts:</strong> $3 (coffee) • $10 (lunch) • $25 (monthly hosting) • Custom amount
                    </p>
                  </div>
                </div>
                
                {/* Uncomment when you have Buy Me A Coffee set up:
                <a 
                  href="https://www.buymeacoffee.com/YOUR_USERNAME" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <img 
                    src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" 
                    alt="Buy Me A Coffee" 
                    className="h-14"
                  />
                </a>
                */}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-blue-900 mb-3">🔗 Share the Directory</h3>
                <p className="text-gray-700 mb-4">
                  Help us grow by sharing with Filipino-American communities, food groups, and social media.
                </p>
                <div className="flex gap-2">
                  <a 
                    href="https://www.facebook.com/sharer/sharer.php?u=https://filipinofoodnearme.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
                  >
                    Share on Facebook
                  </a>
                  <a 
                    href="https://twitter.com/intent/tweet?text=Check%20out%20Filipino%20Food%20Near%20Me%20-%20the%20first%20community%20Filipino%20food%20directory!&url=https://filipinofoodnearme.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded text-sm font-medium"
                  >
                    Share on X
                  </a>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-green-900 mb-3">📝 Contribute Data</h3>
                <p className="text-gray-700 mb-4">
                  Know a great Filipino restaurant? Help us add it to the directory!
                </p>
                <a 
                  href="/add-business"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium"
                >
                  Submit a Business
                </a>
              </div>
            </div>
          </section>

          <section className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Important Legal Information</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <strong>Not a Nonprofit:</strong> Filipino Food Near Me is not a registered 501(c)(3) nonprofit organization. 
                Contributions are not tax-deductible.
              </li>
              <li>
                <strong>How Funds Are Used:</strong> All support goes directly toward website hosting, database management, 
                domain costs, data research, and site improvements.
              </li>
              <li>
                <strong>No Refunds:</strong> All contributions are final and non-refundable.
              </li>
              <li>
                <strong>Transparency:</strong> We're committed to using funds responsibly and will share updates on how 
                support is used to improve the directory.
              </li>
            </ul>
          </section>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Thank You for Your Support! 🙏</h2>
          <p className="text-lg mb-6">
            Every contribution, share, and business submission helps build the strongest Filipino food community online. 
            Together, we're making Filipino cuisine more accessible to everyone across America.
          </p>
          <p className="text-xl font-bold">
            Maraming salamat! ❤️
          </p>
        </div>
      </div>
    </div>
  )
}