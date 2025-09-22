
// 外層容器用
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // 讓子元件一個接一個出現，每個間隔 0.1 秒
    },
  },
};

// 獨立卡片用
export const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring', // 使用彈簧動畫
      stiffness: 100,
    },
  },
};

// 裝飾性小圖示用
export const iconVariants = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  },
};