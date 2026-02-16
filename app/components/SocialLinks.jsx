'use client';

import { FaInstagram } from 'react-icons/fa';

export default function SocialLinks() {
  return (
    <div className="flex items-center space-x-6">
      <a href="https://www.instagram.com/filipinofoodnearme/" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram">
        <FaInstagram className="text-2xl text-gray-400 hover:text-gray-600" />
      </a>
    </div>
  );
}