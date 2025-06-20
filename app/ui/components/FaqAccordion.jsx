'use client';

import { useState } from 'react';
import styles from './FaqAccordion.module.scss';

export default function FaqAccordion({ faqData = [] }) {
  const [activeItemId, setActiveItemId] = useState(null);

  const handleToggle = (itemId) => {
    setActiveItemId((prevId) => (prevId === itemId ? null : itemId));
  };

  if (!faqData || faqData.length === 0) {
    return <p className="text-muted">目前沒有常見問題。</p>;
  }

  return (
    <div
      className={`accordion accordion-flush ${styles.faqAccordionContainer}`}
    >
      {faqData.map((item) => {
        const isActive = activeItemId === item.id;

        return (
          <div className="accordion-item" key={item.id}>
            <h3 className="accordion-header">
              <button
                className={`accordion-button fw-bold bg-transparent 
                  ${
                    isActive
                      ? 'text-gray-300-hover'
                      : 'collapsed text-primary-hover'
                  } 
                  ${styles.accordionButtonCustom}`}
                type="button"
                onClick={() => handleToggle(item.id)}
                aria-expanded={isActive}
              >
                {item.question}
              </button>
            </h3>
            <div
              id={`collapse-${item.id}`}
              className={`accordion-collapse collapse ${
                isActive ? 'show' : ''
              }`}
            >
              <div
                className="accordion-body text-start"
                style={{ whiteSpace: 'pre-line' }}
              >
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
