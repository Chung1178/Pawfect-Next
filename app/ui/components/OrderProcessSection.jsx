'use client';
import styles from '@/app/ui/pages/home.module.scss';
import Image from 'next/image';

import { SERVICE_PROCESS_DATA } from '@/app/lib/placeholder-data';

import React from 'react';
import { motion } from 'framer-motion';
import {
  containerVariants,
  cardVariants,
  iconVariants,
} from '@/app/lib/animations';

// 資料引入
const processData = SERVICE_PROCESS_DATA;

export default function OrderProcessSection() {
  return (
    <>
      <section className={`bg-gradient-light pt-12 pb-14 pt-lg-30 pb-lg-40`}>
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            <motion.h2
              variants={cardVariants}
              className="text-center text-primary fs-5 fs-md-3 d-flex align-items-center justify-content-center mb-1 mb-md-2"
            >
              <span className="pe-md-7 pe-2 fs-6">\</span>
              <span className="text-center fw-bold">最 Pawfect 的預訂體驗</span>
              <span className="ps-md-7 ps-2 fs-6">/</span>
            </motion.h2>
            <motion.p
              variants={cardVariants}
              className="text-center fs-9 fs-md-7 text-gray-300 mb-9 mb-md-21"
            >
              預定流程直覺好上手
            </motion.p>
            <div className="d-flex flex-column flex-lg-row justify-content-center align-items-center">
              {processData.map((card, index) => (
                <React.Fragment key={card.order}>
                  <motion.div
                    className={`${styles.orderProcessCard} bg-light px-6 pt-5 pb-7 h-100`}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={cardVariants}
                  >
                    <div className="d-flex flex-md-column align-items-center justify-content-between mb-md-4">
                      <p
                        className={`${styles.cardOrder} text-center mb-md-4 ${card.colorClass}`}
                      >
                        {card.order}
                      </p>
                      <div className={`${styles.cardIcon}`}>
                        <Image
                          src={card.icon}
                          className="card-img-top img-fluid"
                          alt={`${card.title} Icon`}
                          width={140}
                          height={100}
                          style={{ objectFit: 'contain' }}
                        />
                      </div>
                    </div>
                    <div className="d-flex flex-column align-items-md-center">
                      <h4 className="card-title fs-md-6 fs-7 mb-4">
                        {card.title}
                      </h4>
                      <p className="card-text text-start text-lg-center">
                        {card.description}
                      </p>
                    </div>
                  </motion.div>

                  {index < processData.length - 1 && (
                    <>
                      <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={iconVariants}
                        className={`${styles.decorativeIcon1} d-none d-lg-block mx-5 flex-shrink-0`}
                      >
                        <Image
                          src={
                            index % 2 === 0 ? '/dogPrint.png' : '/dogPrint2.png'
                          }
                          alt="裝飾性圖標"
                          width={75}
                          height={109}
                        />
                      </motion.div>

                      <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                        variants={iconVariants}
                        className={`d-flex d-lg-none justify-content-center align-items-center my-4`}
                      >
                        <div className={styles.decorativeIcon2}>
                          <Image
                            src={
                              index % 2 === 0
                                ? '/dogPrint.png'
                                : '/dogPrint2.png'
                            }
                            alt="裝飾性圖標"
                            width={52}
                            height={75}
                          />
                        </div>
                      </motion.div>
                    </>
                  )}
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
