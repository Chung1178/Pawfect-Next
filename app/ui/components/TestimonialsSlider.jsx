'use client';

import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  StarIcon,
} from '@heroicons/react/24/solid';
import { TESTIMONIALS_DATA } from '@/app/lib/placeholder-data';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';

import styles from './TestimonialsSlider.module.scss';

const testimonials = TESTIMONIALS_DATA;

const renderStars = (rating) => {
  const totalStars = 5;
  let starElements = [];
  for (let i = 1; i <= totalStars; i++) {
    starElements.push(
      <StarIcon
        key={i}
        className={`me-1 ${i <= rating ? 'text-primary' : 'text-gray-300'}`}
        style={{ width: '1rem', height: '1rem' }}
      />
    );
  }
  return starElements;
};

export default function TestimonialsSlider() {
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);

  return (
    <section className={`bg-gradient-secondary`}>
      <div className={styles.testimonialsSection}>
        <div className="container py-13 pt-lg-26 pb-lg-31">
          <div className="text-light d-md-flex justify-content-md-between align-items-md-center mb-9 mb-lg-19">
            <div className="mb-5 mb-md-0">
              <h2 className="fs-5 fs-lg-3 mb-1 mb-lg-2">毛孩爸媽怎麼說？</h2>
              <p className="fs-lg-7">
                透明且真實的用戶評論和推薦，讓您能安心參考並做出明智的選擇
              </p>
            </div>
            <div className="d-flex align-items-center">
              <button
                ref={navigationPrevRef}
                className={`${styles.navButton} btn btn-outline-light rounded-circle me-5 me-md-9`}
                aria-label="Previous testimonial"
              >
                <ArrowLeftIcon style={{ width: '1.5rem', height: '1.5rem' }} />
              </button>
              <button
                ref={navigationNextRef}
                className={`${styles.navButton} btn btn-outline-light rounded-circle`}
                aria-label="Next testimonial"
              >
                <ArrowRightIcon style={{ width: '1.5rem', height: '1.5rem' }} />
              </button>
            </div>
          </div>
          <div>
            <Swiper
              modules={[Navigation, Autoplay]}
              navigation={{
                prevEl: navigationPrevRef.current,
                nextEl: navigationNextRef.current,
              }}
              onBeforeInit={(swiper) => {
                swiper.params.navigation.prevEl = navigationPrevRef.current;
                swiper.params.navigation.nextEl = navigationNextRef.current;
              }}
              spaceBetween={12}
              slidesPerView={'auto'}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              loop={true}
              breakpoints={{
                992: {
                  spaceBetween: 48,
                },
                768: {
                  spaceBetween: 24,
                },
              }}
            >
              {testimonials.map((item) => (
                <SwiperSlide key={item.id} className={styles.swiperSlide}>
                  <div className={`${styles.cardComment} h-100`}>
                    <div
                      className={`${styles.cardBody} position-relative bg-light rounded-4 p-5 p-md-9 mb-10`}
                    >
                      <div className="d-flex justify-content-between mb-2 mb-lg-5">
                        <h3 className="fs-7 text-dark">{item.name}</h3>
                        <div className="d-flex align-items-center text-primary fs-7">
                          {renderStars(item.rating)}
                        </div>
                      </div>
                      <p className="mb-0">{item.comment}</p>
                      <Image
                        src="/home-comment-div.svg"
                        alt="decoration"
                        width={30}
                        height={21}
                        className={styles.cardCorner}
                      />
                    </div>
                    <div className="z-5">
                      <Image
                        src={item.avatar}
                        alt={`user ${item.name}`}
                        width={64}
                        height={64}
                        className="rounded-circle"
                      />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
