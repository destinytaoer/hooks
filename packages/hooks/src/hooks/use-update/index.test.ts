import { renderHook } from '@testing-library/react';
import { useUpdate } from './index';

describe('useUpdate', () => {
  it('test on mounted', async () => {
    let mountedState = 1;
    const hook = renderHook(() =>
      useUpdate(() => {
        mountedState = 2;
      })
    );
    expect(mountedState).toEqual(1);
    hook.rerender();
    expect(mountedState).toEqual(2);
  });
  it('test on optional', () => {
    let mountedState = 1;
    const hook = renderHook(() =>
      useUpdate(() => {
        mountedState = 3;
      }, [mountedState])
    );
    expect(mountedState).toEqual(1);
    hook.rerender();
    expect(mountedState).toEqual(1);
    mountedState = 2;
    hook.rerender();
    expect(mountedState).toEqual(3);
  });
  it('test on unmounted', () => {
    let mountedState = 1;
    const fn = jest.fn();
    const hook = renderHook(() =>
      useUpdate(() => {
        mountedState = 3;
        return fn;
      })
    );
    // 第一次渲染, useUpdate 不执行
    expect(mountedState).toEqual(1);
    expect(fn).toBeCalledTimes(0);
    // 第二次渲染, useUpdate 首次执行, 还没有预存的清除副作用函数, 不会执行 fn
    hook.rerender();
    expect(mountedState).toEqual(3);
    expect(fn).toBeCalledTimes(0);
    // 第三次渲染, useUpdate 二次执行, 前面执行过已经有清除副作用的函数, 会执行 fn
    hook.rerender();
    expect(mountedState).toEqual(3);
    expect(fn).toBeCalledTimes(1);
  });
});
