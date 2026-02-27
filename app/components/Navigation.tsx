'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SocialLinks from './SocialLinks';

export default function Navigation() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchValue.trim()
    if (q) {
      router.push(`/directory?q=${encodeURIComponent(q)}`)
      setMobileSearchOpen(false)
      setMobileMenuOpen(false)
    }
  }

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
            <img src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f1f5-1f1ed.svg" alt="Philippine flag" className="w-7 h-7" />
            <span>Filipino Food Near Me</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <ul className="flex space-x-4 list-none">
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
                <Link href="/cultural-knowledge-base" className="text-gray-700 hover:text-purple-700 font-medium transition-colors whitespace-nowrap text-center">
                  Food Culture
                </Link>
              </li>
              <li>
                <Link href="/newsroom" className="text-gray-700 hover:text-purple-700 font-medium transition-colors">
                  Newsroom
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
                  className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-bold transition-all hover:scale-105 text-center whitespace-nowrap"
                >
                  Add Business
                </Link>
              </li>
            </ul>

            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="relative shrink-0">
              <input
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search Filipino food..."
                aria-label="Search Filipino food"
                className="pl-4 pr-9 py-2 rounded-full border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#0038A8] focus:bg-white w-44 focus:w-56 transition-all duration-200"
              />
              <button
                type="submit"
                aria-label="Submit search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0038A8] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

            {/* Social Links - Desktop */}
            <div className="border-l border-gray-300 pl-4">
              <SocialLinks />
            </div>
          </div>

          {/* Mobile: search icon + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={() => { setMobileSearchOpen(!mobileSearchOpen); setMobileMenuOpen(false) }}
              aria-label="Toggle search"
              className="text-gray-700 hover:text-[#0038A8] p-1"
            >
              {mobileSearchOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </button>

            <button
              type="button"
              className="md:hidden text-gray-700 hover:text-red-600"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => { setMobileMenuOpen(!mobileMenuOpen); setMobileSearchOpen(false) }}
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
        </div>

        {/* Mobile Search Bar */}
        {mobileSearchOpen && (
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search Filipino food..."
                aria-label="Search Filipino food"
                autoFocus
                className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0038A8] focus:bg-white"
              />
              <button
                type="submit"
                aria-label="Submit search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0038A8] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
        )}

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
                  Food Culture
                </Link>
              </li>
              <li>
                <Link href="/newsroom" className="block text-gray-700 hover:text-purple-700 hover:bg-purple-50 px-4 py-2 rounded transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Newsroom
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
                <Link href="/add-business" className="block bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-bold text-center transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Add Business
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
