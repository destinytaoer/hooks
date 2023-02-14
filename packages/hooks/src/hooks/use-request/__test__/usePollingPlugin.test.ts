import { act, renderHook, waitFor } from '@testing-library/react';
import { useRequest } from '../index';
import { request } from '../../utils/testHelpers';

describe('usePollingPlugin', () => {
  jest.useFakeTimers();

  const setUp = (service, options) => renderHook((o) => useRequest(service, o || options));

  let hook;
  it('usePollingPlugin pollingInterval=100 should work', async () => {
    const callback = jest.fn();
    act(() => {
      hook = setUp(
        () => {
          callback();
          return request(1);
        },
        {
          pollingInterval: 100,
          pollingWhenHidden: true,
        }
      );
    });
    expect(hook.result.current.loading).toBe(true);
    // 初始执行一次
    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      jest.runAllTimers();
    });
    await waitFor(() => expect(hook.result.current.loading).toBe(false));
    expect(hook.result.current.data).toEqual('success');
    expect(callback).toHaveBeenCalledTimes(1);

    // 第一次结果返回后, 定时的 polling 执行
    act(() => {
      jest.runAllTimers();
    });
    await waitFor(() => expect(hook.result.current.loading).toBe(false));
    expect(callback).toHaveBeenCalledTimes(2);

    act(() => {
      jest.runAllTimers();
    });
    await waitFor(() => expect(hook.result.current.loading).toBe(false));
    expect(callback).toHaveBeenCalledTimes(3);

    // 取消之后, polling 不再执行
    act(() => {
      hook.result.current.cancel();
      jest.runAllTimers();
    });

    await waitFor(() => expect(hook.result.current.loading).toBe(false));
    expect(callback).toHaveBeenCalledTimes(3);

    // 重新 run, polling 重新启动
    act(() => {
      hook.result.current.run();
    });
    expect(callback).toHaveBeenCalledTimes(4);

    act(() => {
      jest.runAllTimers();
    });
    await waitFor(() => expect(hook.result.current.loading).toBe(false));
    expect(callback).toHaveBeenCalledTimes(4);

    act(() => {
      jest.runAllTimers();
    });
    await waitFor(() => expect(hook.result.current.loading).toBe(false));
    expect(callback).toHaveBeenCalledTimes(5);
    hook.unmount();
  });
});
