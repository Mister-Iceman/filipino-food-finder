import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Listing Policy | FilipinoFoodNearMe.org',
  description: 'Learn what types of Filipino food businesses qualify for a listing in the FilipinoFoodNearMe.org community directory.',
}

export default function ListingPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-3xl mx-auto px-4">

        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Listing Policy</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Listing Policy</h1>
          <p className="text-lg text-gray-600">
            FilipinoFoodNearMe.org is a community-powered directory for Filipino food businesses across the United States.
            This policy explains what qualifies for a listing — and why we review each submission before publishing.
          </p>
        </div>

        {/* Our Focus */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Focus: Filipino Food</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Every business in our directory must have a meaningful connection to Filipino food. That connection
            doesn't have to be exclusive — we welcome restaurants of all backgrounds that serve Filipino dishes,
            groceries that carry Filipino products, and fusion concepts that genuinely incorporate Filipino flavors.
          </p>
          <p className="text-gray-700 leading-relaxed">
            What we don't list: general restaurants, cafés, or shops with no Filipino food presence, even if
            they are Filipino-owned. Ownership is not a criterion — Filipino food on the menu or shelves is.
          </p>
        </div>

        {/* Eligibility tiers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What Qualifies for a Listing</h2>

          <div className="space-y-6">

            {/* Tier 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                style={{ background: 'linear-gradient(135deg, #62438D, #92345A)' }}>
                1
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Filipino cuisine is a primary offering</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Filipino dishes make up the majority of the menu, or there is a dedicated Filipino section.
                  This includes traditional Filipino restaurants, turo-turo counters, and Filipino bakeries.
                </p>
              </div>
            </div>

            {/* Tier 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                style={{ background: 'linear-gradient(135deg, #92345A, #BF2F26)' }}>
                2
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Filipino fusion or inspired concepts</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Filipino flavors are meaningfully and consistently present — not just as a one-time special or
                  a single token item. Examples: Filipino-Mexican fusion trucks, Filipino-inspired brunch menus,
                  or Filipino dessert concepts at a multi-cuisine café.
                </p>
              </div>
            </div>

            {/* Tier 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                style={{ background: 'linear-gradient(135deg, #BF2F26, #CB5B16)' }}>
                3
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Filipino food retail and grocery</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  The business carries a meaningful selection of Filipino food products, ingredients, or
                  ready-made Filipino items. This includes Filipino grocery stores, Asian supermarkets with a
                  dedicated Filipino aisle, and Filipino specialty food retailers.
                </p>
              </div>
            </div>

            {/* Tier 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                style={{ background: 'linear-gradient(135deg, #CB5B16, #D1880D)' }}>
                4
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Minimum threshold</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  At minimum, a business must offer at least 3 Filipino food items regularly on its menu or
                  shelves — OR one clearly promoted Filipino signature item that is available consistently
                  (not seasonally or by special request only).
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* What does NOT qualify */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What Does Not Qualify</h2>
          <ul className="space-y-3 text-gray-700 text-sm leading-relaxed">
            <li className="flex gap-3">
              <span className="text-red-500 font-bold flex-shrink-0">✗</span>
              <span>General restaurants, cafés, or shops with no Filipino food presence on the regular menu</span>
            </li>
            <li className="flex gap-3">
              <span className="text-red-500 font-bold flex-shrink-0">✗</span>
              <span>Businesses that offered Filipino food in the past but no longer do</span>
            </li>
            <li className="flex gap-3">
              <span className="text-red-500 font-bold flex-shrink-0">✗</span>
              <span>Businesses that are permanently or indefinitely closed</span>
            </li>
            <li className="flex gap-3">
              <span className="text-red-500 font-bold flex-shrink-0">✗</span>
              <span>Filipino-owned businesses whose products or services are not food-related</span>
            </li>
            <li className="flex gap-3">
              <span className="text-red-500 font-bold flex-shrink-0">✗</span>
              <span>Catering businesses with no public-facing storefront or ordering access</span>
            </li>
          </ul>
        </div>

        {/* Note on existing listings */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold text-amber-900 mb-2">A Note on Existing Listings</h2>
          <p className="text-amber-800 text-sm leading-relaxed">
            Our directory was initially built using community submissions and third-party data sources. Some
            existing listings may not fully meet this policy. If you find a listing that doesn't belong,
            or if your own business has been incorrectly listed, please{' '}
            <Link href="/contact" className="underline font-medium">contact us</Link> and we will review
            and remove it within 3–5 business days. We appreciate your help keeping the directory accurate.
          </p>
        </div>

        {/* Filipino-Owned badge */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Filipino-Owned Businesses</h2>
          <p className="text-gray-700 leading-relaxed">
            Being Filipino-owned is not a requirement for listing — and is not checked during review.
            However, if a business chooses to identify as Filipino-owned when submitting, we may display
            a voluntary <strong>"Filipino-Owned"</strong> highlight on the listing as a community courtesy.
            This is always optional and never affects eligibility or placement.
          </p>
        </div>

        {/* Events policy */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Event Submissions</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Events submitted to our community calendar must be related to Filipino food or Filipino food culture.
            This includes:
          </p>
          <ul className="space-y-2 text-gray-700 text-sm leading-relaxed mb-4">
            <li className="flex gap-3">
              <span className="text-green-600 font-bold flex-shrink-0">✓</span>
              <span>Filipino food festivals, fairs, and markets</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-bold flex-shrink-0">✓</span>
              <span>Filipino restaurant grand openings and pop-ups</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-bold flex-shrink-0">✓</span>
              <span>Filipino cooking classes and food demonstrations</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-bold flex-shrink-0">✓</span>
              <span>Community gatherings where Filipino food is a central part of the event</span>
            </li>
            <li className="flex gap-3">
              <span className="text-red-500 font-bold flex-shrink-0">✗</span>
              <span>General community or cultural events where food is incidental and not specifically Filipino</span>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            Ready to submit your business?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/add-business"
              className="inline-block bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-bold transition-colors"
            >
              Add Your Business
            </Link>
            <Link
              href="/contact"
              className="inline-block bg-white border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Contact Us
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            Last updated: February 2026 · Questions? Email{' '}
            <a href="mailto:info@filipinofoodnearme.org" className="text-blue-600 hover:underline">
              info@filipinofoodnearme.org
            </a>
          </p>
        </div>

      </div>
    </div>
  )
}