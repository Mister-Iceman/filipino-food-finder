'use client';
import { useState, useEffect } from 'react';

const images = [
  { src: '/images/hero/hero-1.png', alt: 'Filipino food' },
  { src: '/images/hero/hero-2.png', alt: 'Filipino food' },
  { src: '/images/hero/hero-3.png', alt: 'Filipino food' },
  { src: '/images/hero/hero-4.png', alt: 'Filipino food' },
  { src: '/images/hero/hero-5.png', alt: 'Filipino food' },
  { src: '/images/hero/hero-6.png', alt: 'Filipino food' },
];

export default function HeroImageCarousel() {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setCurrent(p => (p + 1) % images.length), 4000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div aria-hidden="true" style={{position:'absolute',inset:0,overflow:'hidden',zIndex:0}}>
      {images.map((img, i) => (
        <img key={i} src={img.src} alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:i===current?1:0,transition:'opacity 1s ease-in-out'}} />
      ))}
      <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.5)'}} />
    </div>
  );
}
