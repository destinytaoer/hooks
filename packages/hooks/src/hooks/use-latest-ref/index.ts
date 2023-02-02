import { useCallback, useRef } from 'react';

export const useLatestRef = <T>(value: T) => {
  const latest = useRef(value);
  latest.current = value;

  return latest;
};
