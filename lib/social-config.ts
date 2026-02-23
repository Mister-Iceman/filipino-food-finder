// Social Media Configuration
// Add new platforms here - they'll automatically appear in header and footer
export interface SocialPlatform {
  name: string;
  url: string;
  icon: string;
  ariaLabel: string;
  hoverColor: string;
}
export const socialPlatforms: SocialPlatform[] = [
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/filipinofoodnearme/',
    icon: 'FaInstagram',
    ariaLabel: 'Follow us on Instagram',
    hoverColor: '#D1880D',
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/filipinofoodnearme',
    icon: 'FaFacebook',
    ariaLabel: 'Follow us on Facebook',
    hoverColor: '#62438D',
  },
  {
    name: 'TikTok',
    url: 'https://www.tiktok.com/@filipinofoodnearme',
    icon: 'FaTiktok',
    ariaLabel: 'Follow us on TikTok',
    hoverColor: '#BF2F26',
  },
];
