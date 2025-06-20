'use client';

import { useEffect, useRef, useState } from 'react';
import styles from '../pages/sitters-page.module.scss';

import { ChevronDownIcon } from '@heroicons/react/20/solid';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import { zhTW } from 'date-fns/locale/zh-TW';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { SERVICE_TIME_SLOTS_DATA } from '@/app/lib/placeholder-data';

registerLocale('zh-TW', zhTW);

export default function SitterBookingButton({
  sitterId,
  sitterName,
  services = [],
}) {
  const modalId = `bookingModal-${sitterId}`;
  const modalRef = useRef(null);
  const bookingModal = useRef(null);

  const [isClient, setIsClient] = useState(false);

  // 表單狀態
  const [selectedDateRange, setSelectedDateRange] = useState([null, null]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [startDate, endDate] = selectedDateRange;
  const hasDateValue = startDate !== null;

  const router = useRouter();

  useEffect(() => {
    setIsClient(true);

    const loadBootstrap = async () => {
      if (typeof window !== 'undefined') {
        const { Modal } = await import('bootstrap');
        bookingModal.current = new Modal(modalRef.current, {
          backdrop: 'static',
        });
      }
    };

    loadBootstrap();

    return () => {
      if (bookingModal.current) {
        bookingModal.current.dispose();
      }
    };
  }, []);

  const openModal = () => {
    bookingModal.current.show();
  };

  const hideModal = () => {
    bookingModal.current.hide();
  };

  // 處理表單提交
  const handleBookingSubmit = (e) => {
    e.preventDefault();

    // 簡單的驗證
    if (!selectedDateRange || !selectedTimeSlot || !selectedService) {
      alert('請填寫所有預約資訊！');
      return;
    }

    // 由服務名稱找到對應的服務價格
    const matchedService = services.find(
      (service) => service.name === selectedService
    );
    const servicePrice = matchedService ? matchedService.price : 0;
    const serviceUnit = matchedService ? matchedService.unit : '';

    // 1. 構建 query string
    const query = new URLSearchParams();
    query.set('sitterId', sitterId);
    query.set('sitterName', sitterName);
    if (selectedDateRange[0])
      query.set('startDate', selectedDateRange[0].toISOString().split('T')[0]);
    if (selectedDateRange[1])
      query.set('endDate', selectedDateRange[1].toISOString().split('T')[0]);
    // query.set('date', selectedDate.toISOString().split('T')[0]);
    query.set('time', selectedTimeSlot);
    query.set('service', selectedService);
    query.set('price', servicePrice);
    query.set('unit', serviceUnit);

    const queryString = query.toString();

    hideModal();

    router.push(`/booking?${queryString}`);
  };

  // 時段選項
  const timeSlots = SERVICE_TIME_SLOTS_DATA;

  const BookingModal = (
    <>
      <div
        ref={modalRef}
        className="modal fade"
        id={modalId}
        tabIndex="-1"
        aria-labelledby={`${modalId}Label`}
        aria-hidden="true"
      >
        <div
          className={`modal-dialog modal-dialog-centered mx-auto ${styles.bookingModalDialog}`}
        >
          <form onSubmit={handleBookingSubmit} className="w-100">
            <div
              className={`${styles.bookingModalContent} modal-content px-7 pt-7 pb-9`}
            >
              <div className="modal-header border-0 justify-content-center position-relative p-0 mb-7">
                <h3 className="modal-title fs-5" id={`${modalId}Label`}>
                  預約資訊
                </h3>
              </div>

              <div className="modal-body p-0 mb-7">
                <div className="mb-5">
                  <label
                    htmlFor={`date-picker-${modalId}`}
                    className="form-label text-gray-500 small"
                  >
                    選擇日期
                  </label>
                  <div className="position-relative">
                    <DatePicker
                      selectsRange={true}
                      startDate={startDate}
                      endDate={endDate}
                      isClearable={true}
                      onChange={(dateRange) => setSelectedDateRange(dateRange)}
                      id={`date-picker-${modalId}`}
                      className={`${styles.datePickerInput} form-control border-0 bg-gray-1000 py-4 px-5`} // Bootstrap class
                      placeholderText="日期"
                      locale="zh-TW"
                      wrapperClassName="w-100"
                      dateFormat="yyyy/MM/dd"
                      minDate={new Date()}
                      required
                    />
                    {!hasDateValue && (
                      <ChevronDownIcon
                        className={`text-gray-500 position-absolute top-50 end-0 me-5 translate-middle-y ${styles.inputIcon}`}
                      />
                    )}
                  </div>
                </div>
                <div className="mb-5">
                  <label
                    htmlFor={`time-select-${modalId}`}
                    className="form-label text-gray-500 small"
                  >
                    選擇時段
                  </label>
                  <div className="position-relative">
                    <select
                      id={`time-select-${modalId}`}
                      className="form-select border-0 bg-gray-1000 py-4 px-5"
                      value={selectedTimeSlot}
                      onChange={(e) => setSelectedTimeSlot(e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        時段
                      </option>
                      {timeSlots.map((slot) => (
                        <option key={slot.value} value={slot.value}>
                          {slot.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor={`service-select-${modalId}`}
                    className="form-label text-gray-500 small"
                  >
                    選擇服務
                  </label>
                  <select
                    id={`service-select-${modalId}`}
                    className="form-select border-0 bg-gray-1000 py-4 px-5"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      服務
                    </option>
                    {services.map((service) => (
                      <option
                        key={service.serviceId || service.name}
                        value={service.name}
                      >
                        {service.name} - NT$ {service.price}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-footer border-top-gray-800 d-flex align-items-center flex-nowrap pt-7 px-0 pb-0">
                <button
                  type="button"
                  className="btn btn-outline-primary fw-bold border-2 w-50 py-5 me-4 my-0 ms-0"
                  onClick={hideModal}
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="btn btn-primary fw-bold text-light w-50 py-5 m-0"
                >
                  下一步
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );

  return (
    <>
      <button
        ref={modalRef}
        type="button"
        className="btn btn-primary w-100 booking-primary-btn text-light"
        onClick={openModal}
      >
        立即預約
      </button>
      {isClient
        ? createPortal(BookingModal, document.getElementById('modal-root'))
        : null}
    </>
  );
}
