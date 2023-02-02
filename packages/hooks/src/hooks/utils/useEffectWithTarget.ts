import { DependencyList, EffectCallback, useEffect, useRef } from 'react';
import { BasicTarget, getTargetElement } from './domTarget';
import { useUnmount } from '../use-unmount';
import depsAreSame from "./depsAreSame";

// 将 target 元素纳入 deps 中, 实现动态 target
export const useEffectWithTarget = (
  effect: EffectCallback,
  deps: DependencyList,
  target: BasicTarget<any> | BasicTarget<any>[]
) => {
  const isInitRef = useRef(false);
  const clearEffectRef = useRef<any>();
  const lastElementRef = useRef<(Element | null)[]>([]);
  const lastDepsRef = useRef<DependencyList>([]);

  useEffect(() => {
    const targets = Array.isArray(target) ? target : [target];
    const els = targets.map((item) => getTargetElement(item));

    if (!isInitRef.current) {
      isInitRef.current = true;
      lastElementRef.current = els;
      lastDepsRef.current = deps;

      clearEffectRef.current = effect();
      return;
    }

    if (els.length !== lastElementRef.current.length || depsAreSame(els, lastElementRef.current) || depsAreSame(deps, lastDepsRef.current)) {
      clearEffectRef.current?.();

      lastElementRef.current = els;
      lastDepsRef.current = deps;
      clearEffectRef.current = effect();
    }
  });

  useUnmount(() => {
    clearEffectRef.current?.();
    isInitRef.current = false;
  });
};
