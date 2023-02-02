import { useCallback, useRef } from 'react';

export const useLockFn = <P extends any[] = any[], V extends any = any>(
  fn: (...args: P) => Promise<V>
) => {
  const isLocked = useRef(false);

  return useCallback(
    async (...args: P) => {
      if (isLocked.current) return;
      isLocked.current = true;
      try {
        const ret = await fn(...args);
        isLocked.current = false;
        return ret;
      } catch (e) {
        isLocked.current = false;
        throw e;
      }
    },
    [fn]
  );
};
