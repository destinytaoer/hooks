import { useEffect, useState } from 'react';
import { DebounceOptions, useDebounceFn } from '../use-debounce-fn';

export const useDebounce = <T>(value: T, wait?: number, options?: DebounceOptions) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  const debouncedSetState = useDebounceFn((value: T) => setDebouncedValue(value), wait, options);

  useEffect(() => {
    debouncedSetState(value);
  }, [value]);

  return debouncedValue;
};
