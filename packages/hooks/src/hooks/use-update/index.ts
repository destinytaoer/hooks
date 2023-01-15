import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

export const useUpdate = (fn: EffectCallback, deps?: DependencyList) => {
  if (typeof fn !== 'function') {
    console.error('useUpdate: parameter fn is not a function');
  }

  // 是否挂载过一次
  const isMounted = useRef(false);

  // 防止部分局部刷新导致的问题, 如 react-refresh
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    // 挂载过之后 update 才会执行 fn
    if (isMounted.current) {
      return fn();
    } else {
      isMounted.current = true;
    }
  }, deps);
};
