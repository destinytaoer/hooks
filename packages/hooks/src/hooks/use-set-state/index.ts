import {useCallback, useState} from 'react';

export type SetState<T extends Record<string, any>> = <K extends keyof T>(
    state: Pick<T, K> | null | ((prevState: Readonly<T>) => Pick<T, K> | T | null),
) => void;

export const useSetState = <T extends Record<string, any>>(
  initialState: T | (() => T)
): [T, SetState<T>] => {
  // initialState 支持 惰性初始化, 可以是 obj ,也可以是初始化函数
  const [state, setState] = useState(initialState);

  // setMergeState 支持传入修改的值或由旧值构建新值的函数
  const setMergeState: SetState<T> = useCallback((patch) => {
    setState((oldState) => {
      const newState = typeof patch === 'function' ? patch(oldState) : patch;
      return {
        ...oldState,
        ...newState,
      };
    });
  }, []);

  return [state, setMergeState];
};
;
