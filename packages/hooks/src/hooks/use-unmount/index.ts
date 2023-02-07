import { useEffect } from 'react';
import { useLatestRef } from '../use-latest-ref';
import {isFunction} from "../utils";

export const useUnmount = (fn: () => void) => {
  if (!isFunction(fn)) {
    console.error('useUnmount: parameter fn is not a function');
  }
  const fnRef = useLatestRef(fn);

  useEffect(
    () => () => {
      fnRef.current();
    },
    []
  );
  return {};
};
