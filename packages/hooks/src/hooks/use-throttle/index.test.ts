import { act, renderHook } from '@testing-library/react';
import { useThrottle } from './index';

describe('useThrottle', () => {
  jest.useFakeTimers();

  it('should throttle work', () => {
    let count = 0;
    const hook = renderHook(() => useThrottle(count, 20));
    // 初始化先调用了 throttle, 先等待 20ms 后, 这次的 throttle 结束后再进行测试
    jest.advanceTimersByTime(20);

    // 调用后会直接执行一遍
    count = 1;
    hook.rerender();
    expect(hook.result.current).toEqual(1);
    jest.advanceTimersByTime(20);

    // 调用三次后, 最后一次是在 20 ms 后执行
    count = 2;
    hook.rerender();
    count = 3;
    hook.rerender();
    count = 4;
    hook.rerender();
    expect(hook.result.current).toEqual(2);
    act(() => {
      jest.advanceTimersByTime(20);
    });
    expect(hook.result.current).toEqual(4);
  });
});
