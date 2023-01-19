import { useCallback, useReducer, useState } from 'react';

export const useForceUpdate = () => {
  // 每次赋值一个新的引用对象即可重新 render
  const [, setState] = useState({});

  // 其他做法
  // const [, forUpdate] = useReducer((v) => v + 1, 0);
  // return forUpdate

  return useCallback(() => setState({}), []);
};
