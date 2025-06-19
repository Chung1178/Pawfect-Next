'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import SitterSearchForm from '@/app/ui/components/SitterSearchForm';

// import { Modal } from 'bootstrap';
import styles from './SitterSearch.module.scss';

export default function SitterSearch({ onSearch }) {
  const router = useRouter();
  const pathname = usePathname();
  const isListPage = pathname.startsWith('/sitters');
  const modalId = 'sitter-search-modal';
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const modalRef = useRef(null);
  const searchModal = useRef(null);

  useEffect(() => {
    // 動態載入 Bootstrap JavaScript
    const loadBootstrap = async () => {
      if (typeof window !== 'undefined') {
        const { Modal } = await import('bootstrap')
        searchModal.current = new Modal(modalRef.current)
      }
    }
    
    loadBootstrap()

    // 清理函數
    return () => {
      if (searchModal.current) {
        searchModal.current.dispose()
      }
    }
  }, [])

  // useEffect(() => {
  //   if (!isClient) return;

  //   searchModal.current = new Modal(modalRef.current);
  // }, [isClient]);
  // const getModalInstance = () => {
  //   const modalElement = modalRef.current;
  //   if (modalElement && window.bootstrap) {
  //     // getOrCreateInstance 會返回現有實例，或在需要時創建一個新的
  //     return Modal.getOrCreateInstance(modalElement);
  //   }
  //   return null;
  // };

  const showModal = () => {
    searchModal.current.show();
  };
  // const showModal = () => {
  //   getModalInstance()?.show();
  // };

  const hideModal = () => {
    searchModal.current.hide();
  };
  // const hideModal = () => {
  //   getModalInstance()?.hide();
  // };

  const handleSearchSubmit = (searchParams) => {
    hideModal();
    // 1. 構建 query string
    const query = new URLSearchParams();

    if (searchParams.service) query.set('service', searchParams.service);
    if (searchParams.address) query.set('address.city', searchParams.address);
    if (searchParams.petType) query.set('petType', searchParams.petType);
    if (searchParams.dates[0])
      query.set('startDate', searchParams.dates[0].toISOString().split('T')[0]);
    if (searchParams.dates[1])
      query.set('endDate', searchParams.dates[1].toISOString().split('T')[0]);

    const queryString = query.toString();

    // 2. 根據所在頁面執行不同操作
    if (isListPage) {
      // 在保母列表頁：呼叫 onSearch 回調函式，將 query string 傳遞給父層
      if (onSearch) {
        onSearch(queryString);
      }
    } else {
      // 在首頁：跳轉到保母列表頁，並帶上 query string
      router.push(`/sitters?${queryString}`);
    }
  };

  return (
    <>
      <div
        className="position-absolute top-100 start-0 end-0 translate-middle-y px-4"
        style={{ zIndex: 10 }}
      >
        <div className="row justify-content-md-center">
          <div className="col-lg-10">
            {/* Desktop Version */}
            <div className="d-none d-md-block bg-light rounded-4 shadow-primary">
              <SitterSearchForm
                onSearchSubmit={handleSearchSubmit}
                isModal={false}
              />
            </div>
            {/* Mobile Trigger */}
            <div className="d-md-none bg-light p-4 rounded-4 d-flex align-items-center shadow-primary">
              <div
                className="flex-grow-1 bg-gray-1000 py-4 px-5 rounded-3 me-4"
                onClick={showModal}
              >
                您的需求
              </div>
              <button
                className="btn btn-primary text-light fw-bold px-9"
                onClick={showModal}
              >
                搜尋
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Modal */}
      <div ref={modalRef} className={`modal fade`} id={modalId} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className={`modal-content ${styles.sitterSearchModal}`}>
            <div className="modal-body pt-0 px-7 pb-9">
              <SitterSearchForm
                onSearchSubmit={handleSearchSubmit}
                isModal={true}
                hideModal={hideModal}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
