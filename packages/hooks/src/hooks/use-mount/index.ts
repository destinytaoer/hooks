import { EffectCallback, useEffect } from 'react';
import { isFunction } from '../utils';

export const useMount = (fn: EffectCallback) => {
  if (!isFunction(fn)) {
    console.error('useMount: parameter fn is not a function');
  }
  // 使用的时候, 希望能够执行清楚副作用, 避免分开在两个不同的地方
  // fn 执行的返回值可以是一个函数
  useEffect(fn, []);
};
