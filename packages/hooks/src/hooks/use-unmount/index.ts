import { useEffect } from 'react';
import { useLatest } from '../use-latest';

export const useUnmount = (fn: () => void) => {
  if (typeof fn !== 'function') {
    console.error('useUnmount: parameter fn is not a function');
  }
  const getLatestValue = useLatest(fn);

  useEffect(
    () => () => {
      getLatestValue()();
    },
    []
  );
  return {};
};
