import { useRef, useState } from 'react';
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

  const countRef = useRef(0);
  const [fetchState, setFetchState] = useState<FetchState<TData, TParams>>({
    loading: false,
  });

  const runAsync = async (...params: TParams): Promise<TData> => {
    countRef.current++;
    const currentCount = countRef.current;

    setFetchState((oldState) => ({
      ...oldState,
      params,
      loading: true,
    }));
    onBefore?.(params);

    try {
      const data = await service(...params);

      // 如果当前请求已经取消或者已经发起新的请求, 那么当前请求结果将不做处理
      if (currentCount !== countRef.current) {
        return new Promise(() => {});
      }

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
      // 如果当前请求已经取消或者已经发起新的请求, 那么当前请求结果将不做处理
      if (currentCount !== countRef.current) {
        return new Promise(() => {});
      }

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

  const cancel = () => {
    countRef.current++;

    setFetchState((oldState) => ({
      ...oldState,
      loading: false,
    }));
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
    cancel: useMemoizedFn(cancel),
  };
};
