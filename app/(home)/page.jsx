import styles from '@/app/ui/pages/home.module.scss';
import Image from 'next/image';
import Link from 'next/link';

import { FAQ_DATA } from '@/app/lib/placeholder-data';

import TestimonialsSlider from '../ui/components/TestimonialsSlider';
import React from 'react';
import FaqAccordion from '../ui/components/FaqAccordion';
import SitterSearch from '../ui/components/SitterSearch';
import ServiceSection from '../ui/components/ServiceSection';
import OrderProcessSection from '../ui/components/OrderProcessSection';

// 資料引入
const faqData = FAQ_DATA;

export default function HomePage() {
  return (
    <>
      <main>
        <div className={`${styles.navbarArea}`}></div>
        {/* --- Sitter Banner Section --- */}
        <section className={`${styles.bannerBg}`}>
          <div className="container">
            <div className={`${styles.banner} row position-relative`}>
              <div className="banner-title col-6 w-lg-50 pt-19 pt-lg-28">
                <h1 className="text-white fs-3 fs-lg-1 mb-5 position-relative">
                  最值得您
                  <br />
                  信賴的
                  <span className="d-lg-none">
                    <br />
                  </span>
                  寵物保母
                </h1>
                <p className="d-none d-lg-block text-white fs-7">
                  我們用心為每一位毛孩提供無微不至的照顧服務，讓您的孩子在保母們的呵護下，感受到最真摯的關愛與溫暖
                </p>
              </div>
              <SitterSearch />
            </div>
          </div>
        </section>

        {/* --- Services Section --- */}
        <ServiceSection />

        {/* --- Testimonials Section --- */}
        <TestimonialsSlider />

        {/* --- Order Process Section --- */}
        <OrderProcessSection />

        {/* --- FAQ Section --- */}
        <section className={styles.qnaCatDeco} id="index-qna">
          <div className={`container ${styles.qnaContent}`}>
            <div className="row justify-content-center">
              <div className="col col-md-8 text-center">
                <div className={styles.qnaTitleContainer}>
                  <h2>常見問題</h2>
                </div>
                <FaqAccordion faqData={faqData} />
              </div>
            </div>
          </div>
        </section>

        {/* --- Floating Button --- */}
        <Link
          href="/sitters"
          className={`${styles.fixedButton} bg-primary border border-light rounded-circle d-flex justify-content-center align-items-center text-light text-center fs-11 fs-md-10 text-decoration-none`}
        >
          立即預約
          <br />
          完美保母
        </Link>
      </main>
    </>
  );
}
