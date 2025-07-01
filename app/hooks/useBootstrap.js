'use client';
import { useEffect, useRef } from 'react';

export function useTooltip() {
  const tooltipInstances = useRef([]);

  useEffect(() => {
    const initTooltips = async () => {
      try {
        const { Tooltip } = await import('bootstrap');

        // 先清理現有實例
        tooltipInstances.current.forEach((tooltip) => tooltip?.dispose());
        tooltipInstances.current = [];

        // 初始化新的 tooltips
        const tooltipElements = document.querySelectorAll(
          '[data-bs-toggle="tooltip"]'
        );
        tooltipInstances.current = Array.from(tooltipElements).map(
          (element) => new Tooltip(element)
        );
      } catch (error) {
        console.error('Tooltip 初始化失敗:', error);
      }
    };

    initTooltips();

    return () => {
      tooltipInstances.current.forEach((tooltip) => tooltip?.dispose());
    };
  }, []);

  return tooltipInstances.current;
}
