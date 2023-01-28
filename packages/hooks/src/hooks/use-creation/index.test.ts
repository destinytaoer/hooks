import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';
import { useCreation } from './index';

describe('useCreation', () => {
  class Foo {
    constructor() {
      this.data = Math.random();
    }

    data: number;
  }

  const setUp = () =>
    renderHook(() => {
      const [count, setCount] = useState(0);
      const [, setFlag] = useState({});
      const foo = useCreation(() => new Foo(), [count]);
      return {
        foo,
        setCount,
        count,
        setFlag,
      };
    });

  it('should create once when deps are same', () => {
    const hook = setUp();
    const { foo } = hook.result.current;
    act(() => {
      hook.result.current.setFlag({});
    });
    expect(hook.result.current.foo).toBe(foo);
  });

  it('should create new when deps are updated', () => {
    const hook = setUp();
    const { foo } = hook.result.current;
    act(() => {
      hook.result.current.setCount(count => count + 1);
    });
    expect(hook.result.current.foo).not.toBe(foo);
  });
});
