import { useState } from 'react';
import { Service, Options, FetchState } from './typings';
import useMemoizedFn from '../../use-memoized-fn';
import { useMount } from '../../use-mount';
import { isFunction } from '../../utils';

export const useRequest = <TData, TParams extends any[]>(
  service: Service<TData, TParams>,
  options?: Options<TData, TParams>
) => {
  const {
    manual = false,
    defaultParams = [],
    onBefore,
    onError,
    onFinally,
    onSuccess,
  } = options ?? {};
  const [fetchState, setFetchState] = useState<FetchState<TData, TParams>>({
    loading: false,
  });

  const runAsync = async (...params: TParams) => {
    setFetchState((oldState) => ({
      ...oldState,
      params,
      loading: true,
    }));
    onBefore?.(params);

    try {
      const data = await service(...params);
      setFetchState((oldState) => ({
        ...oldState,
        loading: false,
        data,
        error: undefined,
      }));
      onSuccess?.(data, params);
      onFinally?.(params, data);

      return data;
    } catch (e: any) {
      setFetchState((oldState) => ({
        ...oldState,
        loading: false,
        error: e,
      }));
      onError?.(e, params);
      onFinally?.(params, undefined, e);

      // 外部自行处理错误
      throw e;
    }
  };

  const run = (...params: TParams) => {
    runAsync(...params).catch((e) => {
      if (!onError) {
        console.error(e);
      }
    });
  };

  const refresh = () => {
    run(...((fetchState.params || []) as TParams));
  };

  const refreshAsync = () => {
    return runAsync(...((fetchState.params || []) as TParams));
  };

  const mutate = (data?: TData | ((oldData?: TData) => TData | undefined)) => {
    setFetchState((oldState) => {
      const targetData = isFunction(data) ? data(oldState.data) : data;
      return {
        ...oldState,
        data: targetData,
      };
    });
  };

  useMount(() => {
    if (!manual) {
      run(...(defaultParams as TParams));
    }
  });

  return {
    ...fetchState,
    run: useMemoizedFn(run),
    runAsync: useMemoizedFn(runAsync),
    refresh: useMemoizedFn(refresh),
    refreshAsync: useMemoizedFn(refreshAsync),
    mutate: useMemoizedFn(mutate),
  };
};
