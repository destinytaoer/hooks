import { renderHook } from '@testing-library/react';
import { useTimeout } from './index';

describe('useTimeout', () => {
  jest.useFakeTimers();
  jest.spyOn(global, 'clearTimeout');

  it('should execute when timeout', async () => {
    const fn = jest.fn();
    renderHook(() => useTimeout(fn, 20));
    expect(fn).not.toBeCalled();
    jest.advanceTimersByTime(70);
    expect(fn).toBeCalledTimes(1);
  });

  it('should stop after clear', async () => {
    const fn = jest.fn();
    const hook = renderHook(() => useTimeout(fn, 20));
    expect(fn).not.toBeCalled();

    // 执行 clear
    hook.result.current();
    jest.advanceTimersByTime(30);
    expect(fn).not.toBeCalled();
  });

  it('should stop by invalid delay', async () => {
    const fn = jest.fn();
    renderHook(() => useTimeout(fn, -2));
    jest.advanceTimersByTime(30);
    expect(fn).not.toBeCalled();

    renderHook(() => useTimeout(fn, undefined));

    jest.advanceTimersByTime(30);
    expect(fn).not.toBeCalled();
  });

  it('should execute when update delay timeout', () => {
    const fn = jest.fn();
    let delay = 20
    const hook = renderHook(() => useTimeout(fn, delay));

    delay = 30
    hook.rerender()
    jest.advanceTimersByTime(20);
    expect(fn).not.toBeCalled();
    jest.advanceTimersByTime(10);
    expect(fn).toBeCalledTimes(1)
  })

  it('should execute when change invalid delay to valid delay', () => {
    const fn = jest.fn();
    let delay = -2
    const hook = renderHook(() => useTimeout(fn, delay));

    delay = 10
    hook.rerender()
    jest.advanceTimersByTime(10);
    expect(fn).toBeCalledTimes(1)
  })

  it('should stop when change delay to invalid delay', () => {
    const fn = jest.fn();
    let delay = 30
    const hook = renderHook(() => useTimeout(fn, delay));
    jest.advanceTimersByTime(20);
    expect(fn).not.toBeCalled();

    delay = -2
    hook.rerender()
    jest.advanceTimersByTime(50)
    expect(fn).not.toBeCalled()
  })
});
