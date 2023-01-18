import { renderHook } from '@testing-library/react';
import { useIsMountedRef } from './index';

describe("useIsMountedRef", () => {
    it('test mount', async () =>{
        const hook = renderHook(() => useIsMountedRef())
        expect(hook.result.current.current).toBe(true)
        hook.rerender()
        expect(hook.result.current.current).toBe(true)
        hook.unmount()
        expect(hook.result.current.current).toBe(false)
    })
})
