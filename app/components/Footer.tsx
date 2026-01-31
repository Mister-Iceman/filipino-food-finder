import Link from 'next/link'

export default function Footer() {
  return (
    <footer role="contentinfo" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About Column */}
          <div>
            <h3 className="text-lg font-bold mb-4">About</h3>
            <p className="text-gray-400 text-sm mb-4">
              The first and only community Filipino food directory in America. Connecting communities to authentic Filipino cuisine coast to coast.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 list-none">
              <li>
                <Link href="/" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/directory" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">
                  Directory
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/add-business" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">
                  Add Your Business
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-2 list-none">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">
                  Accessibility
                </Link>
              </li>
              <li>
                <Link href="/privacy#ccpa" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">
                  Do Not Sell My Info (CCPA)
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <ul className="space-y-2 list-none text-gray-400 text-sm">
              <li>
                <a href="mailto:info@filipinofoodnearme.org" className="hover:text-yellow-400 transition-colors">
  info@filipinofoodnearme.org
</a>
              </li>
              <li className="pt-4">
                <p className="text-xs">
                  Los Angeles, California
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
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