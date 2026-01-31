import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Add Your Business | Filipino Food Near Me',
  description: 'List your Filipino restaurant, bakery, grocery store, or food truck on the first and only community Filipino food directory in America. Free and easy submission.',
}

export default function AddBusinessPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">Add Your Business</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-3">Join 990+ Filipino Businesses</h2>
            <p className="text-blue-800 text-lg">
              Get featured in <strong>the first and only community Filipino food directory in America</strong> — completely free!
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why List Your Business?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl" role="img" aria-label="Check mark">✅</span>
                <div>
                  <h3 className="font-bold text-gray-900">Increased Visibility</h3>
                  <p className="text-gray-700">Reach Filipino-Americans and food lovers nationwide</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl" role="img" aria-label="Check mark">✅</span>
                <div>
                  <h3 className="font-bold text-gray-900">100% Free</h3>
                  <p className="text-gray-700">No listing fees, no hidden costs</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl" role="img" aria-label="Check mark">✅</span>
                <div>
                  <h3 className="font-bold text-gray-900">Community Support</h3>
                  <p className="text-gray-700">Connect with the Filipino-American community</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl" role="img" aria-label="Check mark">✅</span>
                <div>
                  <h3 className="font-bold text-gray-900">Easy to Update</h3>
                  <p className="text-gray-700">Contact us anytime to update your information</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Eligible Business Types</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <span className="text-3xl mb-2 block" role="img" aria-label="Restaurant">🍽️</span>
                <h3 className="font-bold text-gray-900">Restaurants</h3>
                <p className="text-sm text-gray-600">Full-service Filipino dining</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <span className="text-3xl mb-2 block" role="img" aria-label="Grocery">🛒</span>
                <h3 className="font-bold text-gray-900">Grocery & Markets</h3>
                <p className="text-sm text-gray-600">Filipino ingredients & products</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <span className="text-3xl mb-2 block" role="img" aria-label="Bakery">🥐</span>
                <h3 className="font-bold text-gray-900">Bakeries & Cafes</h3>
                <p className="text-sm text-gray-600">Pandesal, pastries, desserts</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <span className="text-3xl mb-2 block" role="img" aria-label="Food truck">🚚</span>
                <h3 className="font-bold text-gray-900">Food Trucks & Pop-Ups</h3>
                <p className="text-sm text-gray-600">Mobile Filipino food vendors</p>
              </div>
            </div>
          </section>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Submit Your Business</h2>
          
          <form className="space-y-6">
            <div>
              <label htmlFor="business-name" className="block text-sm font-medium text-gray-700 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                id="business-name"
                name="business-name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="e.g., Jollibee, Goldilocks"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category-primary" className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Category *
                </label>
                <select
                  id="category-primary"
                  name="category-primary"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">Select primary category</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Supermarket & Grocery">Supermarket & Grocery</option>
                  <option value="Bakery, Dessert & Cafe">Bakery, Dessert & Cafe</option>
                  <option value="Quick Bites & Turo-Turo">Quick Bites & Turo-Turo</option>
                  <option value="Food Truck & Pop-Up">Food Truck & Pop-Up</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Choose the main type of business
                </p>
              </div>

              <div>
                <label htmlFor="category-secondary" className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Category (Optional)
                </label>
                <select
                  id="category-secondary"
                  name="category-secondary"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">None</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Supermarket & Grocery">Supermarket & Grocery</option>
                  <option value="Bakery, Dessert & Cafe">Bakery, Dessert & Cafe</option>
                  <option value="Quick Bites & Turo-Turo">Quick Bites & Turo-Turo</option>
                  <option value="Food Truck & Pop-Up">Food Truck & Pop-Up</option>
                  <option value="Filipino bakery">Filipino bakery</option>
                  <option value="Filipino grocery">Filipino grocery</option>
                  <option value="Catering">Catering</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  If your business fits multiple categories
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Street Address *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="123 Main Street"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Los Angeles"
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  required
                  maxLength={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="CA"
                />
              </div>

              <div>
                <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-2">
                  Zip Code *
                </label>
                <input
                  type="text"
                  id="zip"
                  name="zip"
                  required
                  maxLength={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="90012"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                  Website (Optional)
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="google-maps" className="block text-sm font-medium text-gray-700 mb-2">
                Google Maps URL (Optional)
              </label>
              <input
                type="url"
                id="google-maps"
                name="google-maps"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="https://maps.google.com/..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Find your business on Google Maps, click "Share", and paste the link here
              </p>
            </div>

            <div>
              <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-2">
                Business Hours (Optional)
              </label>
              <textarea
                id="hours"
                name="hours"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                placeholder="Mon-Fri: 9am-9pm, Sat-Sun: 10am-10pm"
              ></textarea>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Brief Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                placeholder="Tell us about your business, specialties, what makes you unique..."
              ></textarea>
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-2">
                Your Email (for updates) *
              </label>
              <input
                type="email"
                id="contact-email"
                name="contact-email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="you@example.com"
              />
              <p className="text-sm text-gray-500 mt-1">
                We'll use this to confirm your submission and send updates
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> This is a demonstration form. In production, submissions will be emailed to 
                info@filipinofoodnearme.org for review. We typically process submissions within 3-5 business days.
              </p>
            </div>

            <button
              type="submit"
              className="w-full md:w-auto bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-bold transition-all hover:scale-105 text-lg"
            >
              Submit Your Business
            </button>
          </form>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 mt-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">What Happens Next?</h2>
          <ol className="space-y-3 list-none">
            <li className="flex items-start gap-3">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">1</span>
              <div>
                <strong className="text-blue-900">We Review Your Submission</strong>
                <p className="text-blue-800">Our team verifies the information within 3-5 business days</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">2</span>
              <div>
                <strong className="text-blue-900">You Get Confirmation</strong>
                <p className="text-blue-800">We'll email you once your business is listed</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">3</span>
              <div>
                <strong className="text-blue-900">You're Live!</strong>
                <p className="text-blue-800">Your business appears in search results and directory listings</p>
              </div>
            </li>
          </ol>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600">
            Questions? <a href="/contact" className="text-blue-600 hover:text-blue-800 font-medium">Contact us</a>
          </p>
        </div>
      </div>
    </div>
  )
}