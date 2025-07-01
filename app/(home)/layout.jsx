import '@/app/ui/global.scss';
import { NotoSansTC } from '../ui/fonts';
import Header from '../ui/layouts/Header';
import Footer from '../ui/layouts/Footer';

export const metadata = {
  title: 'Pawfect',
  description: 'Pet sitter search app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${NotoSansTC.className}`}>
        <Header />
        {children}
        <Footer />
        <div id="modal-root"></div>
        <div id="datepicker-portal-root"></div>
      </body>
    </html>
  );
}
