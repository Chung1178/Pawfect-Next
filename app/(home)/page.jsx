import styles from '@/app/ui/pages/home.module.scss';

import Image from 'next/image';
import Link from 'next/link';

import {
  FAQ_DATA,
  SERVICES_DATA,
  SERVICE_PROCESS_DATA,
} from '@/app/lib/placeholder-data';

import TestimonialsSlider from '../ui/components/TestimonialsSlider';
import React from 'react';
import FaqAccordion from '../ui/components/FaqAccordion';
import SitterSearch from '../ui/components/SitterSearch';

// 資料引入
const servicesData = SERVICES_DATA;
const faqData = FAQ_DATA;
const processData = SERVICE_PROCESS_DATA;

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
        <section className={`bg-gradient-light pt-17 pb-13 pt-md-42 pb-md-31`}>
          <h2 className="text-center text-primary fs-5 fs-md-3 d-md-block d-none d-flex align-items-center justify-content-center mb-21">
            <span className="pe-6 fs-6">\</span>
            <span className="text-center fw-bold">
              最 Pawfect 的寵物保母服務
            </span>
            <span className="ps-6 fs-6">/</span>
          </h2>
          <h2 className="text-center text-primary fs-5 d-md-none d-block d-flex align-items-center justify-content-center mb-9">
            <span className="pe-4 fs-6">\</span>
            <div className="text-center">
              <span className="d-block fw-bold">最 Pawfect 的</span>
              <span className="d-block fw-bold">寵物保母服務</span>
            </div>
            <span className="ps-4 fs-6">/</span>
          </h2>
          <div className="container">
            <div className="row justify-content-center">
              {servicesData.map((service, index) => (
                <div className={`col-md-10 mb-9 mb-md-17`} key={index}>
                  <div
                    className={`row justify-content-md-around ${
                      service.reverse ? 'flex-md-row-reverse' : ''
                    }`}
                  >
                    <div
                      className={`col-md-5 justify-content-md-start ${styles.serviceImg}`}
                    >
                      <Image
                        src={service.img}
                        alt={`${service.title}照片`}
                        width={500}
                        height={350}
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                    <div className={`col-md-6 ${styles.serviceLead}`}>
                      <div>
                        <h3>{service.title}</h3>
                        <p className="text-center text-md-start">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Testimonials Section --- */}
        <TestimonialsSlider />

        {/* --- Order Process Section --- */}
        <section className={`bg-gradient-light pt-12 pb-14 pt-lg-30 pb-lg-40`}>
          <div className="container">
            <h2 className="text-center text-primary fs-5 fs-md-3 d-flex align-items-center justify-content-center mb-1 mb-md-2">
              <span className="pe-md-7 pe-2 fs-6">\</span>
              <span className="text-center fw-bold">最 Pawfect 的預訂體驗</span>
              <span className="ps-md-7 ps-2 fs-6">/</span>
            </h2>
            <p className="text-center fs-9 fs-md-7 text-gray-300 mb-9 mb-md-21">
              預定流程直覺好上手
            </p>
            <div className="d-flex flex-column flex-lg-row justify-content-center align-items-center">
              {processData.map((card, index) => (
                <React.Fragment key={card.order}>
                  <div
                    className={`${styles.orderProcessCard} bg-light px-6 pt-5 pb-7 h-100`}
                  >
                    <div className="d-flex flex-md-column align-items-center justify-content-between mb-md-4">
                      <p
                        className={`${styles.cardOrder} text-center mb-md-4 ${card.colorClass}`}
                      >
                        {card.order}
                      </p>
                      <div className={`${styles.cardIcon}`}>
                        <Image
                          src={card.icon}
                          className="card-img-top img-fluid"
                          alt={`${card.title} Icon`}
                          width={140}
                          height={100}
                          style={{ objectFit: 'contain' }}
                        />
                      </div>
                    </div>
                    <div className="d-flex flex-column align-items-md-center">
                      <h4 className="card-title fs-md-6 fs-7 mb-4">
                        {card.title}
                      </h4>
                      <p className="card-text text-start text-lg-center">
                        {card.description}
                      </p>
                    </div>
                  </div>

                  {index < processData.length - 1 && (
                    <>
                      <Image
                        src={
                          index % 2 === 0 ? '/dogPrint.png' : '/dogPrint2.png'
                        }
                        alt="裝飾性圖標"
                        width={75}
                        height={109}
                        className={`${styles.decorativeIcon1} d-none mx-5 d-lg-block`}
                      />

                      <div className="d-flex d-lg-none justify-content-center align-items-center my-4">
                        <Image
                          src={
                            index % 2 === 0 ? '/dogPrint.png' : '/dogPrint2.png'
                          }
                          alt="裝飾性圖標"
                          width={52}
                          height={75}
                          className={styles.decorativeIcon2}
                        />
                      </div>
                    </>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

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
