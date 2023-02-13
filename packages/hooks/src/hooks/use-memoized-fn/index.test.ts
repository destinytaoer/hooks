import { act, renderHook } from '@testing-library/react';
import { useState } from 'react';
import { useMemoizedFn } from './index';

describe('useMemoizedFn', () => {
  const useCount = () => {
    const [count, setCount] = useState(0);

    const addCount = () => {
      setCount((c) => c + 1);
    };

    const memoizedFn = useMemoizedFn(() => count);

    return { addCount, memoizedFn };
  };

  it('useMemoizedFn should work', () => {
    const hook = renderHook(() => useCount());
    const currentFn = hook.result.current.memoizedFn;
    expect(hook.result.current.memoizedFn()).toEqual(0);

    act(() => {
      hook.result.current.addCount();
    });

    expect(currentFn).toEqual(hook.result.current.memoizedFn);
    expect(hook.result.current.memoizedFn()).toEqual(1);
  });
});
