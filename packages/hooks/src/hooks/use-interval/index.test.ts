import { renderHook } from '@testing-library/react';
import { useInterval } from './index';
import {useTimeout} from "../use-timeout";

describe('useInterval', () => {
  jest.useFakeTimers();
  jest.spyOn(global, 'clearInterval');

  it('should execute interval', () => {
    const fn = jest.fn();
    renderHook(() => useInterval(fn, 20));
    expect(fn).not.toBeCalled();
    jest.advanceTimersByTime(70);
    expect(fn).toBeCalledTimes(3);
  });

  it('should stop after unmounted', () => {
    const fn = jest.fn();

    const hook = renderHook(() => useInterval(fn, 20));
    jest.advanceTimersByTime(50);
    expect(fn).toBeCalledTimes(2);

    // 执行 clear
    hook.unmount();
    jest.advanceTimersByTime(30);
    expect(fn).toBeCalledTimes(2);
  });

  it('should stop after clear', () => {
    const fn = jest.fn();

    const hook = renderHook(() => useInterval(fn, 20));
    jest.advanceTimersByTime(50);
    expect(fn).toBeCalledTimes(2);

    // 执行 clear
    hook.result.current();
    jest.advanceTimersByTime(30);
    expect(fn).toBeCalledTimes(2);
  });

  it('should stop by invalid delay', async () => {
    const fn = jest.fn();
    renderHook(() => useInterval(fn, -2));
    jest.advanceTimersByTime(30);
    expect(fn).not.toBeCalled();

    renderHook(() => useInterval(fn, undefined));

    jest.advanceTimersByTime(30);
    expect(fn).not.toBeCalled();
  });

  it('should execute when update delay timeout', () => {
    const fn = jest.fn();
    let delay = 20
    const hook = renderHook(() => useInterval(fn, delay));

    delay = 30
    hook.rerender()
    jest.advanceTimersByTime(20);
    expect(fn).not.toBeCalled();
    jest.advanceTimersByTime(40);
    expect(fn).toBeCalledTimes(2)
  });

  it('should execute when change invalid delay to valid delay', () => {
    const fn = jest.fn();
    let delay = -2
    const hook = renderHook(() => useInterval(fn, delay));

    delay = 10
    hook.rerender()
    jest.advanceTimersByTime(10);
    expect(fn).toBeCalledTimes(1)
  })

  it('should stop when change delay to invalid delay', () => {
    const fn = jest.fn();
    let delay = 30
    const hook = renderHook(() => useInterval(fn, delay));
    jest.advanceTimersByTime(20);
    expect(fn).not.toBeCalled();

    delay = -2
    hook.rerender()
    jest.advanceTimersByTime(50)
    expect(fn).not.toBeCalled()
  })
});
