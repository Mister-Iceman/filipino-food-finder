import Link from 'next/link'

export default function CityPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          City Guide Coming Soon
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          We're building comprehensive city guides with cultural history, neighborhood highlights, and restaurant features.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/directory"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold transition-colors"
          >
            Browse Directory
          </Link>
          <Link
            href="/guides"
            className="bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-900 px-8 py-3 rounded-lg font-bold transition-colors"
          >
            View Guides
          </Link>
        </div>
      </div>
    </div>
  )
}