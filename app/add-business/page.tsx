'use client'

import { useState } from 'react'

export default function AddBusinessPage() {
  const [formData, setFormData] = useState({
    businessName: '',
    categoryPrimary: '',
    categorySecondary: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    website: '',
    instagram: '',
    facebook: '',
    tiktok: '',
    x: '',
    googleMaps: '',
    hours: '',
    description: '',
    contactEmail: ''
  })
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/submit-business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit business')
      }

      setStatus('success')
      setFormData({
        businessName: '',
        categoryPrimary: '',
        categorySecondary: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        website: '',
        instagram: '',
        facebook: '',
        tiktok: '',
        x: '',
        googleMaps: '',
        hours: '',
        description: '',
        contactEmail: ''
      })
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Failed to submit. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Thank You!</h1>
            <p className="text-xl text-gray-700 mb-6">
              Your business submission has been received successfully!
            </p>
            <p className="text-gray-600 mb-8">
              We will review your submission and email you within 3-5 business days.
            </p>
            <div className="space-x-4">
              <a href="/directory" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold">
                Browse Directory
              </a>
              <button onClick={() => setStatus('idle')} className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold">
                Submit Another Business
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">Add Your Business</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-3">Join 990+ Filipino Businesses</h2>
            <p className="text-blue-800 text-lg">
              Get featured in the first and only community Filipino food directory in America - completely free!
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why List Your Business?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <h3 className="font-bold text-gray-900">Increased Visibility</h3>
                  <p className="text-gray-700">Reach Filipino-Americans and food lovers nationwide</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <h3 className="font-bold text-gray-900">100% Free</h3>
                  <p className="text-gray-700">No listing fees, no hidden costs</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <h3 className="font-bold text-gray-900">Community Support</h3>
                  <p className="text-gray-700">Connect with the Filipino-American community</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
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
                <span className="text-3xl mb-2 block">🍽️</span>
                <h3 className="font-bold text-gray-900">Restaurants</h3>
                <p className="text-sm text-gray-600">Full-service Filipino dining</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <span className="text-3xl mb-2 block">🛒</span>
                <h3 className="font-bold text-gray-900">Grocery & Markets</h3>
                <p className="text-sm text-gray-600">Filipino ingredients & products</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <span className="text-3xl mb-2 block">🥐</span>
                <h3 className="font-bold text-gray-900">Bakeries & Cafes</h3>
                <p className="text-sm text-gray-600">Pandesal, pastries, desserts</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <span className="text-3xl mb-2 block">🚚</span>
                <h3 className="font-bold text-gray-900">Food Trucks & Pop-Ups</h3>
                <p className="text-sm text-gray-600">Mobile Filipino food vendors</p>
              </div>
            </div>
          </section>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Submit Your Business</h2>
          
          {status === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 font-medium">
                ✗ {errorMessage}
              </p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                required
                value={formData.businessName}
                onChange={handleChange}
                disabled={status === 'loading'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100"
                placeholder="e.g., Jollibee, Goldilocks"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="categoryPrimary" className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Category *
                </label>
                <select
                  id="categoryPrimary"
                  name="categoryPrimary"
                  required
                  value={formData.categoryPrimary}
                  onChange={handleChange}
                  disabled={status === 'loading'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100"
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
                <label htmlFor="categorySecondary" className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Category (Optional)
                </label>
                <select
                  id="categorySecondary"
                  name="categorySecondary"
                  value={formData.categorySecondary}
                  onChange={handleChange}
                  disabled={status === 'loading'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100"
                >
                  <option value="">None</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Supermarket & Grocery">Supermarket & Grocery</option>
                  <option value="Bakery, Dessert & Cafe">Bakery, Dessert & Cafe</option>
                  <option value="Quick Bites & Turo-Turo">Quick Bites & Turo-Turo</option>
                  <option value="Food Truck & Pop-Up">Food Truck & Pop-Up</option>
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
                value={formData.address}
                onChange={handleChange}
                disabled={status === 'loading'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100"
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
                  value={formData.city}
                  onChange={handleChange}
                  disabled={status === 'loading'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100"
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
                  value={formData.state}
                  onChange={handleChange}
                  disabled={status === 'loading'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100"
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
                  value={formData.zip}
                  onChange={handleChange}
                  disabled={status === 'loading'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100"
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
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={status === 'loading'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100"
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
                  value={formData.website}
                  onChange={handleChange}
                  disabled={status === 'loading'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Social Media (Optional)</h3>
              <p className="text-sm text-gray-600 mb-4">Connect with customers on social platforms</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-2">
                    Instagram
                  </label>
                  <input
                    type="url"
                    id="instagram"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    disabled={status === 'loading'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100"
                    placeholder="https://instagram.com/yourrestaurant"
                  />
                </div>

                <div>
                  <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-2">
                    Facebook
                  </label>
                  <input
                    type="url"
                    id="facebook"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleChange}
                    disabled={status === 'loading'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100"
                    placeholder="https://facebook.com/yourrestaurant"
                  />
                </div>

                <div>
                  <label htmlFor="tiktok" className="block text-sm font-medium text-gray-700 mb-2">
                    TikTok
                  </label>
                  <input
                    type="url"
                    id="tiktok"
                    name="tiktok"
                    value={formData.tiktok}
                    onChange={handleChange}
                    disabled={status === 'loading'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100"
                    placeholder="https://tiktok.com/@yourrestaurant"
                  />
                </div>

                <div>
                  <label htmlFor="x" className="block text-sm font-medium text-gray-700 mb-2">
                    X (Twitter)
                  </label>
                  <input
                    type="url"
                    id="x"
                    name="x"
                    value={formData.x}
                    onChange={handleChange}
                    disabled={status === 'loading'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100"
                    placeholder="https://x.com/yourrestaurant"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="googleMaps" className="block text-sm font-medium text-gray-700 mb-2">
                Google Maps URL (Optional)
              </label>
              <input
                type="url"
                id="googleMaps"
                name="googleMaps"
                value={formData.googleMaps}
                onChange={handleChange}
                disabled={status === 'loading'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100"
                placeholder="https://maps.google.com/..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Find your business on Google Maps, click Share, and paste the link here
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
                value={formData.hours}
                onChange={handleChange}
                disabled={status === 'loading'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none disabled:bg-gray-100"
                placeholder="Mon-Fri: 9am-9pm, Sat-Sun: 10am-10pm"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Brief Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                disabled={status === 'loading'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none disabled:bg-gray-100"
                placeholder="Tell us about your business, specialties, what makes you unique..."
              />
            </div>

            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Your Email (for updates) *
              </label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                required
                value={formData.contactEmail}
                onChange={handleChange}
                disabled={status === 'loading'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100"
                placeholder="you@example.com"
              />
              <p className="text-sm text-gray-500 mt-1">
                We will use this to confirm your submission and send updates
              </p>
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full md:w-auto bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-bold transition-all hover:scale-105 text-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
            >
              {status === 'loading' ? 'Submitting...' : 'Submit Your Business'}
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
                <p className="text-blue-800">We will email you once your business is listed</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">3</span>
              <div>
                <strong className="text-blue-900">You are Live!</strong>
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