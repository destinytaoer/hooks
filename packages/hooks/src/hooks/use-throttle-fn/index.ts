import { useMemo } from 'react';
import { throttle } from 'lodash';
import { useUnmount } from '../use-unmount';
import { useLatest } from '../use-latest';

type Fn = (...args: any[]) => any;

export interface ThrottleOptions {
  leading?: boolean;
  trailing?: boolean;
}

export const useThrottleFn = <T extends Fn>(fn: T, wait = 1000, options?: ThrottleOptions) => {
  if (typeof fn !== 'function') {
    console.error('useDebounceFn: parameter fn is not a function');
  }

  const getLatestFn = useLatest(fn);

  const throttledFn = useMemo(
    () =>
      throttle(
        (...args: Parameters<T>): ReturnType<T> => {
          return getLatestFn()(...args);
        },
        wait,
        options
      ),
    []
  );

  useUnmount(() => {
    throttledFn.cancel();
  });

  return throttledFn;
};
