'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const IMAGES = [
  { src: '/images/hero/hero-1.png', alt: 'Sinigang na baboy - Filipino pork tamarind soup' },
  { src: '/images/hero/hero-2.png', alt: 'Chicken adobo - Filipino braised chicken' },
  { src: '/images/hero/hero-3.png', alt: 'Lechon kawali - Filipino crispy pork belly' },
  { src: '/images/hero/hero-4.png', alt: 'Halo-halo - Filipino shaved ice dessert' },
  { src: '/images/hero/hero-5.png', alt: 'Kamayan feast on banana leaves' },
  { src: '/images/hero/hero-6.png', alt: 'Lumpia Shanghai - Filipino crispy spring rolls' },
]

export default function HeroImageCarousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % IMAGES.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div aria-hidden className="absolute inset-0">
      {IMAGES.map((img, i) => (
        <div
          key={img.src}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-black/50" />
    </div>
  )
}
