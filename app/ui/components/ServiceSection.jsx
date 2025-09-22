'use client';
import styles from '@/app/ui/pages/home.module.scss';
import Image from 'next/image';
import { SERVICES_DATA } from '@/app/lib/placeholder-data';
import { motion } from 'framer-motion';
import { containerVariants, cardVariants } from '@/app/lib/animations';

// 資料引入
const servicesData = SERVICES_DATA;

export default function ServiceSection() {
  return (
    <>
      <section className={`bg-gradient-light pt-17 pb-13 pt-md-42 pb-md-31`}>
        <h2 className="text-center text-primary fs-5 fs-md-3 d-md-block d-none d-flex align-items-center justify-content-center mb-21">
          <span className="pe-6 fs-6">\</span>
          <span className="text-center fw-bold">最 Pawfect 的寵物保母服務</span>
          <span className="ps-6 fs-6">/</span>
        </h2>
        <h2 className="text-center text-primary fs-5 d-md-none d-block d-flex align-items-center justify-content-center mb-9">
          <span className="pe-4 fs-6">\</span>
          <div className="text-center">
            <span className="d-block fw-bold">最 Pawfect 的</span>
            <span className="d-block fw-bold">寵物保母服務</span>
          </div>
          <span className="ps-4 fs-6">/</span>
        </h2>
        <div className="container">
          <div className="row justify-content-center">
            {servicesData.map((service, index) => (
              <motion.div
                className={`col-md-10 mb-9 mb-md-17`}
                key={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                <div
                  className={`row justify-content-md-around ${
                    service.reverse ? 'flex-md-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`col-md-5 justify-content-md-start ${styles.serviceImg}`}
                  >
                    <Image
                      src={service.img}
                      alt={`${service.title}照片`}
                      width={500}
                      height={350}
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <div className={`col-md-6 ${styles.serviceLead}`}>
                    <div>
                      <h3>{service.title}</h3>
                      <p className="text-center text-md-start">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
