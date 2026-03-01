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
  const [foodCultureOpen, setFoodCultureOpen] = useState(false)

  const DISHES = [
    { slug: 'adobo',           name: 'Adobo' },
    { slug: 'lechon',          name: 'Lechon' },
    { slug: 'sisig',           name: 'Sisig' },
    { slug: 'lumpia',          name: 'Lumpia' },
    { slug: 'halo-halo',       name: 'Halo-Halo' },
    { slug: 'pancit',          name: 'Pancit' },
    { slug: 'sinigang',        name: 'Sinigang' },
    { slug: 'kare-kare',       name: 'Kare-Kare' },
    { slug: 'ube',             name: 'Ube' },
    { slug: 'silog',           name: 'Silog' },
    { slug: 'dinuguan',        name: 'Dinuguan' },
    { slug: 'tapsilog',        name: 'Tapsilog' },
    { slug: 'palabok',         name: 'Palabok' },
    { slug: 'turon',           name: 'Turon' },
    { slug: 'peach-mango-pie', name: 'Peach Mango Pie' },
    { slug: 'garlic-rice',     name: 'Garlic Rice' },
  ]

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
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 font-bold text-xl text-gray-900 hover:text-red-600 transition-colors shrink-0 whitespace-nowrap"
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
              <li
                className="relative"
                onMouseEnter={() => setFoodCultureOpen(true)}
                onMouseLeave={() => setFoodCultureOpen(false)}
              >
                <button
                  className="flex items-center gap-1 text-gray-700 hover:text-purple-700 font-medium transition-colors whitespace-nowrap"
                  aria-haspopup="true"
                  aria-expanded={foodCultureOpen}
                  onClick={() => setFoodCultureOpen(!foodCultureOpen)}
                >
                  Food Culture
                  <svg className={`h-3.5 w-3.5 transition-transform ${foodCultureOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {foodCultureOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-4 w-80 z-50">
                    <Link
                      href="/cultural-knowledge-base"
                      className="block text-sm font-semibold text-purple-700 hover:text-purple-900 mb-3 pb-3 border-b border-gray-100"
                      onClick={() => setFoodCultureOpen(false)}
                    >
                      📚 Cultural Knowledge Base →
                    </Link>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Browse by Dish</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3">
                      {DISHES.map((dish) => (
                        <Link
                          key={dish.slug}
                          href={`/dishes/${dish.slug}`}
                          className="text-sm text-gray-600 hover:text-purple-700 py-0.5 transition-colors"
                          onClick={() => setFoodCultureOpen(false)}
                        >
                          {dish.name}
                        </Link>
                      ))}
                    </div>
                    <Link
                      href="/dishes"
                      className="block text-xs font-semibold text-[#0038A8] hover:text-blue-800 pt-2 border-t border-gray-100"
                      onClick={() => setFoodCultureOpen(false)}
                    >
                      View All Dishes →
                    </Link>
                  </div>
                )}
              </li>
              <li>
                <Link href="/newsroom" className="text-gray-700 hover:text-purple-700 font-medium transition-colors">
                  Newsroom
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
                placeholder="Search..."
                aria-label="Search Filipino food"
                className="pl-4 pr-9 py-2 rounded-full border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#0038A8] focus:bg-white w-28 focus:w-40 transition-all duration-200"
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

            {/* Social Links - Desktop (lg+ now that States link is removed) */}
            <div className="hidden lg:flex border-l border-gray-300 pl-4">
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
                <Link href="/dishes" className="block text-gray-600 hover:text-purple-700 hover:bg-purple-50 px-4 py-2 rounded transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>
                  &nbsp;&nbsp;↳ Browse Dishes
                </Link>
              </li>
              <li>
                <Link href="/newsroom" className="block text-gray-700 hover:text-purple-700 hover:bg-purple-50 px-4 py-2 rounded transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Newsroom
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
