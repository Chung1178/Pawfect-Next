import SitterBookingButton from './SitterBookingButton';
import style from './SitterInfoCard.module.scss';

import { StarIcon, MapPinIcon, UserIcon } from '@heroicons/react/16/solid';

export default function SitterInfoCard({
  id,
  name,
  rating,
  reviewCount,
  address,
  bio,
  totalBookingsCompleted,
  profilePictureUrl,
  servicesOffered = []
}) {
  return (
    <>
      <div className={`${style.sitterDetailCard} card bg-light border-0`}>
        <div className="card-body h-100 d-flex flex-column p-7">
          <div className="d-flex align-items-center mb-2">
            <img
              src={profilePictureUrl}
              alt="會員照片"
              style={{ width: '48px', height: '48px' }}
              className="me-2 rounded-circle object-fit-cover"
            />
            <h1 className="card-title m-0 fs-lg-3 fs-6 fw-bold text-gray-200">
              {name}
            </h1>
          </div>
          <div className="d-flex align-items-center mb-2 flex-wrap">
            <StarIcon
              className="text-primary me-1"
              style={{ width: '16px', height: '16px' }}
            />
            <span className="fs-10 text-primary me-1">{rating.toFixed(1)}</span>
            <span className="fs-10 text-gray-500 me-1">({reviewCount})</span>
            <MapPinIcon
              className="me-1 text-gray-500"
              style={{ width: '16px', height: '16px' }}
            />
            <span className="fs-10 text-gray-500 me-1">
              {address?.city},{address?.district}
            </span>
            <UserIcon
              className="me-1 text-gray-500"
              style={{ width: '16px', height: '16px' }}
            />
            <span className="fs-10 text-gray-500">
              ({totalBookingsCompleted})
            </span>
          </div>
          <p className="card-text mb-5 small text-gray-200">{bio}</p>
          <div className="mt-auto">
            <span className="d-block mb-2 text-center text-gray-500 small">
              在過去的48小時內，已經收到了十筆預約。
            </span>
            <SitterBookingButton
              sitterId={id}
              sitterName={name}
              services={servicesOffered}
            />
          </div>
        </div>
      </div>
    </>
  );
}
