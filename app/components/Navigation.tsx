'use client'

import Link from 'next/link'
import { useState } from 'react'
import SocialLinks from './SocialLinks';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 font-bold text-xl text-gray-900 hover:text-red-600 transition-colors"
            aria-label="Filipino Food Near Me - Home"
          >
            <span className="text-2xl" role="img" aria-label="Philippine flag">🇵🇭</span>
            <span>Filipino Food Near Me</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <ul className="flex space-x-6 list-none">
              <li>
                <Link href="/" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/directory" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
                  Directory
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/cultural-knowledge-base" className="text-gray-700 hover:text-purple-700 font-medium transition-colors">
                  Learn
                </Link>
              </li>
              <li>
                <Link href="/states" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
                  States
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/add-business"
                  className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-bold transition-all hover:scale-105"
                >
                  Add Your Business
                </Link>
              </li>
            </ul>

            {/* Social Links - Desktop */}
            <div className="border-l border-gray-300 pl-6">
              <SocialLinks />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden text-gray-700 hover:text-red-600"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <ul className="space-y-2 list-none">
              <li>
                <Link href="/" className="block text-gray-700 hover:text-red-600 hover:bg-gray-50 px-4 py-2 rounded transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/directory" className="block text-gray-700 hover:text-red-600 hover:bg-gray-50 px-4 py-2 rounded transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Directory
                </Link>
              </li>
              <li>
                <Link href="/guides" className="block text-gray-700 hover:text-red-600 hover:bg-gray-50 px-4 py-2 rounded transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/cultural-knowledge-base" className="block text-gray-700 hover:text-purple-700 hover:bg-purple-50 px-4 py-2 rounded transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Learn
                </Link>
              </li>
              <li>
                <Link href="/states" className="block text-gray-700 hover:text-red-600 hover:bg-gray-50 px-4 py-2 rounded transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  States
                </Link>
              </li>
              <li>
                <Link href="/events" className="block text-gray-700 hover:text-red-600 hover:bg-gray-50 px-4 py-2 rounded transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Events
                </Link>
              </li>
              <li>
                <Link href="/about" className="block text-gray-700 hover:text-red-600 hover:bg-gray-50 px-4 py-2 rounded transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="block text-gray-700 hover:text-red-600 hover:bg-gray-50 px-4 py-2 rounded transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/support" className="block text-gray-700 hover:text-red-600 hover:bg-gray-50 px-4 py-2 rounded transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Support Us
                </Link>
              </li>
              <li>
                <Link href="/newsroom" className="block text-gray-700 hover:text-purple-700 hover:bg-purple-50 px-4 py-2 rounded transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Newsroom
                </Link>
              </li>
              <li>
                <Link href="/add-business" className="block bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-bold text-center transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Add Your Business
                </Link>
              </li>
            </ul>

            {/* Social Links - Mobile */}
            <div className="mt-4 pt-4 border-t border-gray-200 px-4">
              <SocialLinks />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
