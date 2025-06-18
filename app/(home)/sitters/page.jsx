'use client';

import style from '@/app/ui/pages/sitters-page.module.scss';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { StarIcon, MapPinIcon, UserIcon } from '@heroicons/react/16/solid';

import SitterSearch from '@/app/ui/components/SitterSearch';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const ITEMS_PER_PAGE = 8;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const filterSitters = (sitters, queryParams) => {
  const service = queryParams.get('service');
  const petType = queryParams.get('petType');
  const startDate = queryParams.get('startDate')
    ? new Date(queryParams.get('startDate'))
    : null;
  const endDate = queryParams.get('endDate')
    ? new Date(queryParams.get('endDate'))
    : null;

  return sitters.filter((sitter) => {
    // 條件1：篩選服務類型 (servicesOffered)
    if (service) {
      const hasService = sitter.servicesOffered?.some(
        (s) => s.name === service
      );
      if (!hasService) return false;
    }

    // 條件2：篩選可接受的寵物類型 (acceptedPetTypes)
    if (petType) {
      const canAcceptPet = sitter.acceptedPetTypes?.includes(petType);
      if (!canAcceptPet) return false;
    }

    // 條件3：篩選日期 (availability)
    if (startDate && endDate) {
      // 將星期英文轉換為數字 (0=週日, 1=週一, ...)
      const dayMap = {
        sunday: 0,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
      };

      // 獲取使用者選擇日期範圍內的所有星期 (e.g., [1, 2, 3] for Mon, Tue, Wed)
      const requiredDays = new Set();
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        requiredDays.add(currentDate.getDay());
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // 檢查保姆在這些必要的星期中是否都有空
      let allRequiredDaysAvailable = true;
      for (const dayIndex of requiredDays) {
        const dayKey = Object.keys(dayMap).find(
          (key) => dayMap[key] === dayIndex
        );
        if (
          !sitter.availability ||
          !sitter.availability[dayKey] ||
          sitter.availability[dayKey].length === 0
        ) {
          allRequiredDaysAvailable = false;
          break; // 只要有一天不符合，就篩選掉
        }
      }
      if (!allRequiredDaysAvailable) return false;
    }

    // 所有條件都通過
    return true;
  });
};

export default function SittersPage() {
  const [allSitters, setAllSitters] = useState([]); // ✨ 儲存所有從後端獲取的（預篩選後）的保姆
  const [filteredSitters, setFilteredSitters] = useState([]); // ✨ 儲存前端精細篩選後的保姆
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✨ 新增分頁相關的 state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams(); // ✨ 用 hook 獲取 URL 查詢參數

  const fetchAndFilterSitters = useCallback(async (currentQuery) => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams(currentQuery);

      //用 json-server 支援的參數去後端預篩選
      const apiQuery = new URLSearchParams();
      if (queryParams.get('address')) {
        apiQuery.set('address.city', queryParams.get('address'));
      }
      //總是獲取所有 role=sitter 的使用者
      apiQuery.set('role', 'sitter');

      const url = `${API_BASE_URL}users?${apiQuery.toString()}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('資料獲取失敗');

      const data = await res.json();
      setAllSitters(data);

      //在前端進行精細篩選
      const finalFilteredData = filterSitters(data, queryParams);
      setFilteredSitters(finalFilteredData);
    } catch (err) {
      console.error('Failed to process sitters:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialQuery = searchParams.toString();
    setCurrentPage(1); // 每次新搜尋都重置頁碼
    fetchAndFilterSitters(initialQuery);
  }, [searchParams, fetchAndFilterSitters]);

  const handleSearch = (queryString) => {
    // 更新 URL，這會觸發上面的 useEffect 重新獲取和篩選
    router.push(`${pathname}?${queryString}`);
  };

  // --- 分頁邏輯 ---
  const currentDisplaySitters = filteredSitters.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // 處理分頁變更的函式
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return; // 防止超出頁碼範圍
    setCurrentPage(page);
    // 將頁面滾動到頂部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <li
          key={i}
          className={`page-item ${currentPage === i ? 'active' : ''}`}
        >
          <button className="page-link" onClick={() => handlePageChange(i)}>
            {i}
          </button>
        </li>
      );
    }
  };

  return (
    <>
      <main>
        <section className="bg-gradient-primary-banner mt-lg-21 mt-17">
          <div className={style.searchBanner}>
            <div className="container position-relative pt-11 pb-18 pt-md-16 pb-md-42">
              <h1 className="text-light fs-5 fs-md-3 fs-lg-2 dog-foot-title-md w-fit-content mx-auto">
                現在就尋找您的寵物保母
              </h1>
              <SitterSearch onSearch={handleSearch} />
            </div>
          </div>
        </section>
        <section className="bg-gradient-light pt-15 pb-13 pt-md-44 pb-md-31">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-7 mb-md-11">
              <h2>推薦保母</h2>
              <div className="dropdown text-gray-300">
                <button
                  href="#"
                  type="button"
                  className="custom-dropdown-toggle border-0 bg-gray-1000 w-100 d-flex justify-content-between
                align-items-center py-4 px-5 rounded-2"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span className="me-11 me-lg-31 text-gray-300">排序方式</span>
                  <ChevronDownIcon
                    className="text-gray-500"
                    style={{ width: '1.25rem', height: '1.25rem' }}
                  />
                </button>
                <ul className="dropdown-menu py-4 w-100">
                  <li>
                    <a
                      className="dropdown-item py-2 px-4 mb-2 bg-gray-1000-hover"
                      href="#"
                    >
                      {`價錢: 高 => 低`}
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item py-2 px-4 mb-2 bg-gray-1000-hover"
                      href="#"
                    >
                      {`價錢: 低 => 高`}
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item py-2 px-4 mb-2 bg-gray-1000-hover"
                      href="#"
                    >
                      {`距離: 近 => 遠`}
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item py-2 px-4 mb-2 bg-gray-1000-hover"
                      href="#"
                    >
                      {`距離: 遠 => 近`}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            {isLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">載入中...</span>
                </div>
              </div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : currentDisplaySitters.length > 0 ? (
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 gy-7 gy-md-11 mb-9 mb-lg-13">
                {currentDisplaySitters.map((sitter) => (
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
                          NT${' '}
                          {`${
                            searchParams.get('service')
                              ? sitter.servicesOffered
                                  .map((service) =>
                                    service.name === searchParams.get('service')
                                      ? service.price
                                      : ''
                                  )
                                  .join('')
                              : sitter.servicesOffered[0].price
                          }`}
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
            ) : (
              <p className="text-center text-muted py-5">
                找不到符合條件的保姆。
              </p>
            )}

            {/* 渲染分頁元件 */}
            {totalPages > 1 && renderPagination()}
          </div>
        </section>
      </main>
    </>
  );
}
