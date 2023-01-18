import { useEffect } from 'react';
import { useLatestRef } from '../use-latest-ref';

export const useUnmount = (fn: () => void) => {
  if (typeof fn !== 'function') {
    console.error('useUnmount: parameter fn is not a function');
  }
  const latestFn = useLatestRef(fn);

  useEffect(
    () => () => {
      latestFn.current();
    },
    []
  );
  return {};
};
