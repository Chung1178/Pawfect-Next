'use client';

import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Modal } from 'bootstrap';

import { CheckCircleIcon } from '@heroicons/react/24/outline';

import styles from '@/app/ui/pages/booking.module.scss';
import { SERVICE_TIME_SLOTS_DATA } from '@/app/lib/placeholder-data';

const serviceTimeSlots = SERVICE_TIME_SLOTS_DATA;
const paymentOptions = [
  { id: 'creditCard', label: '信用卡' },
  { id: 'mobilePayment', label: '行動支付 (LINE Pay、Apple Pay、Google Pay)' },
  { id: 'bankTransfer', label: '銀行轉帳' },
];

// 使用 Suspense Wrapper 來安全地讀取 searchParams
function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const confirmModalRef = useRef(null);
  const successModalRef = useRef(null);

  useEffect(() => {
    const confirmModalEl = confirmModalRef.current;
    const successModalEl = successModalRef.current;

    const confirmModalInstance = confirmModalEl
      ? new Modal(confirmModalEl)
      : null;
    const successModalInstance = successModalEl
      ? new Modal(successModalEl, { backdrop: 'static', keyboard: false })
      : null;

    return () => {
      confirmModalInstance?.dispose();
      successModalInstance?.dispose();
    };
  }, []);

  const showConfirmModal = () =>
    Modal.getInstance(confirmModalRef.current)?.show();
  const hideConfirmModal = () =>
    Modal.getInstance(confirmModalRef.current)?.hide();

  const showSuccessModal = () =>
    Modal.getInstance(successModalRef.current)?.show();

  //從 URL 讀取訂單資訊並進行計算
  const orderDetails = useMemo(() => {
    const sitterId = searchParams.get('sitterId');
    const sitterName = searchParams.get('sitterName');
    const service = searchParams.get('service');
    const price = parseFloat(searchParams.get('price')) || 0;
    const time = searchParams.get('time');
    const unit = searchParams.get('unit') || '次';
    const startDateStr = searchParams.get('startDate');
    const endDateStr = searchParams.get('endDate');

    const matchedTimeSlot = serviceTimeSlots.find(
      (slot) => slot.value === time
    );
    const timeSlot = matchedTimeSlot ? matchedTimeSlot.label : '';

    let numberOfDays = 1;
    let dateDisplay = startDateStr ? startDateStr.replace(/-/g, '/') : 'N/A';

    // 如果有起始和結束日期，則計算天數/夜數
    if (startDateStr && endDateStr) {
      const start = new Date(startDateStr);
      const end = new Date(endDateStr);
      // 計算毫秒差並轉換為天數
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      // 如果單位是 '晚'，天數是 diffDays；如果是 '日'，則是 diffDays + 1
      numberOfDays = unit === '晚' ? diffDays : diffDays + 1;
      dateDisplay = `${startDateStr.replace(/-/g, '/')} - ${endDateStr.replace(
        /-/g,
        '/'
      )}`;
    }

    const subtotal = price * numberOfDays;
    const fee = 30;
    const totalAmount = subtotal + fee;

    return {
      sitterId,
      sitterName,
      service,
      price,
      unit,
      timeSlot,
      dateDisplay,
      numberOfDays,
      subtotal,
      fee,
      totalAmount,
    };
  }, [searchParams]);

  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [cardInfo, setCardInfo] = useState({
    type: '',
    name: '',
    number1: '',
    number2: '',
    number3: '',
    number4: '',
    expMonth: '',
    expYear: '',
    cvv: '',
    phone: '',
  });

  // 處理表單輸入
  const handleCardInfoChange = (e) => {
    const { name, value } = e.target;
    setCardInfo((prev) => ({ ...prev, [name]: value }));
  };

  // 處理付款表單提交
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    // 實際應用中會在這裡驗證表單並呼叫付款 API
    console.log('Payment details submitted:', {
      orderDetails,
      paymentMethod,
      cardInfo,
    });
    showConfirmModal();
  };

  const handleFinalConfirmation = () => {
    // 模擬 API 呼叫成功
    hideConfirmModal();
    // 延遲一下再顯示成功 modal，模擬處理過程
    setTimeout(() => {
      showSuccessModal();
    }, 500);
  };

  const handleReturnToHome = () => {
    const successModalElement = successModalRef.current;
    if (!successModalElement) return;

    const onModalHidden = () => {
      router.push('/');
    };
    successModalElement.addEventListener('hidden.bs.modal', onModalHidden, {
      once: true,
    });
    Modal.getInstance(successModalElement)?.hide();
  };

  // --- 動態生成選項 ---
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, '0')
  );

  return (
    <>
      <main className={styles.orderSummary}>
        <section className="container pt-25 pb-13 pt-lg-43 pb-lg-31">
          <div className="mb-9 mb-lg-19">
            <h1 className="text-center fw-bold text-gray-200 fs-6 fs-lg-3">
              請確認以下預約資訊
            </h1>
          </div>
          <div className="row">
            {/* 左側的訂單摘要卡片 */}
            <div className="col-lg-6 mb-5">
              <div className="card p-7 pt-lg-11 ps-lg-13 pb-lg-13 pe-lg-23">
                <h2 className="fs-7 fs-lg-4 text-gray-200 mb-5 mb-lg-7">
                  訂單摘要
                </h2>
                <div className="d-flex justify-content-between mb-5 mb-lg-7">
                  <span>服務項目</span>
                  <span>{orderDetails.service || 'N/A'}</span>
                </div>
                <div className="d-flex justify-content-between mb-5 mb-lg-7">
                  <span>保母名稱</span>
                  <span>{orderDetails.sitterName || 'N/A'}</span>
                </div>
                <div className="d-flex justify-content-between mb-5 mb-lg-7">
                  <span>日期</span>
                  <span>{orderDetails.dateDisplay || 'N/A'}</span>
                </div>
                <div className="d-flex justify-content-between mb-5 mb-lg-7">
                  <span>時間</span>
                  <span>
                    {orderDetails.timeSlot || 'N/A'}
                    {' / '}共 {orderDetails.numberOfDays}{' '}
                    {orderDetails.unit === '晚' ? '晚' : '天'}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-5 mb-lg-7">
                  <span>價格</span>
                  <span>NT$ {orderDetails.price.toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between mb-5 mb-lg-7">
                  <span>手續費</span>
                  <span>NT$ {orderDetails.fee.toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between border-top border-gray-800 pt-4 pt-lg-7">
                  <span className="fw-bold">總計金額</span>
                  <span className="fw-bold text-end text-gray-200">
                    NT$ {orderDetails.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* 右側的付款表單卡片 */}
            <div className="col-lg-6">
              <form
                onSubmit={handlePaymentSubmit}
                className="card p-7 pt-lg-11 px-lg-13 pb-lg-13 h-100"
              >
                {/* 付款方式 radio buttons */}
                <div
                  className={`pb-7 pb-lg-5 pb-lg-11 border-bottom border-gray-800`}
                >
                  <h2 className="fs-7 fs-lg-4 text-gray-200 mb-5 mb-lg-7">
                    付款選項
                  </h2>
                  {paymentOptions.map((option, index) => (
                    <div
                      key={option.id}
                      className={`form-check ${styles.paymentTypeSelect} ${
                        index < paymentOptions.length - 1 ? 'mb-4 mb-lg-5' : ''
                      }`}
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod" // 所有 radio button 必須有相同的 name
                        id={option.id}
                        value={option.id}
                        // checked 屬性由 React state 決定
                        checked={paymentMethod === option.id}
                        // onChange 事件更新 React state
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <label
                        className="form-check-label fs-9"
                        htmlFor={option.id}
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>

                {/* 信用卡詳細資訊 (只有當選擇信用卡時才顯示) */}
                {paymentMethod === 'creditCard' && (
                  <div
                    className={`pt-7 pt-lg-11 pb-7 pb-lg-11 border-bottom border-gray-800 ${styles.paymentTypeContent}`}
                  >
                    <h2 className="fs-7 fs-lg-4 text-gray-200 mb-5 mb-lg-7">
                      信用卡選項
                    </h2>
                    <div className="row g-4 mb-4 mb-lg-5">
                      <div className="col-12 col-xl-6">
                        <label
                          htmlFor="creditCardType"
                          className="form-label small"
                        >
                          信用卡類型
                        </label>
                        <select
                          className="form-select py-4 px-5"
                          id="creditCardType"
                          name="type"
                          value={cardInfo.type}
                          onChange={handleCardInfoChange}
                          required
                        >
                          <option value="" disabled>
                            Visa / Master / JCB
                          </option>
                          <option value="Visa">Visa</option>
                          <option value="Master">Master</option>
                          <option value="JCB">JCB</option>
                        </select>
                      </div>
                      <div className="col-12 col-xl-6">
                        <label
                          htmlFor="cardHolderName"
                          className="form-label small"
                        >
                          持卡人姓名
                        </label>
                        <input
                          type="text"
                          className="form-control py-4 px-5"
                          id="cardHolderName"
                          name="name"
                          placeholder="請輸入姓名"
                          value={cardInfo.name}
                          onChange={handleCardInfoChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-4 mb-lg-5">
                      <label
                        htmlFor="creditCardNumber1"
                        className="form-label small"
                      >
                        信用卡號
                      </label>
                      <div className="d-flex gap-2">
                        <input
                          className="form-control py-4 px-5 text-center"
                          type="text"
                          id="creditCardNumber1"
                          name="number1"
                          placeholder="0000"
                          maxLength="4"
                          value={cardInfo.number1}
                          onChange={handleCardInfoChange}
                          required
                        />
                        <input
                          className="form-control py-4 px-5 text-center"
                          type="text"
                          name="number2"
                          placeholder="0000"
                          maxLength="4"
                          value={cardInfo.number2}
                          onChange={handleCardInfoChange}
                          required
                        />
                        <input
                          className="form-control py-4 px-5 text-center"
                          type="text"
                          name="number3"
                          placeholder="0000"
                          maxLength="4"
                          value={cardInfo.number3}
                          onChange={handleCardInfoChange}
                          required
                        />
                        <input
                          className="form-control py-4 px-5 text-center"
                          type="text"
                          name="number4"
                          placeholder="0000"
                          maxLength="4"
                          value={cardInfo.number4}
                          onChange={handleCardInfoChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="row g-4">
                      <div className="col-12 col-xl-6">
                        <label
                          htmlFor="validYearMonth"
                          className="form-label small"
                        >
                          有效年月
                        </label>
                        <div className="row g-2">
                          <div className="col">
                            <select
                              className="form-select py-4 px-5"
                              id="validYearMonth"
                              name="expMonth"
                              value={cardInfo.expMonth}
                              onChange={handleCardInfoChange}
                              required
                            >
                              <option value="" disabled>
                                月
                              </option>
                              {months.map((m) => (
                                <option key={m} value={m}>
                                  {m}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col">
                            <select
                              className="form-select py-4 px-5"
                              name="expYear"
                              value={cardInfo.expYear}
                              onChange={handleCardInfoChange}
                              required
                            >
                              <option value="" disabled>
                                年
                              </option>
                              {years.map((y) => (
                                <option key={y} value={y}>
                                  {y}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-xl-6">
                        <label
                          htmlFor="cardBackNumber"
                          className="form-label small"
                        >
                          背面末三碼
                        </label>
                        <input
                          type="text"
                          className="form-control py-4 px-5"
                          id="cardBackNumber"
                          name="cvv"
                          placeholder="CVV"
                          maxLength="3"
                          value={cardInfo.cvv}
                          onChange={handleCardInfoChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="d-flex pt-7 pt-lg-11">
                  <Link
                    href={`/sitters/${orderDetails.sitterId}`}
                    className="btn btn-outline-primary fw-bold rounded-3 border-3 py-5 w-50 me-2"
                  >
                    上一步
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary fw-bold rounded-3 py-5 text-light w-50"
                  >
                    下一步
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* 付款確認 Modal */}
      <div
        ref={confirmModalRef}
        className="modal fade"
        id="paymentConfirmModal"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className={`modal-content ${styles.modalContent}`}>
            <div className="modal-header border-0 pt-7 px-7 pb-0">
              <h3 className="modal-title fs-6 text-gray-200 mx-auto">
                付款確認
              </h3>
            </div>
            <div className="modal-body p-7 border-bottom border-gray-800">
              <div className="d-flex justify-content-between mb-5 small">
                <span className="text-muted">服務項目</span>
                <span>{orderDetails.service}</span>
              </div>
              <div className="d-flex justify-content-between mb-5 small">
                <span className="text-muted">保母名稱</span>
                <span>{orderDetails.sitterName}</span>
              </div>
              <div className="d-flex justify-content-between mb-5 small">
                <span className="text-muted">日期</span>
                <span>{orderDetails.dateDisplay}</span>
              </div>
              <div className="d-flex justify-content-between mb-5 small">
                <span className="text-muted">時間</span>
                <span>
                  {orderDetails.timeSlot || 'N/A'}
                  {' / '}共 {orderDetails.numberOfDays}{' '}
                  {orderDetails.unit === '晚' ? '晚' : '天'}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-5 small">
                <span className="text-muted">價格</span>
                <span>NT$ {orderDetails.subtotal.toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between mb-5 small">
                <span className="text-muted">平台手續費</span>
                <span>NT$ {orderDetails.fee.toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between">
                <strong>總計金額</strong>
                <strong>NT$ {orderDetails.totalAmount.toLocaleString()}</strong>
              </div>
            </div>
            <div className="modal-footer d-flex flex-nowrap align-items-center border-0 pt-7 px-7 pb-9">
              <button
                type="button"
                className="btn btn-outline-primary fw-bold w-50 me-4 border-3 py-5 rounded-3"
                onClick={hideConfirmModal}
              >
                取消交易
              </button>
              <button
                type="button"
                className="btn btn-primary text-light fw-bold w-50 py-5 rounded-3"
                onClick={handleFinalConfirmation}
              >
                確認交易
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 付款成功 Modal */}
      <div
        ref={successModalRef}
        className="modal fade"
        id="paymentSuccessModal"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className={`modal-content text-center ${styles.modalContent}`}>
            <div className="modal-body p-7">
              <CheckCircleIcon
                className="text-success mx-auto mb-3"
                style={{ width: '4rem', height: '4rem' }}
              />
              <h3 className="modal-title fs-5 text-gray-200 mb-4">
                恭喜您付款成功！
              </h3>
              <p className="small mb-5">
                付款成功紀錄已寄至你的Email信箱，可於會員中心查看訂單資訊。
              </p>
              <button
                type="button"
                className="btn btn-primary text-light w-100"
                onClick={handleReturnToHome}
              >
                返回首頁
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function BookingPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingContent />
    </Suspense>
  );
}
