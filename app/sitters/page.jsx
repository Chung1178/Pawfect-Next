'use client';

import style from '@/app/ui/pages/sitters-page.module.scss';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { StarIcon, MapPinIcon, UserIcon } from '@heroicons/react/16/solid';

export default function SittersPage() {
  const [sitters, setSitters] = useState([]);

  useEffect(() => {
    async function fetchSitters(page = 1, limit = 8) {
      try {
        let url = `http://localhost:3001/users?role=sitter&_page=${page}&_limit=${limit}`;

        const res = await fetch(url);
        const data = await res.json();
        setSitters(data);
        return data;
      } catch (error) {
        console.log(error);
      }
    }
    fetchSitters();
  }, []);
  return (
    <>
      <main>
        <section className="bg-gradient-primary-banner mt-lg-21 mt-17">
          <div className={style.searchBanner}>
            <div className="container pt-11 pb-18 pt-md-16 pb-md-42">
              <h1 className="text-light fs-5 fs-md-3 fs-lg-2 dog-foot-title-md w-fit-content mx-auto">
                現在就尋找您的寵物保母
              </h1>
            </div>
          </div>
        </section>
        <section className="bg-gradient-light pt-15 pb-13 pt-md-44 pb-md-31">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-7 mb-md-11">
              <h2>推薦保母</h2>
              <div>搜尋區塊-暫</div>
            </div>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 gy-7 gy-md-11 mb-9 mb-lg-13">
              {sitters.map((sitter) => (
                <div
                  className="col d-flex flex-column flex-md-row"
                  key={sitter.id}
                >
                  <div className="card bg-transparent border-0">
                    <img
                      src={sitter.profilePictureUrl}
                      className={`${style.sitterCardImage} card-img-top object-fit-cover mb-5`}
                      alt="..."
                    />
                    <div className="card-body p-0">
                      <h5 className="card-title fs-7 text-gray-200 mb-2">
                        {sitter.name}
                      </h5>
                      <div className="d-flex align-items-center mb-md-2 mb-1 flex-wrap">
                        <StarIcon
                          className="text-primary me-1"
                          style={{ width: '16px', height: '16px' }}
                        />
                        <span className="fs-10 text-primary me-1">
                          {sitter.rating.toFixed(1)}
                        </span>
                        <span className="fs-10 text-gray-500 me-1">
                          ({sitter.reviewCount})
                        </span>
                        <MapPinIcon
                          className="me-1 text-gray-500"
                          style={{ width: '16px', height: '16px' }}
                        />
                        <span className="fs-10 text-gray-500 me-1">
                          {sitter.address?.city},{sitter.address?.district}
                        </span>
                        <UserIcon
                          className="me-1 text-gray-500"
                          style={{ width: '16px', height: '16px' }}
                        />
                        <span className="fs-10 text-gray-500">
                          ({sitter.totalBookingsCompleted})
                        </span>
                      </div>
                      <p className="card-text fs-10 text-gray-200 mb-2 mb-md-5">
                        {sitter.bio}
                      </p>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <p className="fs-7 fw-bold text-gray-200">
                        NT$ 550
                        <span className="ms-1 fs-11 text-gray-500 fw-normal">
                          每次
                        </span>
                      </p>
                      <Link
                        href={`/sitters/${sitter.id}`}
                        className="fs-10 text-primary fw-bold opacity-70-hover transition-base
                  stretched-link"
                      >
                        詳細資料
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
