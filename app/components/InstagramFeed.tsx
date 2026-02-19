'use client'

export default function InstagramFeed() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Follow Along 🇵🇭
          </h2>
          <p className="text-gray-600 text-lg mb-4">
            Filipino food finds, community stories, and new spots on Instagram.
          </p>
          
            href="https://www.instagram.com/filipinofoodnearme/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-bold px-6 py-3 rounded-full hover:opacity-90 transition-all"
          >
            {'@filipinofoodnearme'}
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1,2,3,4].map((i) => (
            
              key={i}
              href="https://www.instagram.com/filipinofoodnearme/"
              target="_blank"
              rel="noopener noreferrer"
              className="aspect-square bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 rounded-xl flex flex-col items-center justify-center hover:opacity-80 transition-all group"
            >
              <span className="text-4xl mb-2">🇵🇭</span>
              <span className="text-xs text-gray-500 group-hover:text-pink-500 transition-colors">
                View on Instagram
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}