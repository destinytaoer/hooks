import { renderHook } from '@testing-library/react';
import { useDebounceFn } from './index';

describe('useDebounceFn', () => {
  jest.useFakeTimers();
  const setUp = (fn) => renderHook(() => useDebounceFn(fn, 20));

  it('should debounce work', () => {
    const fn = jest.fn();
    const hook = setUp(fn);

    hook.result.current();
    expect(fn).toBeCalledTimes(0);
    jest.advanceTimersByTime(20);
    expect(fn).toBeCalledTimes(1);
    hook.result.current();
    hook.result.current();
    hook.result.current();
    jest.advanceTimersByTime(50);
    expect(fn).toBeCalledTimes(2);
  });

  it('should debounce default wait', () => {
    const fn = jest.fn();
    const hook = renderHook(() => useDebounceFn(fn))

    hook.result.current();
    expect(fn).toBeCalledTimes(0);
    jest.advanceTimersByTime(500);
    expect(fn).toBeCalledTimes(0);
    jest.advanceTimersByTime(500);
    expect(fn).toBeCalledTimes(1);
  });

  it('should debounce cancel work', () => {
    const fn = jest.fn();
    const hook = setUp(fn);

    hook.result.current();
    expect(fn).toBeCalledTimes(0);
    // 取消当前延迟函数的调用, fn 将不会在延迟之后执行
    hook.result.current.cancel();
    jest.advanceTimersByTime(20);
    expect(fn).toBeCalledTimes(0);
  });

  it('should debounce flush work', () => {
    const fn = jest.fn();
    const hook = setUp(fn);

    hook.result.current();
    expect(fn).toBeCalledTimes(0);
    // 立即执行当前延迟的 fn
    hook.result.current.flush();
    expect(fn).toBeCalledTimes(1);
  });

  it('should stop after unmounted', () => {
    const fn = jest.fn();
    const hook = setUp(fn);

    hook.result.current();
    hook.result.current();
    expect(fn).toBeCalledTimes(0);
    hook.unmount();
    jest.advanceTimersByTime(20);
    expect(fn).toBeCalledTimes(0);
  });
  // options 是 lodash 的功能, 不进行单独测试
});
