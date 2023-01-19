import { act, renderHook } from '@testing-library/react';
import { useForceUpdate } from './index';

describe('useForceUpdate', () => {
  it('should update', () => {
    let count = 0;
    const hooks = renderHook(() => {
      const update = useForceUpdate();
      return {
        update,
        count,
      };
    });
    expect(hooks.result.current.count).toEqual(0);

    // 外面的 count 增加后, 需要重新渲染才能让内部的 count 增加
    count++;
    expect(hooks.result.current.count).toEqual(0);

    // 执行 update 后, 重新渲染, 此时的值为 1
    act(hooks.result.current.update);
    expect(hooks.result.current.count).toEqual(1);
  });
  it('should return same update function', () => {
    const hooks = renderHook(() => useForceUpdate());
    const preUpdate = hooks.result.current;
    hooks.rerender();
    expect(hooks.result.current).toEqual(preUpdate);
  });
});
