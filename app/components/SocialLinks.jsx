'use client';
import { FaInstagram, FaFacebook, FaTiktok } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
export default function SocialLinks() {
  return (
    <div className="flex items-center space-x-4">
      <a href="https://www.instagram.com/filipinofoodnearme/" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram">
        <FaInstagram className="text-2xl text-gray-400 hover:text-pink-500 transition-colors" />
      </a>
      <a href="https://www.facebook.com/profile.php?id=61588169559301" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook">
        <FaFacebook className="text-2xl text-gray-400 hover:text-blue-500 transition-colors" />
      </a>
      <a href="https://www.tiktok.com/@filipinofoodnearme" target="_blank" rel="noopener noreferrer" aria-label="Follow us on TikTok">
        <FaTiktok className="text-2xl text-gray-400 hover:text-black transition-colors" />
      </a>
      <a href="https://x.com/FilFoodNM_org" target="_blank" rel="noopener noreferrer" aria-label="Follow us on X (Twitter)">
        <FaXTwitter className="text-2xl text-gray-400 hover:text-black transition-colors" />
      </a>
    </div>
  );
}
