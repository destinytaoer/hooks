import { renderHook } from '@testing-library/react';
import { useLatest } from './index';

describe('useLatestRef', () => {
  it('test normal value', () => {
    let a = 1;
    const hook = renderHook(() => {
      const getLatestValue = useLatest(a);
      return { getLatestValue };
    });
    expect(hook.result.current.getLatestValue()).toBe(1);
    a = 2;
    expect(hook.result.current.getLatestValue()).toBe(1);
    hook.rerender();
    expect(hook.result.current.getLatestValue()).toBe(2);
    hook.rerender();
    expect(hook.result.current.getLatestValue()).toBe(2);
  });
  it('test function', () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    let fn = fn1;
    const hook = renderHook(() => {
      const getLatestValue = useLatest(fn);
      return { getLatestValue };
    });
    expect(hook.result.current.getLatestValue()).toBe(fn1);
    fn = fn2;
    expect(hook.result.current.getLatestValue()).toBe(fn1);
    hook.rerender();
    expect(hook.result.current.getLatestValue()).toBe(fn2);
  });
});
