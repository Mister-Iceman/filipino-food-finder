export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">About</h3>
            <ul className="space-y-2 list-none">
              <li>
                <a href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/support" className="text-gray-400 hover:text-white transition-colors">
                  Support Us
                </a>
              </li>
              <li>
                <a href="/add-business" className="text-gray-400 hover:text-white transition-colors">
                  Add Your Business
                </a>
              </li>
            </ul>
          </div>

          {/* Directory Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">Directory</h3>
            <ul className="space-y-2 list-none">
              <li>
                <a href="/directory" className="text-gray-400 hover:text-white transition-colors">
                  Browse All Restaurants
                </a>
              </li>
              <li>
                <a href="/directory?category=Restaurant" className="text-gray-400 hover:text-white transition-colors">
                  Restaurants
                </a>
              </li>
              <li>
                <a href="/directory?category=Supermarket%20%26%20Grocery" className="text-gray-400 hover:text-white transition-colors">
                  Grocery Stores
                </a>
              </li>
              <li>
                <a href="/directory?category=Bakery%2C%20Dessert%20%26%20Cafe" className="text-gray-400 hover:text-white transition-colors">
                  Bakeries & Cafes
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-2 list-none">
              <li>
                <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/accessibility" className="text-gray-400 hover:text-white transition-colors">
                  Accessibility
                </a>
              </li>
            </ul>
          </div>

          {/* Connect Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">Connect</h3>
            <p className="text-gray-400 mb-4">
              The first and only community Filipino food directory in America
            </p>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl" role="img" aria-label="Philippine flag">🇵🇭</span>
              <span className="text-gray-300 font-medium">Filipino Food Near Me</span>
            </div>
            <a 
              href="mailto:info@filipinofoodnearme.org" 
              className="text-gray-400 hover:text-white transition-colors"
            >
              info@filipinofoodnearme.org
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © 2026 Filipino Food Near Me. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Google Maps™ is a trademark of Google LLC.
              </p>
            </div>
            <p className="text-gray-500 text-xs text-center md:text-right max-w-md">
              <strong>Disclaimer:</strong> Information may not be current. Ratings from Google Maps. 
              Contact businesses directly to verify details.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}