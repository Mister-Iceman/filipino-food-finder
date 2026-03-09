'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const IMAGES = [
  { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Sinigang_na_baboy.jpg/1280px-Sinigang_na_baboy.jpg', alt: 'Sinigang na baboy - Filipino pork tamarind soup' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Chicken_adobo.jpg/1280px-Chicken_adobo.jpg',         alt: 'Filipino chicken adobo' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Lechon_de_leche.jpg/1280px-Lechon_de_leche.jpg',     alt: 'Filipino lechon roasted pig' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Halo-halo.jpg/1280px-Halo-halo.jpg',                 alt: 'Halo-halo Filipino dessert' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Pancit_canton.jpg/1280px-Pancit_canton.jpg',         alt: 'Pancit canton Filipino noodles' },
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
