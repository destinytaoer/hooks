import { useMemo } from 'react';
import { debounce } from 'lodash';
import { useUnmount } from '../use-unmount';
import { useLatestRef } from '../use-latest-ref';
import { isFunction } from '../utils';

type Fn = (...args: any[]) => any;

// 参考 lodash debounce
export interface DebounceOptions {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}

// 构建防抖函数
export const useDebounceFn = <T extends Fn>(fn: T, wait = 1000, options?: DebounceOptions) => {
  if (!isFunction(fn)) {
    console.error('useDebounceFn: parameter fn is not a function');
  }

  const fnRef = useLatestRef(fn);

  const debouncedFn = useMemo(
    () =>
      debounce(
        (...args: Parameters<T>): ReturnType<T> => {
          return fnRef.current(...args);
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
