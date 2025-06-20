import { Noto_Sans_TC } from 'next/font/google';

export const NotoSansTC = Noto_Sans_TC({
  weight: ['400', '500', '700'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
  preload: false,
});
