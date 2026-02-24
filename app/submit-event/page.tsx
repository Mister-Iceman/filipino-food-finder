'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function SubmitEventPage() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    event_time: '',
    location_name: '',
    address_street: '',
    city: '',
    state: '',
    zip: '',
    event_url: '',
    category: 'festival',
    submitter_name: '',
    submitter_email: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: submitError } = await supabase
      .from('event_submissions')
      .insert([{
        ...formData,
        status: 'pending'
      }])

    if (submitError) {
      setError('Failed to submit event. Please try again.')
      setLoading(false)
    } else {
      setSubmitted(true)
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h1>
            <p className="text-lg text-gray-700 mb-6">
              Your event has been submitted for review. We'll review it and publish it to the events page if approved.
            </p>
            <p className="text-gray-600 mb-8">
              You'll receive an email at <strong>{formData.submitter_email}</strong> once your event is reviewed.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/events"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold"
              >
                View Events
              </Link>
              <Link
                href="/"
                className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-6 py-3 rounded-lg font-bold"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Link href="/events" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Events
        </Link>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Submit an Event</h1>
          <p className="text-gray-600 mb-6">
            Know about an upcoming Filipino food event? Share it with the community! All submissions are reviewed before publishing.
          </p>

          {/* --- EVENT ELIGIBILITY NOTE --- */}
          <div className="border border-gray-200 rounded-xl overflow-hidden mb-8">
            <div className="px-5 py-3" style={{ background: 'linear-gradient(90deg, #62438D, #92345A)' }}>
              <p className="text-white font-semibold text-sm">What events can be submitted?</p>
            </div>
            <div className="px-5 py-4 bg-gray-50">
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                Our events calendar is focused on Filipino food and Filipino food culture. Events should relate to
                at least one of the following:
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold flex-shrink-0">✓</span>
                  Filipino food festivals, fairs, or markets
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold flex-shrink-0">✓</span>
                  Filipino restaurant grand openings or pop-up dining events
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold flex-shrink-0">✓</span>
                  Filipino cooking classes or food demonstrations
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold flex-shrink-0">✓</span>
                  Community gatherings where Filipino food is a central part of the event
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500 font-bold flex-shrink-0">✗</span>
                  <span className="text-gray-500">General cultural events where food is incidental and not specifically Filipino</span>
                </li>
              </ul>
            </div>
          </div>
          {/* --- END EVENT ELIGIBILITY NOTE --- */}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Information */}
            <div className="border-b pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Filipino Food Festival 2026"
                    className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Tell us about the event, what to expect, special guests, etc."
                    rows={4}
                    className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="festival">🎉 Festival</option>
                    <option value="grand_opening">🏪 Grand Opening</option>
                    <option value="pop_up">🍽️ Pop-Up Event</option>
                    <option value="cooking_class">🎓 Cooking Class</option>
                    <option value="community">🎊 Community Event</option>
                    <option value="tasting">🎤 Tasting & Demo</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="border-b pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Date & Time</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.event_date}
                    onChange={(e) => setFormData({...formData, event_date: e.target.value})}
                    className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Time (Optional)
                  </label>
                  <input
                    type="time"
                    value={formData.event_time}
                    onChange={(e) => setFormData({...formData, event_time: e.target.value})}
                    className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="border-b pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Location</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Venue Name
                  </label>
                  <input
                    type="text"
                    value={formData.location_name}
                    onChange={(e) => setFormData({...formData, location_name: e.target.value})}
                    placeholder="Downtown Convention Center"
                    className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={formData.address_street}
                    onChange={(e) => setFormData({...formData, address_street: e.target.value})}
                    placeholder="123 Main Street"
                    className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      placeholder="Los Angeles"
                      className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={2}
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value.toUpperCase()})}
                      placeholder="CA"
                      className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      value={formData.zip}
                      onChange={(e) => setFormData({...formData, zip: e.target.value})}
                      placeholder="90001"
                      className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="border-b pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Additional Information</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Website or Facebook Event Link
                </label>
                <input
                  type="url"
                  value={formData.event_url}
                  onChange={(e) => setFormData({...formData, event_url: e.target.value})}
                  placeholder="https://example.com/event"
                  className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Share a link where people can learn more or buy tickets
                </p>
              </div>
            </div>

            {/* Your Information */}
            <div className="pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.submitter_name}
                    onChange={(e) => setFormData({...formData, submitter_name: e.target.value})}
                    placeholder="Your name"
                    className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.submitter_email}
                    onChange={(e) => setFormData({...formData, submitter_email: e.target.value})}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    We'll email you when your event is reviewed
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Event for Review'}
            </button>

            <p className="text-sm text-gray-500 text-center">
              By submitting, you confirm that this event is related to Filipino food or Filipino food culture, and that the information provided is accurate.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
