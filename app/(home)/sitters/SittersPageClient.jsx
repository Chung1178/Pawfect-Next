'use client';

import style from '@/app/ui/pages/sitters-page.module.scss';
import Link from 'next/link';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { StarIcon, MapPinIcon, UserIcon } from '@heroicons/react/16/solid';

import SitterSearch from '@/app/ui/components/SitterSearch';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const ITEMS_PER_PAGE = 8;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const sortOptions = [
  { value: 'default', label: '預設排序' },
  { value: 'rating_desc', label: '評分：由高至低' },
  { value: 'price_asc', label: '價格：由低至高' },
  { value: 'price_desc', label: '價格：由高至低' },
];

const filterSitters = (sitters, queryParams) => {
  const service = queryParams.get('service');
  const petType = queryParams.get('petType');
  const startDate = queryParams.get('startDate')
    ? new Date(queryParams.get('startDate'))
    : null;
  const endDate = queryParams.get('endDate')
    ? new Date(queryParams.get('endDate'))
    : null;

  if (!service && !petType && !startDate && !endDate) {
    return sitters;
  }

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

export default function SittersPageClient() {
  const [allSitters, setAllSitters] = useState([]); // 儲存所有從後端獲取的（預篩選後）的保姆
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams(); // 用 hook 獲取 URL 查詢參數

  const [sortOption, setSortOption] = useState(
    searchParams.get('sort') || 'default'
  );

  useEffect(() => {
    const initBootstrap = async () => {
      if (typeof window !== 'undefined') {
        await import('bootstrap');
      }
    };
    initBootstrap();
  }, []);
  // --排序邏輯--
  const handleSortChange = (newSortValue) => {
    setSortOption(newSortValue);

    const currentParams = new URLSearchParams(searchParams.toString());
    if (newSortValue === 'default') {
      currentParams.delete('sort');
    } else {
      currentParams.set('sort', newSortValue);
    }

    currentParams.set('page', '1');
    setCurrentPage(1);

    router.push(`${pathname}?${currentParams.toString()}`);
  };

  const currentSortLabel = useMemo(() => {
    const selected = sortOptions.find((opt) => opt.value === sortOption);
    return selected ? selected.label : '預設排序';
  }, [sortOption]);

  const filteredSitters = useMemo(() => {
    return filterSitters(allSitters, searchParams);
  }, [allSitters, searchParams]);

  const sortedSitters = useMemo(() => {
    const currentSort = searchParams.get('sort') || 'default';
    const selectedService = searchParams.get('service');

    const sortableSitters = [...filteredSitters];

    const getPrice = (sitter) => {
      if (!sitter.servicesOffered || sitter.servicesOffered.length === 0) {
        return 0; // 如果沒有服務，價格為 0
      }
      if (selectedService) {
        const service = sitter.servicesOffered.find(
          (s) => s.name === selectedService
        );
        return service ? service.price : 0; // 如果該保姆不提供此服務，價格視為 0
      }
      // 如果沒有篩選服務，就用第一個服務的價格作為預設值
      return sitter.servicesOffered[0].price || 0;
    };

    switch (currentSort) {
      case 'rating_desc':
        sortableSitters.sort((a, b) => b.rating - a.rating);
        break;
      case 'price_asc':
        // 假設你的價格在 servicesOffered[0].price
        sortableSitters.sort((a, b) => getPrice(a) - getPrice(b));
        break;
      case 'price_desc':
        sortableSitters.sort((a, b) => getPrice(b) - getPrice(a));
        break;
      case 'default':
      default:
        // 預設排序，不做任何事，維持 API 回傳的順序
        break;
    }

    return sortableSitters;
  }, [filteredSitters, searchParams]);

  useEffect(() => {
    // 每次 URL 參數變化時，都從 searchParams 中讀取 'sort' 的值
    const sortFromURL = searchParams.get('sort') || 'default';

    // 更新 sortOption state 來匹配 URL
    setSortOption(sortFromURL);
  }, [searchParams]); // 這個 effect 的依賴項只有 searchParams

  const fetchAndFilterSitters = useCallback(async (currentQuery) => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams(currentQuery);

      //用 json-server 支援的參數去後端預篩選
      const apiQuery = new URLSearchParams();
      const city = queryParams.get('address.city');
      if (city) {
        apiQuery.set('address.city', city);
      }

      const url = `${API_BASE_URL}sitters?${apiQuery.toString()}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('資料獲取失敗');

      const data = await res.json();
      setAllSitters(data);
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
  const totalPages = Math.ceil(sortedSitters.length / ITEMS_PER_PAGE);
  const currentDisplaySitters = sortedSitters.slice(
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
          aria-current={currentPage === i ? 'page' : undefined}
        >
          <button className="page-link" onClick={() => handlePageChange(i)}>
            {i}
          </button>
        </li>
      );
    }

    return (
      <nav aria-label="Sitter navigation">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
              aria-label="Previous"
            >
              <span aria-hidden="true">&laquo;</span>
            </button>
          </li>

          {pages}

          <li
            className={`page-item ${
              currentPage === totalPages ? 'disabled' : ''
            }`}
          >
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
              aria-label="Next"
            >
              <span aria-hidden="true">&raquo;</span>
            </button>
          </li>
        </ul>
      </nav>
    );
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
                  <span className="me-11 me-lg-31 text-gray-300">
                    {currentSortLabel}
                  </span>
                  <ChevronDownIcon
                    className="text-gray-500"
                    style={{ width: '1.25rem', height: '1.25rem' }}
                  />
                </button>
                <ul className="dropdown-menu py-4 w-100">
                  {sortOptions.map((option) => (
                    <li
                      className="dropdown-item py-2 px-4 mb-2 bg-primary-hover text-white-hover"
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                    >
                      {option.label}
                    </li>
                  ))}
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
            {!isLoading && totalPages > 1 && renderPagination()}
          </div>
        </section>
      </main>
    </>
  );
}
