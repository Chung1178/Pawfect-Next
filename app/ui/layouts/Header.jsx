'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.scss';
import { useTooltip } from '@/app/hooks/useBootstrap';
import Logo from '../common/Logo/Logo';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/lib/contexts/AuthContext';

export default function Header() {
  useTooltip();
  const [hasScrolled, setHasScrolled] = useState(false);
  const offcanvasRef = useRef(null);
  const offcanvasInstanceRef = useRef(null);
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();

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
    const loadBootstrap = async () => {
      if (typeof window !== 'undefined') {
        const { Offcanvas } = await import('bootstrap');
        offcanvasInstanceRef.current = new Offcanvas(offcanvasRef.current, {
          backdrop: false,
        });
      }
    };

    loadBootstrap();

    return () => {
      if (
        offcanvasInstanceRef.current &&
        typeof offcanvasInstanceRef.current.dispose === 'function'
      ) {
        offcanvasInstanceRef.current.dispose();
      }
    };
  }, []);

  const handleLinkClick = (e, href) => {
    e.preventDefault();

    if (offcanvasInstanceRef.current) {
      offcanvasInstanceRef.current.hide();
      setTimeout(() => {
        router.push(href);
      }, 350);
    } else {
      router.push(href);
    }
  };

  const toggleOffcanvas = () => {
    if (offcanvasInstanceRef.current) {
      offcanvasInstanceRef.current.toggle();
    }
  };

  const navLinks = [
    { href: '/sitters', text: '搜尋保母' },
    { href: '/become-a-sitter', text: '成為保母', disabled: true },
    { href: '/#index-qna', text: '常見問題' },
  ];

  const authLinks = (
    <>
      <Link
        href="/login"
        className="d-lg-none btn btn-outline-primary w-100"
        tabIndex="-1"
        onClick={(e) => handleLinkClick(e, '/login')}
      >
        登入
      </Link>
      <Link
        href="/login"
        className="d-none d-lg-block btn text-primary border-0 p-0 flex-shrink-0 me-6"
        tabIndex="-1"
        onClick={(e) => handleLinkClick(e, '/login')}
      >
        登入
      </Link>
      <Link
        href="/register"
        className="btn btn-primary w-100 w-lg-auto text-white mb-4 mb-lg-0"
        tabIndex="-1"
        onClick={(e) => handleLinkClick(e, '/register')}
      >
        註冊
      </Link>
    </>
  );

  const userProfiles = (
    <>
    <div className='d-flex align-items-center'>
      <span className="navbar-text me-5">你好, {user?.name}</span>
      <button className="btn btn-outline-primary" onClick={logout}>
        登出
      </button>
    </div>
    </>
  );

  return (
    <nav
      className={`navbar fixed-top navbar-expand-lg py-lg-5 py-4 bg-light ${
        hasScrolled ? styles.navbarShadow : ''
      }`}
      id="navbar"
    >
      <div className={`${styles.headerContainer} container`}>
        <Logo className="navbar-brand" />

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
            <Logo className="navbar-brand" onClick={handleLinkClick} />
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
                  {link.disabled ? (
                    <span
                      className="d-inline-block"
                      tabIndex="0"
                      data-bs-toggle="tooltip"
                      data-bs-placement="bottom"
                      title="功能即將上線，敬請期待！"
                    >
                      <Link
                        href="#"
                        className="nav-link link-gray-100 disabled"
                        tabIndex="-1"
                        aria-disabled="true"
                        onClick={(e) => e.preventDefault()}
                      >
                        {link.text}
                      </Link>
                    </span>
                  ) : (
                    <Link
                      href={link.href}
                      className="nav-link link-gray-100"
                      onClick={(e) => {
                        handleLinkClick(e, link.href);
                      }}
                    >
                      {link.text}
                    </Link>
                  )}
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
              {isAuthenticated? userProfiles : authLinks}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
