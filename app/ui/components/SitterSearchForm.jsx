'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  ChevronDownIcon,
  MapPinIcon,
  CalendarDaysIcon,
} from '@heroicons/react/20/solid';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import { zhTW } from 'date-fns/locale/zh-TW';

import styles from './SitterSearch.module.scss';

registerLocale('zh-TW', zhTW);

const serviceTypes = [
  {
    key: '遛狗散步',
    text: '遛狗散步',
    icon: '/search-page/Dog-icon-primary.svg',
  },
  {
    key: '日間托養',
    text: '日間托養',
    icon: '/search-page/Sun-icon-primary.svg',
  },
  {
    key: '外宿寄養',
    text: '外宿寄養',
    icon: '/search-page/Home-icon-primary.svg',
  },
  {
    key: '上門餵食',
    text: '上門餵食',
    icon: '/search-page/Bone-icon-primary.svg',
  },
];

const taiwanCities = [
  '台北市',
  '新北市',
  '桃園市',
  '台中市',
  '台南市',
  '高雄市',
  '基隆市',
  '新竹市',
  '嘉義市',
  '新竹縣',
  '苗栗縣',
  '彰化縣',
  '南投縣',
  '雲林縣',
  '嘉義縣',
  '屏東縣',
  '宜蘭縣',
  '花蓮縣',
  '台東縣',
  '澎湖縣',
  '金門縣',
  '連江縣',
];

const petTypeOptions = [
  { value: '', label: '貓 / 狗' },
  { value: '貓', label: '貓' },
  { value: '狗', label: '狗' },
];

