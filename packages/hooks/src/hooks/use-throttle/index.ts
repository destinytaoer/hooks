import { useEffect, useState } from 'react';
import { ThrottleOptions, useThrottleFn } from '../use-throttle-fn';

export const useThrottle = <T>(value: T, wait?: number, options?: ThrottleOptions) => {
  const [throttledValue, setThrottledValue] = useState(value);

  const throttledSetState = useThrottleFn((value: T) => setThrottledValue(value), wait, options);

  useEffect(() => {
    throttledSetState(value);
  }, [value]);

  return throttledValue;
};
