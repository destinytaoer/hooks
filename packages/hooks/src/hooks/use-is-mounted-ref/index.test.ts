import { renderHook } from '@testing-library/react';
import { useIsMountedRef } from './index';

describe('useIsMountedRef', () => {
  it('should be true when mounted', async () => {
    const hook = renderHook(() => useIsMountedRef());
    expect(hook.result.current.current).toBe(true);
  });
  it('should be true when rerender', async () => {
    const hook = renderHook(() => useIsMountedRef());
    expect(hook.result.current.current).toBe(true);
    hook.rerender();
    expect(hook.result.current.current).toBe(true);
  });
  it('should be false when unmounted', async () => {
    const hook = renderHook(() => useIsMountedRef());
    expect(hook.result.current.current).toBe(true);
    hook.unmount();
    expect(hook.result.current.current).toBe(false);
  });
});
