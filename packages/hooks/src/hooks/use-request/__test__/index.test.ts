import { act, renderHook, waitFor } from '@testing-library/react';
import { useRequest } from '../index';
import { request } from '../../utils/testHelpers';

describe('useRequest', () => {
  jest.useFakeTimers();

  const setUp = (service, options) => renderHook((o) => useRequest(service, o || options));
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
      jest.runOnlyPendingTimers();
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
      jest.runOnlyPendingTimers();
    });
    await waitFor(() => expect(hook.result.current.loading).toBe(false));
    expect(hook.result.current.data).toBe('success');
    expect(hook.result.current.error).toBe(undefined);
    expect(errorCallback).toBeCalledTimes(0);
    expect(successCallback).toBeCalledTimes(1);
  });

  it("data should not change after fail", async () => {
    const hook = setUp(request, {
      manual: true,
    });
    expect(hook.result.current.loading).toBe(false);

    //manual run success
    act(() => {
      hook.result.current.run(1);
      jest.runOnlyPendingTimers();
    });
    await waitFor(() => expect(hook.result.current.loading).toBe(false));
    expect(hook.result.current.data).toBe('success');

    // manual run fail
    act(() => {
      hook.result.current.run(0);
      jest.runOnlyPendingTimers();
    });
    await waitFor(() => expect(hook.result.current.loading).toBe(false));
    expect(hook.result.current.error).toEqual(new Error('fail'));
    // 失败后, data 不变
    expect(hook.result.current.data).toBe('success');
  })
});
