import { useLatestRef } from '../../use-latest-ref';
import { useForceUpdate } from '../../use-force-update';
import { useCreation } from '../../use-creation';
import { useMount } from '../../use-mount';
import { useUnmount } from '../../use-unmount';
import { useMemoizedFn } from '../../use-memoized-fn';
import Fetch from './Fetch';
import { Service, Options, Result, Plugin } from './typings';

export const useRequest = <TData, TParams extends any[]>(
  service: Service<TData, TParams>,
  options: Options<TData, TParams> = {},
  plugins: Plugin<TData, TParams>[] = []
) => {
  const { manual = false, ...rest } = options;
  const fetchOptions = { manual, ...rest };

  const serviceRef = useLatestRef(service);

  const forceUpdate = useForceUpdate();

  const fetchInstance = useCreation(() => {
    return new Fetch<TData, TParams>(serviceRef, fetchOptions, forceUpdate);
  }, []);
  // 保持 options 是最新的
  fetchInstance.options = fetchOptions;

  // run all plugins hooks
  fetchInstance.pluginImpls = plugins.map((p) => p(fetchInstance, fetchOptions));

  useMount(() => {
    if (!manual) {
      const params = fetchInstance.state.params || options.defaultParams || [];
      fetchInstance.run(...(params as TParams));
    }
  });

  // 卸载后, 取消当前请求
  // 防止组件卸载后仍然更新 state 的报错
  useUnmount(() => {
    fetchInstance.cancel();
  });

  return {
    loading: fetchInstance.state.loading,
    data: fetchInstance.state.data,
    error: fetchInstance.state.error,
    params: fetchInstance.state.params || [],
    run: useMemoizedFn(fetchInstance.run.bind(fetchInstance)),
    runAsync: useMemoizedFn(fetchInstance.runAsync.bind(fetchInstance)),
    refresh: useMemoizedFn(fetchInstance.refresh.bind(fetchInstance)),
    refreshAsync: useMemoizedFn(fetchInstance.refreshAsync.bind(fetchInstance)),
    mutate: useMemoizedFn(fetchInstance.mutate.bind(fetchInstance)),
    cancel: useMemoizedFn(fetchInstance.cancel.bind(fetchInstance)),
  } as Result<TData, TParams>;
};
