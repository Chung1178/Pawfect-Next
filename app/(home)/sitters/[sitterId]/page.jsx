import SitterImageGallery from '@/app/ui/components/SitterImageGallery';
import SitterInfoCard from '@/app/ui/components/SitterInfoCard';
import style from '@/app/ui/pages/sitters-page.module.scss';
import { StarIcon } from '@heroicons/react/16/solid';
import React from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default async function SitterPage({ params }) {
  const { sitterId } = await params;
  const res = await fetch(`${API_BASE_URL}users/${sitterId}`);
  const data = await res.json();
  const {
    id,
    name,
    rating,
    reviewCount,
    address,
    bio,
    totalBookingsCompleted,
    profilePictureUrl,
    pictureUrls,
    servicesOffered,
    availability,
  } = data;

  const getServiceStyles = (serviceName) => {
    switch (serviceName) {
      case '上門餵食':
        return {
          icon: '/booking-page/i_上門餵食.svg',
          colorClass: 'text-secondary',
        };
      case '日間托養':
        return {
          icon: '/booking-page/i_日間托養.svg',
          colorClass: 'text-thirdly',
        };
      case '遛狗散步':
        return {
          icon: '/booking-page/i_遛狗散步.svg',
          colorClass: 'text-primary',
        };
      default:
        return { icon: '#', colorClass: 'text-dark' };
    }
  };

  const daysOfWeek = [
    { key: 'sunday', chineseName: '週日' },
    { key: 'monday', chineseName: '週一' },
    { key: 'tuesday', chineseName: '週二' },
    { key: 'wednesday', chineseName: '週三' },
    { key: 'thursday', chineseName: '週四' },
    { key: 'friday', chineseName: '週五' },
    { key: 'saturday', chineseName: '週六' },
  ];

  const reviews = [
    {
      id: 'r1',
      reviewerName: '劉曉華',
      reviewerIcon: '/booking-page/i_劉曉華.svg',
      serviceName: '遛狗散步',
      date: '2025年6月22日',
      stars: 5,
      comment:
        '雅雯對我的小狗旺旺非常有愛心，每天都會帶牠去散步和玩耍，旺旺回來後總是很開心。',
    },
    {
      id: 'r2',
      reviewerName: '張怡君',
      reviewerIcon: '/booking-page/i_張怡君.svg',
      serviceName: '上門餵食',
      date: '2025年5月12日',
      stars: 4,
      comment:
        '我的貓咪米米在雅雯的照顧下變得很放鬆，她知道如何讓米米感到安全和受到愛護。',
    },
    {
      id: 'r3',
      reviewerName: '陳建忠',
      reviewerIcon: '/booking-page/i_陳建忠.svg',
      serviceName: '上門餵食',
      date: '2025年4月27日',
      stars: 5,
      comment:
        '因為出國一週所以沒辦法照顧家裡的毛小孩，還好有雅雯的上門餵食服務，不得不說雅雯真的很貼心，通常我家那隻在陌生人面前是不太敢吃東西的，但因為雅雯的溫柔安撫，結果竟然吃得比平常還多！',
    },
    {
      id: 'r4',
      reviewerName: '黃美玲',
      reviewerIcon: '/booking-page/i_黃美玲.svg',
      serviceName: '日間托養',
      date: '2025年2月16日',
      stars: 5,
      comment:
        '前陣子經常加班很晚回家，擔心家裡的毛小孩沒人照顧所以上網尋找日間托養的服務，很幸運遇到雅雯，讓我白天能放心的將毛小孩交給她照顧。',
    },
  ];

  const renderStars = (rating) => {
    const totalStars = 5;
    let starElements = [];
    for (let i = 1; i <= totalStars; i++) {
      starElements.push(
        <StarIcon
          key={i}
          className={`me-1 ${i <= rating ? 'text-primary' : 'text-gray-800'}`} // text-primary 是 Bootstrap 主題色
          style={{ width: '20px', height: '20px' }} // 設定星星大小
        />
      );
    }
    return starElements;
  };

  return (
    <>
      <main className="position-relative bg-gradient-light pb-13 pb-lg-31">
        <div
          className={`${style['sitter-detail-banner']} position-absolute w-100`}
        ></div>
        <section>
          <div className="container pt-25 pt-lg-42">
            <div className="row">
              <div className="col-lg-8">
                <div className="mb-9 mb-lg-17">
                  <SitterImageGallery
                    profilePictureUrl={profilePictureUrl}
                    pictureUrls={pictureUrls}
                  />
                </div>
                <div className="d-lg-none mb-9">
                  <SitterInfoCard
                    id={id}
                    name={name}
                    rating={rating}
                    reviewCount={reviewCount}
                    address={address}
                    bio={bio}
                    totalBookingsCompleted={totalBookingsCompleted}
                    profilePictureUrl={profilePictureUrl}
                    servicesOffered={servicesOffered}
                  />
                </div>
                {/* 服務列表 */}
                <div className="mb-lg-13 mb-6">
                  <h3 className="fs-7 fs-lg-4 mb-5 mb-lg-9 text-gray-200">
                    我能為您的寶貝做什麼?
                  </h3>
                  {servicesOffered.map((service) => {
                    const serviceStyle = getServiceStyles(service.name);
                    return (
                      <React.Fragment key={service.serviceId}>
                      <div
                        className={`${style.sitterServiceCard} card border-0 mb-4 mb-lg-5`}
                      >
                        <div className="card-body p-0 d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center">
                            <img
                              src={serviceStyle.icon}
                              alt={service.name}
                              style={{ width: '48px', height: '48px' }}
                              className="me-4"
                            />
                            <span
                              className={`fw-bold fs-7 ${serviceStyle.colorClass}`}
                            >
                              {service.name}
                            </span>
                          </div>
                          <span>
                            <strong className="fw-bold fs-7 text-gray-200">
                              NT ${service.price}
                            </strong>
                            <span className="fs-11 text-gray-500 ms-1">
                              {service.unit}
                            </span>
                          </span>
                        </div>
                      </div>
                      </React.Fragment>
                    );
                  })}
                </div>
                {/* 可服務時間 */}
                <div className="mb-9 mb-lg-17">
                  <h3 className="fs-7 fs-lg-4 mb-5 mb-lg-9 text-gray-200">
                    可服務時間
                  </h3>
                  <ul className="d-flex list-unstyled gap-4 fs-8">
                    {daysOfWeek.map((day) => {
                      const isAvailable =
                        availability[day.key] &&
                        availability[day.key].length > 0;

                      if (isAvailable) {
                        return (
                          <li key={day.key} className="text-gray-200">
                            {day.chineseName}
                          </li>
                        );
                      }
                    })}
                  </ul>
                  {Object.values(availability).every(
                    (schedule) => schedule.length === 0
                  ) && (
                    <p className="text-muted fs-7">目前暫未提供可服務時間。</p>
                  )}
                </div>
                {/* 評價列表 */}
                <div>
                  <h3 className="fs-7 fs-lg-4 mb-5 mb-lg-9 text-gray-200">
                    毛爸媽的心聲
                  </h3>
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className={`${style.sitterCommentCard} card border-0 p-7 mb-5`}
                    >
                      <div className="card-body p-0">
                        <div className="d-flex justify-content-between align-items-center mb-5">
                          <div className="d-flex align-items-center">
                            <img
                              src={review.reviewerIcon}
                              alt={`${review.reviewerName}profile`}
                              className="me-4"
                            />
                            <div>
                              <p className="d-block fw-bold fs-8 text-gray-200">
                                {review.reviewerName}
                              </p>
                              <span className="d-block fs-10 text-gray-500">
                                {review.serviceName} · {review.date}
                              </span>
                            </div>
                          </div>
                          <div className="d-flex align-items-center text-nowrap">
                            {renderStars(review.stars)}
                          </div>
                        </div>
                        <p className="text-gray-300">{review.comment}</p>
                      </div>
                    </div>
                  ))}

                  <div className="card border-0 bg-transparent mt-lg-9">
                    <div className="card-body">
                      <div className="mb-4 text-center fw-bold text-primary">
                        <span>看更多卡片</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 d-none d-lg-block">
                <div className="sticky-lg-top" style={{ top: '6.5rem' }}>
                  <SitterInfoCard
                    id={id}
                    name={name}
                    rating={rating}
                    reviewCount={reviewCount}
                    address={address}
                    bio={bio}
                    totalBookingsCompleted={totalBookingsCompleted}
                    profilePictureUrl={profilePictureUrl}
                    servicesOffered={servicesOffered}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
