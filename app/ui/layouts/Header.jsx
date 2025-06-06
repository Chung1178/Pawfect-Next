'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.scss';
import { Offcanvas } from 'bootstrap';

export default function Header() {
  const [hasScrolled, setHasScrolled] = useState(false);
  const offcanvasRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const offcanvasElement = offcanvasRef.current;
    let bsOffcanvas; 

    if (offcanvasElement) {
      bsOffcanvas = new Offcanvas(offcanvasElement, {
        backdrop: false,
      });
    }

    return () => {
      if (bsOffcanvas && typeof bsOffcanvas.dispose === 'function') {
        bsOffcanvas.dispose();
      }
    };
  }, []);

  const handleLinkClick = () => {
    const offcanvasInstance = Offcanvas.getInstance(offcanvasRef.current);
    if (offcanvasInstance) {
      offcanvasInstance.hide();
    }
  };

  const toggleOffcanvas = () => {
    const offcanvasInstance = Offcanvas.getInstance(offcanvasRef.current);
    if (offcanvasInstance) {
      offcanvasInstance.toggle();
    }
  };

  const navLinks = [
    { href: '/sitters', text: '搜尋保母' },
    { href: '/become-a-sitter', text: '成為保母' },
    { href: '/#index-qna', text: '常見問題' },
  ];

  return (
    <nav
      className={`navbar fixed-top navbar-expand-lg py-lg-5 py-4 bg-light ${
        hasScrolled ? styles.navbarShadow : ''
      }`}
      id="navbar"
    >
      <div className="container">
        <Link href="/" className="navbar-brand">
          <Image
            src="/layout/layout-header-logo.png"
            alt="PetSitter Logo Desktop"
            width={178}
            height={48}
            className="d-none d-lg-block"
            priority
          />
          <Image
            src="/layout/layout-header-logo-sm.png"
            alt="PetSitter Logo Mobile"
            width={140}
            height={40}
            className="d-lg-none"
            priority
          />
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={toggleOffcanvas}
          aria-controls="offcanvasNavbar"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          ref={offcanvasRef}
          className="offcanvas offcanvas-top"
          tabIndex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className={`offcanvas-header p-4 ${styles.headerNavBgColor}`}>
            <Link href="/" className="navbar-brand" onClick={handleLinkClick}>
              <Image
                src="/layout/layout-header-logo-sm.png"
                alt="logo"
                width={122}
                height={27}
              />
            </Link>
            <button
              type="button"
              className="btn-close text-reset"
              onClick={handleLinkClick}
              aria-label="Close"
            ></button>
          </div>
          <div
            className={`offcanvas-body d-flex flex-column flex-lg-row px-4 px-lg-0 ${styles.headerNavBgColor}`}
          >
            <ul className="navbar-nav flex-grow-1 mb-13 mb-lg-0">
              {navLinks.map((link) => (
                <li
                  className={`nav-item my-9 my-lg-0 mx-lg-12 ${styles.navItem}`}
                  key={link.href}
                >
                  <Link
                    href={link.href}
                    className="nav-link link-gray-100"
                    onClick={handleLinkClick}
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="d-flex flex-column-reverse h-100 flex-lg-row align-items-center">
              <Image
                src="/layout/layout-header-woman.png"
                alt="woman"
                width={351}
                height={265}
                className="d-lg-none d-block mt-auto"
                style={{ objectFit: 'contain' }}
              />
              <Link
                href="/login"
                className="d-lg-none btn btn-outline-primary w-100"
                onClick={handleLinkClick}
              >
                登入
              </Link>
              <Link
                href="/login"
                className="d-none d-lg-block flex-shrink-0 me-6"
                onClick={handleLinkClick}
              >
                登入
              </Link>
              <Link
                href="/register"
                className="btn btn-primary w-100 w-lg-auto text-white mb-4 mb-lg-0"
                onClick={handleLinkClick}
              >
                註冊
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
