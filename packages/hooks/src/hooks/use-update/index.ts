import { EffectCallback, useEffect } from 'react';

export const useUpdate = (fn: EffectCallback, deps: any[]) => {
  if (typeof fn !== 'function') {
    console.error('useUpdate: parameter fn is not a function');
  }
  // 使用的时候, 希望能够执行清楚副作用, 避免分开在两个不同的地方
  // fn 执行的返回值可以是一个函数, 用于清楚副作用
  useEffect(fn, deps);
};
