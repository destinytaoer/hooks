import { useCallback, useRef, useState } from 'react';
import { act, renderHook } from '@testing-library/react';
import { useLockFn } from './index';

describe('useLockFn', () => {
  jest.useFakeTimers();
  const setUp = (): any =>
    renderHook(() => {
      const [tag, updateTag] = useState(false);
      const countRef = useRef(0);
      const persistFn = useCallback(
        (count: number) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              countRef.current = count;
            }, 50);
          });
        },
        [tag]
      );
      const locked = useLockFn(persistFn);

      return {
        locked,
        countRef,
        updateTag: () => updateTag(true),
      };
    });

  it('should locked', async () => {
    const hook = setUp();
    const { locked, countRef } = hook.result.current;
    locked(1);
    expect(countRef.current).toBe(0);
    locked(2);
    expect(countRef.current).toBe(0);
    jest.advanceTimersByTime(30);
    locked(3);
    expect(countRef.current).toBe(0);
    jest.advanceTimersByTime(20);
    // 定时结束, 得到第一个结果
    expect(countRef.current).toBe(1);
  });

  it('should same', () => {
    const hook = setUp();
    const preLocked = hook.result.current.locked;
    hook.rerender();
    expect(hook.result.current.locked).toEqual(preLocked);
    act(hook.result.current.updateTag);
    expect(hook.result.current.locked).not.toEqual(preLocked);
  });
});
