import { useMemo } from 'react';
import { debounce } from 'lodash';
import { useUnmount } from '../use-unmount';
import { useLatest } from '../use-latest';

type Fn = (...args: any[]) => any;

// 参考 lodash debounce
export interface DebounceOptions {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}

// 构建防抖函数
export const useDebounceFn = <T extends Fn>(fn: T, wait = 1000, options?: DebounceOptions) => {
  if (typeof fn !== 'function') {
    console.error('useDebounceFn: parameter fn is not a function');
  }

  const getLatestFn = useLatest(fn);

  const debouncedFn = useMemo(
    () =>
      debounce(
        (...args: Parameters<T>): ReturnType<T> => {
          return getLatestFn()(...args);
        },
        wait,
        options
      ),
    []
  );

  useUnmount(() => {
    debouncedFn.cancel();
  });

  return debouncedFn;
};
