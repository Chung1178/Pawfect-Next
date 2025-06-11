// app/components/homepage/HeroSearchForm.jsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronDownIcon,
  MinusCircleIcon,
  PlusCircleIcon,
} from '@heroicons/react/20/solid';

// 假設這是一個 React 版本的日期選擇器
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

export default function SitterSearchForm() {
  const [catCount, setCatCount] = useState(0);
  const [dogCount, setDogCount] = useState(0);
  const [selectedArea, setSelectedArea] = useState('地區');
  // const [startDate, setStartDate] = useState(new Date());

  const handlePetCount = (type, operation) => {
    if (type === 'cat') {
      setCatCount((prev) => (operation === '+' ? prev + 1 : Math.max(0, prev - 1)));
    } else {
      setDogCount((prev) => (operation === '+' ? prev + 1 : Math.max(0, prev - 1)));
    }
  };

  const petCountText = () => {
    if (catCount > 0 && dogCount > 0) return `${catCount}貓 / ${dogCount}狗`;
    if (catCount > 0) return `${catCount}貓`;
    if (dogCount > 0) return `${dogCount}狗`;
    return '貓 / 狗';
  };

  return (
    <>
      {/* --- Desktop Search Form --- */}
      <div className="d-none d-md-block bg-light rounded-4 shadow-primary">
        <div className="py-4 px-6">
          <div className="row gx-4 align-items-end">
            {/* Pet Selector */}
            <div className="col">
              <p className="text-gray-500 mb-2 small">您的寵物</p>
              <div className="dropdown">
                <button
                  className="custom-dropdown-toggle w-100 d-flex justify-content-between align-items-center btn"
                  type="button"
                  data-bs-toggle="dropdown"
                  data-bs-auto-close="outside"
                  aria-expanded="false"
                >
                  <div className="d-flex align-items-center">
                    <Image src="/assets/images/search-page/Pet-icon.svg" width={24} height={24} alt="pet-icon" className="me-2"/>
                    <span data-petnum-show>{petCountText()}</span>
                  </div>
                  <ChevronDownIcon className="text-gray-500" style={{ width: '1.25rem', height: '1.25rem' }}/>
                </button>
                <ul className="dropdown-menu py-4 w-100">
                  {/* Cat Counter */}
                  <li>
                    <div className="dropdown-item d-block py-2 px-4 mb-2 d-flex justify-content-between align-items-center">
                      <span>貓</span>
                      <div className="d-flex align-items-center">
                        <button type="button" className="btn p-0" onClick={() => handlePetCount('cat', '-')}>
                           <MinusCircleIcon className="fs-6 text-gray-800" style={{ width: '1.5rem', height: '1.5rem' }}/>
                        </button>
                        <span className="mx-3 text-gray-500">{catCount}</span>
                        <button type="button" className="btn p-0" onClick={() => handlePetCount('cat', '+')}>
                          <PlusCircleIcon className="fs-6 text-gray-500" style={{ width: '1.5rem', height: '1.5rem' }}/>
                        </button>
                      </div>
                    </div>
                  </li>
                  {/* Dog Counter */}
                  <li>
                    <div className="dropdown-item d-block py-2 px-4 mb-2 d-flex justify-content-between align-items-center">
                      <span>狗</span>
                      <div className="d-flex align-items-center">
                         <button type="button" className="btn p-0" onClick={() => handlePetCount('dog', '-')}>
                           <MinusCircleIcon className="fs-6 text-gray-800" style={{ width: '1.5rem', height: '1.5rem' }}/>
                        </button>
                        <span className="mx-3 text-gray-500">{dogCount}</span>
                        <button type="button" className="btn p-0" onClick={() => handlePetCount('dog', '+')}>
                          <PlusCircleIcon className="fs-6 text-gray-500" style={{ width: '1.5rem', height: '1.5rem' }}/>
                        </button>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            {/* Area Selector */}
            <div className="col">
                <p className="gray-500 mb-2 small">您的地區</p>
                {/* 這裡應該換成一個真正的 React 地區選擇組件 */}
                <input type="text" className="form-control" placeholder="地區" />
            </div>
            {/* Date Selector */}
            <div className="col">
                <p className="gray-500 mb-2 small">照顧期間</p>
                {/* 這裡應該換成一個真正的 React 日期選擇器組件 */}
                <input type="text" className="form-control" placeholder="日期" />
            </div>
            <div className="col-auto"> {/* col-3 會太寬，col-auto 自適應 */}
              <Link href="/sitters" className="btn btn-primary d-block w-100">
                搜尋保母
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* --- Mobile Search Trigger --- */}
      <div className="d-md-none p-3 rounded-4 bg-light d-flex align-items-center shadow-primary">
        <a href="#" className="custom-dropdown-toggle d-block me-3 flex-grow-1" data-bs-toggle="modal" data-bs-target="#sitter-search-modal">
          您的需求
        </a>
        <a href="#" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#sitter-search-modal">
          搜尋
        </a>
      </div>

      {/* --- Mobile Search Modal --- */}
      <div className="modal fade sitter-search-modal" id="sitter-search-modal" tabIndex="-1" aria-hidden="true">
        {/* Modal 內容與 Desktop 類似，只是垂直排列 */}
        {/* ... 此處省略 Modal 內部結構，應將 Desktop 表單內容放入 Modal 中 ... */}
      </div>
    </>
  );
}