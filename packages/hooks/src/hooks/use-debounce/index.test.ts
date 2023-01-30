import { act, renderHook } from '@testing-library/react';
import { useDebounce } from './index';

describe('useDebounce', () => {
  jest.useFakeTimers();
  it('should debounce work', () => {
    let count = 0;
    const hook = renderHook(() => useDebounce(count, 20));
    count = 1;
    hook.rerender();
    expect(hook.result.current).toEqual(0);

    // 20ms 后会有一次 setState, 必须包含在 act 中
    act(() => {
      jest.advanceTimersByTime(20);
    });
    expect(hook.result.current).toEqual(1);

    count = 2;
    hook.rerender();
    expect(hook.result.current).toEqual(1);

    count = 3;
    hook.rerender();
    expect(hook.result.current).toEqual(1);

    jest.advanceTimersByTime(10);
    expect(hook.result.current).toEqual(1);

    act(() => {
      jest.advanceTimersByTime(10);
    });
    expect(hook.result.current).toEqual(3);
  });
});
