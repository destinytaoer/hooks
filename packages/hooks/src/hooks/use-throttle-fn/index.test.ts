import { renderHook } from '@testing-library/react';
import { useThrottleFn } from './index';

describe('useDebounceFn', () => {
  jest.useFakeTimers();
  const setUp = (fn) => renderHook(() => useThrottleFn(fn, 20));

  it('should throttle work', () => {
    const fn = jest.fn();
    const hook = setUp(fn);

    // 一次调用将直接执行
    hook.result.current();
    expect(fn).toBeCalledTimes(1);
    jest.advanceTimersByTime(20);
    expect(fn).toBeCalledTimes(1);

    // 多次调用, 默认最后一次调用会等超时后调用
    hook.result.current();
    hook.result.current();
    hook.result.current();
    expect(fn).toBeCalledTimes(2);
    jest.advanceTimersByTime(20);
    expect(fn).toBeCalledTimes(3);
    jest.advanceTimersByTime(20);
    expect(fn).toBeCalledTimes(3);
  });

  it('should throttle default wait', () => {
    const fn = jest.fn();
    const hook = renderHook(() => useThrottleFn(fn));

    hook.result.current();
    hook.result.current();
    expect(fn).toBeCalledTimes(1);
    jest.advanceTimersByTime(500);
    expect(fn).toBeCalledTimes(1);
    jest.advanceTimersByTime(500);
    expect(fn).toBeCalledTimes(2);
  });

  it('should throttle cancel work', () => {
    const fn = jest.fn();
    const hook = setUp(fn);

    hook.result.current();
    hook.result.current();
    expect(fn).toBeCalledTimes(1);
    // 取消当前延迟函数的调用, fn 将不会在延迟之后执行
    hook.result.current.cancel();
    jest.advanceTimersByTime(20);
    expect(fn).toBeCalledTimes(1);
  });

  it('should throttle flush work', () => {
    const fn = jest.fn();
    const hook = setUp(fn);

    hook.result.current();
    hook.result.current();
    expect(fn).toBeCalledTimes(1);

    // 立即执行当前延迟的 fn
    hook.result.current.flush();
    expect(fn).toBeCalledTimes(2);
  });

  it('should stop after unmounted', () => {
    const fn = jest.fn();
    const hook = setUp(fn);

    hook.result.current();
    hook.result.current();
    expect(fn).toBeCalledTimes(1);
    hook.unmount();
    jest.advanceTimersByTime(20);
    expect(fn).toBeCalledTimes(1);
  });
  // options 是 lodash 的功能, 不进行单独测试
});
