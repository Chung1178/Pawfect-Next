import '@/app/ui/global.scss';
import { NotoSansTC } from '@/app/ui/fonts';

export const metadata = {
  title: 'Pawfect - 你的寵物好夥伴',
  description: '專業的寵物保姆媒合平台',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant">
      <body className={`${NotoSansTC.className} antialiased`}>
        {children}

        <div id="modal-root"></div>
        <div id="datepicker-portal-root"></div>
      </body>
    </html>
  );
}
