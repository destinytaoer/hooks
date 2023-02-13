import { useMemo, useRef } from 'react';
import { isFunction } from '../utils';

type noop = (this: any, ...args: any[]) => any;

type PickFunction<T extends noop> = (
  this: ThisParameterType<T>,
  ...args: Parameters<T>
) => ReturnType<T>;

export function useMemoizedFn<T extends noop>(fn: T) {
  if (!isFunction(fn)) {
    console.error(`useMemoizedFn expected parameter is a function, got ${typeof fn}`);
  }

  const fnRef = useRef<T>(fn);

  // why not write `fnRef.current = fn`?
  // https://github.com/alibaba/hooks/issues/728
  // 为了解决 React devtools 的问题, 使用 useMemo 包裹起来
  fnRef.current = useMemo(() => fn, [fn]);

  const memoizedFn = useRef<PickFunction<T>>();
  if (!memoizedFn.current) {
    memoizedFn.current = function (this, ...args) {
      return fnRef.current.apply(this, args);
    };
  }

  return memoizedFn.current as T;
}
