import {useCallback, useEffect, useRef} from 'react';
import { useLatest } from '../use-latest';

export const useInterval = (fn: () => void, delay: number | undefined) => {
  const getLatestFn = useLatest(fn);
  const timer = useRef<NodeJS.Timer | null>(null);
  const clear = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
    }
  }, []);

  useEffect(() => {
    // 如果 delay 不符合则直接返回
    if (typeof delay !== 'number' || delay < 0) {
      return;
    }
    timer.current = setInterval(() => {
      const fn = getLatestFn();
      fn();
    }, delay);

    return clear;
  }, [delay]);

  return clear;
};
