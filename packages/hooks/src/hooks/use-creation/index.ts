import { DependencyList, useRef } from 'react';
import depsAreSame from '../utils/depsAreSame';

// 用于创建开销较大的对象, 避免每次渲染都重新创建
// export const useCreation = <T>(factory: () => T) => {
//   const ref = useRef<T>();
//   if (!ref.current) {
//     ref.current = factory();
//   }
//   return ref.current;
// }

// ahooks 进阶版, 增加依赖
// useMemo 不能保证被 memo 的值一定不会被重计算
// useRef 没有惰性初始化, 存在性能开销
export const useCreation = <T>(factory: () => T, deps: DependencyList) => {
  const { current } = useRef({
    deps,
    value: undefined as undefined | T,
    initialize: false,
  });

  if (!current.initialize || !depsAreSame(current.deps, deps)) {
    current.deps = deps;
    current.value = factory();
    current.initialize = true;
  }

  return current.value as T;
};
