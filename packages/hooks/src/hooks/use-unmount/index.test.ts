import { renderHook } from '@testing-library/react';
import { useUnmount } from './index';

describe('useUnmount', () => {
  it('test unmount', () => {
    const fn = jest.fn();
    const hook = renderHook(() => useUnmount(fn));
    expect(fn).toBeCalledTimes(0);

    hook.rerender();
    expect(fn).toBeCalledTimes(0);

    hook.unmount();
    expect(fn).toBeCalledTimes(1);
  });
});