export default function SearchFormFields({
  onSearchSubmit,
  isModal = false,
  initialValues = {},
  hideModal,
}) {
  const [selectedService, setSelectedService] = useState(
    initialValues.service || '日間托養'
  );
  const [selectedPetType, setSelectedPetType] = useState(
    initialValues.petType || ''
  );
  const [selectedArea, setSelectedArea] = useState(initialValues.area || '');
  const [dateRange, setDateRange] = useState(
    initialValues.dates || [null, null]
  );
  const [startDate, endDate] = dateRange;

  const petDropdownRef = useRef(null);
  const petDropdownInstance = useRef(null);
  const areaDropdownRef = useRef(null);
  const areaDropdownInstance = useRef(null);

  useEffect(() => {
    const loadBootstrap = async () => {
      if (typeof window !== 'undefined') {
        const { Dropdown } = await import('bootstrap');
        petDropdownInstance.current = new Dropdown(petDropdownRef.current, {
          autoClose: 'outside',
          boundary: 'clippingParents',
        });
        areaDropdownInstance.current = new Dropdown(areaDropdownRef.current);
      }
    };

    loadBootstrap();

    return () => {
      if (petDropdownInstance.current) petDropdownInstance.current.dispose();
      if (areaDropdownInstance.current) areaDropdownInstance.current.dispose();
    };
  }, []);

  const showPetDropdown = () => {
    petDropdownInstance.current.toggle();
  };

  const showAreaDropdown = () => {
    areaDropdownInstance.current.toggle();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchParams = {
      service: selectedService,
      petType: selectedPetType,
      address: selectedArea,
      dates: dateRange,
    };
    onSearchSubmit(searchParams);
  };

  const hasDateValue = startDate !== null;

  return (
    <form
      onSubmit={handleSubmit}
      className={`${isModal ? '' : 'shadow-primary'} ${
        styles.sitterSearchForm
      }`}
    >
      <div className="row g-0">
        {serviceTypes.map((service) => (
          <div className="col-3" key={service.key}>
            <button
              type="button"
              className={`btn rounded-0 w-100 d-flex flex-column justify-content-center align-items-center h-100 py-5 px-0 p-md-6 ${
                styles.typeSelectBtn
              } ${selectedService === service.key ? styles.active : ''}`}
              onClick={() => setSelectedService(service.key)}
            >
              <Image
                src={service.icon}
                alt={`${service.text} icon`}
                width={32}
                height={32}
                className="mb-4"
              />
              <h3 className="fs-9 fs-md-7">{service.text}</h3>
            </button>
          </div>
        ))}
      </div>
      <div
        className={`p-7 pt-md-5 ${isModal ? '' : 'border-top border-gray-800'}`}
      >
        <div
          className={`row gx-4 ${
            isModal ? 'gy-5 flex-column' : 'align-items-end'
          }`}
        >
          <div className={`${isModal ? 'col-12' : 'col'}`}>
            <label className="text-gray-500 mb-2 small d-block">您的寵物</label>
            <div className="dropdown">
              <button
                ref={petDropdownRef}
                className="form-control border-0 bg-gray-1000  text-start d-flex justify-content-between align-items-center py-4 px-5 rounded-3"
                type="button"
                data-bs-toggle="dropdown"
                onClick={showPetDropdown}
              >
                <div className="d-flex align-items-center">
                  <Image
                    src="/search-page/Pet-icon.svg"
                    width={24}
                    height={24}
                    alt="pet-icon"
                    className="me-2"
                  />
                  <span>{selectedPetType || '貓 / 狗'}</span>
                </div>
                <ChevronDownIcon
                  className="text-gray-500"
                  style={{ width: '1.25rem', height: '1.25rem' }}
                />
              </button>
              <ul
                className={`${styles.searchDropdownMenu} dropdown-menu w-100`}
              >
                {petTypeOptions.map((opt) => (
                  <li key={opt.value}>
                    <button
                      className="dropdown-item"
                      type="button"
                      onClick={() => setSelectedPetType(opt.value)}
                    >
                      {opt.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className={`${isModal ? 'col-12' : 'col'}`}>
            <label className="text-gray-500 mb-2 small d-block">您的地區</label>
            <div className="dropdown">
              <button
                ref={areaDropdownRef}
                className="form-control border-0 bg-gray-1000 text-start d-flex justify-content-between align-items-center py-4 px-5 rounded-3"
                type="button"
                onClick={showAreaDropdown}
                data-bs-toggle="dropdown"
              >
                <div className="d-flex align-items-center">
                  <MapPinIcon
                    className={`me-2 text-gray-500 ${styles.inputIcon}`}
                  />
                  <span>{selectedArea || '選擇地區'}</span>
                </div>
                <ChevronDownIcon
                  className="text-gray-500"
                  style={{ width: '1.25rem', height: '1.25rem' }}
                />
              </button>
              <ul
                className={`dropdown-menu border-gray-700 mt-2 w-100 ${styles.searchDropdownMenu}`}
              >
                {taiwanCities.map((city) => (
                  <li key={city}>
                    <button
                      className="dropdown-item"
                      type="button"
                      onClick={() => setSelectedArea(city)}
                    >
                      {city}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className={`${isModal ? 'col-12' : 'col'}`}>
            <label className="text-gray-500 mb-2 small d-block">照顧期間</label>
            <div className={`position-relative ${styles.datePickerContainer}`}>
              {!hasDateValue && (
                <CalendarDaysIcon
                  className={`position-absolute top-50 translate-middle-y ms-5 text-gray-500 ${styles.inputIcon}`}
                />
              )}

              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => setDateRange(update)}
                isClearable={true}
                placeholderText="       日期"
                wrapperClassName="w-100"
                className={`form-control ${styles.datePickerInput} w-100 border-0 bg-gray-1000 rounded-3 py-4 px-5`}
                locale="zh-TW"
                dateFormat="yyyy/MM/dd"
                minDate={new Date()}
              />
              {!hasDateValue && (
                <ChevronDownIcon
                  className={`text-gray-500 position-absolute top-50 end-0 me-5 translate-middle-y ${styles.inputIcon}`}
                />
              )}
            </div>
          </div>
          <div className={`${isModal ? 'col-12 mt-7' : 'col'}`}>
            <div
              className={
                isModal ? 'border-top border-gray-800 pt-7 d-flex' : ''
              }
            >
              <button
                type="button"
                className="d-md-none btn btn-outline-primary w-100 me-3"
                onClick={hideModal}
              >
                取消
              </button>
              <button
                type="submit"
                className="btn btn-primary text-light w-100 py-4 px-5"
              >
                {isModal ? '搜尋' : '搜尋保母'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
