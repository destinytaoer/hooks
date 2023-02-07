import { act, renderHook, waitFor } from '@testing-library/react';
import { useRequest } from '../index';
import { request } from '../../utils/testHelpers';
import { Service } from '../src/typings';

describe('useRequest', () => {
  jest.useFakeTimers();
  jest.spyOn(console, 'error').mockImplementation(() => {});

  const setUp = <TData, TParams extends any[]>(service: Service<TData, TParams>, options) =>
    renderHook((o) => useRequest(service, o || options));
  it('should auto run by default', async () => {
    const successCallback = jest.fn();
    const errorCallback = jest.fn();
    const beforeCallback = jest.fn();
    const finallyCallback = jest.fn();
    const hook = setUp(request, {
      onSuccess: successCallback,
      onError: errorCallback,
      onBefore: beforeCallback,
      onFinally: finallyCallback,
    });

    // 自动执行
    expect(hook.result.current.loading).toBe(true);
    expect(hook.result.current.data).toBe(undefined);
    expect(beforeCallback).toBeCalledTimes(1);

    act(() => {
      jest.runAllTimers();
    });
    // 执行成功
    await waitFor(() => expect(hook.result.current.loading).toEqual(false));
    expect(hook.result.current.data).toBe('success');
    expect(successCallback).toBeCalledTimes(1);
    expect(finallyCallback).toBeCalledTimes(1);
    expect(errorCallback).toBeCalledTimes(0);
  });

  it('defaultParams should work', async () => {
    const hook = setUp(request, {
      defaultParams: [1, 2, 3],
    });
    expect(hook.result.current.loading).toBe(true);

    act(() => {
      jest.runAllTimers();
    });
    expect(hook.result.current.params).toEqual([1, 2, 3]);
    await waitFor(() => expect(hook.result.current.loading).toEqual(false));
    expect(hook.result.current.data).toBe('success');
  });

  it('manual run should work', async () => {
    const successCallback = jest.fn();
    const errorCallback = jest.fn();
    const beforeCallback = jest.fn();
    const finallyCallback = jest.fn();
    const hook = setUp(request, {
      manual: true,
      onSuccess: successCallback,
      onError: errorCallback,
      onBefore: beforeCallback,
      onFinally: finallyCallback,
    });
    expect(hook.result.current.loading).toBe(false);

    //manual run success
    act(() => {
      hook.result.current.run(1);
    });
    expect(hook.result.current.loading).toBe(true);
    expect(beforeCallback).toBeCalledTimes(1);

    act(() => {
      jest.runAllTimers();
    });
    await waitFor(() => expect(hook.result.current.loading).toBe(false));
    expect(hook.result.current.data).toBe('success');
    expect(hook.result.current.error).toBe(undefined);
    expect(errorCallback).toBeCalledTimes(0);
    expect(successCallback).toBeCalledTimes(1);
  });

  it('data should not change after fail', async () => {
    const hook = setUp(request, {
      manual: true,
    });
    expect(hook.result.current.loading).toBe(false);

    //manual run success
    act(() => {
      hook.result.current.run(1);
      jest.runAllTimers();
    });
    await waitFor(() => expect(hook.result.current.loading).toBe(false));
    expect(hook.result.current.data).toBe('success');

    // manual run fail
    act(() => {
      hook.result.current.run(0);
      jest.runAllTimers();
    });
    await waitFor(() => expect(hook.result.current.loading).toBe(false));
    expect(hook.result.current.error).toEqual(new Error('fail'));
    // 失败后, data 不变
    expect(hook.result.current.data).toBe('success');
  });

  it('runAsync should work', async () => {
    let success = '',
      error = '';

    const hook = setUp(request, {
      manual: true,
    });
    act(() => {
      hook.result.current
        .runAsync(0)
        .then((res) => {
          success = res;
        })
        .catch((err) => {
          error = err;
        });
    });

    act(() => {
      jest.runAllTimers();
    });
    await waitFor(() => expect(hook.result.current.loading).toBe(false));
    expect(error).toEqual(new Error('fail'));
    expect(success).toBe('');

    success = '';
    error = '';
    act(() => {
      hook.result.current
        .runAsync(1)
        .then((res) => {
          success = res;
        })
        .catch((err) => {
          error = err;
        });
    });

    act(() => {
      jest.runAllTimers();
    });
    await waitFor(() => expect(hook.result.current.loading).toBe(false));
    expect(success).toBe('success');
    expect(error).toEqual('');
  });

  it('refresh should work', async () => {
    const defaultParams = [1, 2, 3];
    const hook = setUp(request, {
      defaultParams,
    });

    act(() => {
      jest.runAllTimers();
    });
    await waitFor(() => expect(hook.result.current.loading).toEqual(false));

    act(() => {
      hook.result.current.refresh();
    });
    expect(hook.result.current.loading).toBe(true);
    expect(hook.result.current.params).toEqual(defaultParams);
  });

  it('refreshAsync should work', async () => {
    let success = '',
      error = '';
    const defaultParams = [0];
    const hook = setUp(request, {
      defaultParams,
    });

    act(() => {
      jest.runAllTimers();
    });
    await waitFor(() => expect(hook.result.current.loading).toEqual(false));
    expect(hook.result.current.error).toEqual(new Error('fail'));

    act(() => {
      hook.result.current
        .refreshAsync()
        .then((res) => {
          success = res;
        })
        .catch((err) => {
          error = err;
        });
    });
    expect(hook.result.current.loading).toBe(true);
    expect(hook.result.current.params).toEqual(defaultParams);

    act(() => {
      jest.runAllTimers();
    });
    await waitFor(() => expect(hook.result.current.loading).toEqual(false));
    expect(hook.result.current.error).toEqual(new Error('fail'));
  });

  it('mutate should work', () => {
    const hook = setUp(request, {
      manual: true,
    });
    expect(hook.result.current.data).toBe(undefined);

    act(() => {
      hook.result.current.mutate('mutate');
    });
    expect(hook.result.current.data).toBe('mutate');
  });

  it('should fixed race condition', async () => {
    const successCallback = jest.fn();
    const errorCallback = jest.fn();
    const beforeCallback = jest.fn();
    const finallyCallback = jest.fn();
    const hook = setUp(request, {
      manual: true,
      onSuccess: successCallback,
      onError: errorCallback,
      onBefore: beforeCallback,
      onFinally: finallyCallback,
    });

    act(() => {
      hook.result.current.run(1);
    });
    expect(hook.result.current.loading).toBe(true);
    expect(beforeCallback).toBeCalledTimes(1);

    act(() => {
      hook.result.current.run(0);
      jest.runAllTimers();
    });
    await waitFor(() => expect(hook.result.current.loading).toBe(false));
    expect(hook.result.current.data).toBe(undefined);
    expect(hook.result.current.error).toEqual(new Error('fail'));
    expect(errorCallback).toBeCalledTimes(1);
    expect(successCallback).toBeCalledTimes(0);
    expect(finallyCallback).toBeCalledTimes(1);
  });
});
