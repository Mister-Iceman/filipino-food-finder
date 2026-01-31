import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | Filipino Food Near Me',
  description: 'Learn about the first and only community Filipino food directory in America. Our mission is connecting Filipino-American communities to authentic cuisine across all 50 states.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">About Us</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Filipino Food Near Me is <strong>the first and only community-driven directory</strong> dedicated to connecting 
              Filipino-Americans and food lovers to authentic Filipino cuisine across the United States.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Finding authentic Filipino food shouldn't be a challenge. Whether you're craving your grandmother's adobo, 
              searching for fresh lumpia, or hunting for the best halo-halo in your city, we're here to help.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Built by the community, for the community, our directory showcases <strong>990+ Filipino restaurants, 
              bakeries, grocery stores, and food trucks</strong> across all 50 states.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <ul className="space-y-3 list-none">
              <li className="flex items-start gap-3">
                <span className="text-2xl" role="img" aria-label="Check mark">✅</span>
                <div>
                  <strong className="text-gray-900">Comprehensive Directory:</strong>
                  <p className="text-gray-700">Nearly 1,000 verified Filipino businesses across America</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl" role="img" aria-label="Check mark">✅</span>
                <div>
                  <strong className="text-gray-900">Easy Search:</strong>
                  <p className="text-gray-700">Find restaurants by name, city, state, zip code, or category</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl" role="img" aria-label="Check mark">✅</span>
                <div>
                  <strong className="text-gray-900">Community-Driven:</strong>
                  <p className="text-gray-700">Submit your favorite spots and help grow our directory</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl" role="img" aria-label="Check mark">✅</span>
                <div>
                  <strong className="text-gray-900">Always Free:</strong>
                  <p className="text-gray-700">Access to the directory is free for everyone, forever</p>
                </div>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-blue-900 mb-2">Community First</h3>
                <p className="text-gray-700">Built by Filipinos, for Filipinos and everyone who loves Filipino food</p>
              </div>
              <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-red-900 mb-2">Authenticity</h3>
                <p className="text-gray-700">Celebrating genuine Filipino cuisine and culture</p>
              </div>
              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-yellow-900 mb-2">Accessibility</h3>
                <p className="text-gray-700">Making Filipino food discoverable nationwide</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Community</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              We're always looking to expand our directory and connect more people to Filipino food. If you own a 
              Filipino restaurant, bakery, or food business, we'd love to feature you.
            </p>
            <div className="flex gap-4">
              <a 
                href="/add-business" 
                className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-bold transition-all hover:scale-105"
              >
                Add Your Business
              </a>
              <a 
                href="/contact" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-all hover:scale-105"
              >
                Contact Us
              </a>
            </div>
          </section>

          <section className="border-t pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Important Disclaimers</h3>
            <div className="space-y-4 text-sm text-gray-600">
              <p>
                <strong className="text-gray-900">Independence:</strong> Filipino Food Near Me is an independent directory 
                and is not affiliated with any of the businesses listed. We do not own, operate, or endorse any listed establishments.
              </p>
              <p>
                <strong className="text-gray-900">Information Accuracy:</strong> We strive to provide accurate information, 
                but details may change without notice. Please contact businesses directly to verify hours, menu items, prices, 
                and other details before visiting.
              </p>
              <p>
                <strong className="text-gray-900">Ratings & Reviews:</strong> Star ratings and review counts are sourced from 
                Google Maps and reflect opinions of Google users, not Filipino Food Near Me. We do not verify, create, or moderate 
                these ratings. For current ratings and full reviews, visit the business's Google Maps page.
              </p>
              <p>
                <strong className="text-gray-900">Google Maps:</strong> Links to Google Maps are provided for convenience. 
                Google Maps™ is a trademark of Google LLC. We are not affiliated with Google.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}