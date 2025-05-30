'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, Navigation, FreeMode } from 'swiper/modules';

// Heroicons for navigation arrows
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';

// Swiper CSS
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

import style from './SitterImageGallery.module.scss';

import { useMemo, useRef, useState } from 'react';

export default function SitterImageGallery({ profilePictureUrl, pictureUrls }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);
  const [activeThumbIndex, setActiveThumbIndex] = useState(0);

  const orderedImages = useMemo(() => {
    const sources = [];

    if (profilePictureUrl && typeof profilePictureUrl === 'string') {
      sources.push({
        src: profilePictureUrl,
        alt: `Sitter's profile picture`,
      });
    }

    if (pictureUrls && Array.isArray(pictureUrls)) {
      pictureUrls.forEach((url, index) => {
        if (url && typeof url === 'string' && url !== profilePictureUrl) {
          sources.push({
            src: url,
            alt: `Sitter's gallery image ${index + 1}`,
          });
        }
      });
    }

    if (sources.length === 0) {
      return [{ src: './default-placeholder.jpg', alt: 'No images available' }];
    }

    return sources;
  }, [profilePictureUrl, pictureUrls]);

  const isPlaceholderOnly =
    orderedImages.length === 1 &&
    orderedImages[0].src.includes('default-placeholder.jpg');

  if (isPlaceholderOnly) {
    return (
      <div className="text-center p-3 bg-light rounded ratio ratio-16x9">
        <img
          src={orderedImages[0].src}
          alt={orderedImages[0].alt}
          className="w-100 h-100 object-fit-cover rounded"
        />
        {isPlaceholderOnly && (
          <p className="mt-2 text-muted small position-absolute bottom-0 start-50 translate-middle-x pb-2">
            尚無其他展示圖片
          </p>
        )}
      </div>
    );
  }

  const showNavigationAndThumbs = orderedImages.length > 1;

  return (
    <>
      <div className="position-relative">
        <div className="ratio ratio-16x9 mb-5">
          <Swiper
            modules={[Thumbs, Navigation]}
            spaceBetween={10}
            slidesPerView={1}
            loop={true}
            navigation={
              showNavigationAndThumbs
                ? {
                    // 只有多張圖時才啟用導航
                    prevEl: navigationPrevRef.current,
                    nextEl: navigationNextRef.current,
                  }
                : false
            } // 如果不顯示導航，設為 false
            thumbs={
              showNavigationAndThumbs ? { swiper: thumbsSwiper } : undefined
            }
            className={`${style.sitterSlide} position-absolute top-0 start-0 w-100 h-100`}
            onBeforeInit={(swiper) => {
              // 確保 ref 在 Swiper 初始化前被設定
              if (showNavigationAndThumbs) {
                swiper.params.navigation.prevEl = navigationPrevRef.current;
                swiper.params.navigation.nextEl = navigationNextRef.current;
              }
            }}
            onSlideChange={(swiper) => {
              setActiveThumbIndex(swiper.realIndex);
            }}
          >
            {orderedImages.map((image, index) => (
              <SwiperSlide key={`main-${index}`} className="bg-light">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-100 h-100 object-fit-cover rounded"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {showNavigationAndThumbs && (
          <>
            <div
              ref={navigationPrevRef}
              className={`${style.navArrow} d-flex justify-content-center align-items-center rounded-circle position-absolute top-50 start-0 translate-middle-y ms-5 opacity-20 opacity-30-hover`}
              aria-label="Previous slide"
            >
              <ArrowLeftIcon
                style={{ color: '#fff', width: '1.5rem', height: '1.5rem' }}
              />
            </div>
            <div
              ref={navigationNextRef}
              className={`${style.navArrow} d-flex justify-content-center align-items-center rounded-circle position-absolute top-50 end-0 translate-middle-y me-5 opacity-20 opacity-30-hover`}
              aria-label="Next slide"
            >
              <ArrowRightIcon
                style={{ color: '#fff', width: '1.5rem', height: '1.5rem' }}
              />
            </div>
          </>
        )}
      </div>

      {showNavigationAndThumbs && (
        <Swiper
          modules={[Thumbs, FreeMode]}
          onSwiper={setThumbsSwiper}
          spaceBetween={16}
          slidesPerView={'auto'}
          freeMode={true}
          watchSlidesProgress={true}
          className={style.thumbsContainer}
        >
          {orderedImages.map((image, index) => (
            <SwiperSlide
              key={`thumb-${index}`}
              className={`${style.thumbSlide}    ${
                index === activeThumbIndex ? style.activeThumb : ''
              }`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className={`w-100 h-100 object-fit-cover`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </>
  );
}
