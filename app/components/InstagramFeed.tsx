"use client"

import { useEffect } from "react"

export default function InstagramFeed() {
  useEffect(() => {
    const s = document.createElement("script")
    s.type = "module"
    s.src = "https://w.behold.so/widget.js"
    document.head.appendChild(s)
  }, [])

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Follow Along</h2>
          <p className="text-gray-600 text-lg mb-4">Filipino food finds, community stories, and new spots on Instagram.</p>
          <a href="https://www.instagram.com/filipinofoodnearme/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-bold px-6 py-3 rounded-full hover:opacity-90 transition-all">@filipinofoodnearme</a>
        </div>
        <div dangerouslySetInnerHTML={{ __html: `<behold-widget feed-id="yzVwBVTjOwP17MeEtfJA"></behold-widget>` }} />
      </div>
    </section>
  )
}
