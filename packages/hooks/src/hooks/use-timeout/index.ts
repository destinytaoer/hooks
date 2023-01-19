import { useCallback, useEffect, useRef } from 'react';
import { useLatest } from '../use-latest';

export const useTimeout = (fn: () => void, delay: number | undefined) => {
  const getLatestFn = useLatest(fn);
  // 如果不需要手动 clear 方法, timer 可以不提取出来
  const timer = useRef<NodeJS.Timer | null>(null);

  const clear = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
  }, []);

  useEffect(() => {
    // 如果 delay 不符合则直接返回
    if (typeof delay !== 'number' || delay < 0) {
      return;
    }
    timer.current = setTimeout(() => {
      const fn = getLatestFn();
      fn();
    }, delay);

    return clear;
  }, [delay]);

  return clear;
};
