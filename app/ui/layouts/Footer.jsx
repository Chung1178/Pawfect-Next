import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.scss';

// 導航連結資料
const navLinks = [
  { href: '/sitters', text: '搜尋保母' },
  { href: '/become-a-sitter', text: '成為保母' },
  { href: '/#index-qna', text: '常見問題' },
  { href: '/login', text: '登入註冊' },
];

// 社群連結資料
const socialLinks = [
  {
    href: 'https://www.facebook.com/',
    src: '/layout/facebook-footer.svg',
    alt: 'facebook-icon',
  },
  {
    href: 'https://x.com/',
    src: '/layout/twitter-footer.svg',
    alt: 'twitter-icon',
  },
  {
    href: 'https://www.instagram.com/',
    src: '/layout/ig-footer.svg',
    alt: 'instagram-icon',
  },
];

const SocialIcons = ({ className = '' }) => (
  <div className={`${styles.socialIcons} ${className}`}>
    {socialLinks.map((social, index) => (
      <a
        href={social.href}
        key={social.alt}
        target="_blank"
        rel="noopener noreferrer"
        className={index < socialLinks.length - 1 ? 'me-5' : ''}
      >
        <Image src={social.src} alt={social.alt} width={40} height={40} />
      </a>
    ))}
  </div>
);

export default function Footer() {
  return (
    <footer className={`footer ${styles['bg-gradient-thirdly']} py-9 py-lg-17`}>
      <div className="container">
        <div className="d-md-flex justify-content-md-between align-items-md-center mb-6 mb-md-11">
          <div>
            <Link href="/" className="mb-4 mb-md-0 d-block">
              <Image
                className={styles.footerLogo}
                src="/layout/logo-white.svg"
                alt="Pawfect Care Logo"
                width={178}
                height={48}
                priority
              />
            </Link>
            {/* 手機版社群連結 */}
            <div className="d-md-none pb-6 mt-5 border-bottom border-light">
              <SocialIcons />
            </div>
          </div>

          <div className="pt-6 pt-md-0">
            <div className="row">
              {navLinks.map((link) => (
                <div className="col-6 col-md-auto mb-5 mb-md-0" key={link.text}>
                  <Link
                    href={link.href}
                    className="text-light fs-10 fs-md-9 opacity-70-hover transition-base"
                  >
                    {link.text}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="d-md-flex justify-content-md-between pb-6 pb-md-11 border-bottom border-light">
          <div className="d-md-flex">
            <div className="text-light fs-10 fs-md-9 mb-5 mb-md-0 me-md-9">
              <p className="fw-bold mb-1">信箱</p>
              <a
                href="mailto:pawfectcare@gmail.com"
                className="text-light opacity-70-hover transition-base"
              >
                pawfectcare@gmail.com
              </a>
            </div>
            <div className="text-light fs-10 fs-md-9">
              <p className="fw-bold mb-1">電話</p>
              <a
                href="tel:02-1234-5678"
                className="text-light opacity-70-hover transition-base"
              >
                02-1234-5678
              </a>
            </div>
          </div>

          {/* 電腦版社群連結 */}
          <div className="d-none d-md-block">
            <SocialIcons />
          </div>
        </div>

        <div className="pt-6 pt-md-11 text-light text-center">
          <p className="fs-11 fs-md-10 mb-0">
            © 2024 Pawfect Care. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
