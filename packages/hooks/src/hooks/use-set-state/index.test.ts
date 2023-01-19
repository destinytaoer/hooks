import { act, renderHook } from '@testing-library/react';
import { useSetState } from './index';

describe('useSetState', () => {
  it('should support initial value', () => {
    const obj = { a: 1, b: 'string' };
    const hook = renderHook(() => {
      const [state, setState] = useSetState(obj);
      return { state, setState };
    });
    expect(hook.result.current.state).toEqual({ a: 1, b: 'string' });
  });
  it('should support lazy initial value', () => {
    const hook = renderHook(() => {
      const [state, setState] = useSetState(() => ({ a: 1, b: 'string' }));
      return { state, setState };
    });
    expect(hook.result.current.state).toEqual({ a: 1, b: 'string' });
  });
  it('should support update partial object', () => {
    const obj = { a: 1, b: 'string' };
    const hook = renderHook(() => {
      const [state, setState] = useSetState(obj);
      return { state, setState };
    });
    expect(hook.result.current.state).toEqual({ a: 1, b: 'string' });
    act(() => {
      hook.result.current.setState({ a: 2 });
    });
    expect(hook.result.current.state).toEqual({ a: 2, b: 'string' });
  });
  it('should support update by function', () => {
    const obj = { a: 1, b: 'string' };
    const hook = renderHook(() => {
      const [state, setState] = useSetState(obj);
      return { state, setState };
    });
    expect(hook.result.current.state).toEqual({ a: 1, b: 'string' });
    act(() => {
      hook.result.current.setState(() => ({ a: 2 }));
    });
    expect(hook.result.current.state).toEqual({ a: 2, b: 'string' });
  });
});
