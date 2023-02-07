import { useEffect, useState } from 'react';
import { Service, Options, FetchState } from './typings';
import useMemoizedFn from '../../use-memoized-fn';

export const useRequest = <TData, TParams extends any[]>(
  service: Service<TData, TParams>,
  options?: Options<TData, TParams>
) => {
  const { manual = false, defaultParams = [], onBefore, onError, onFinally, onSuccess } = options ?? {};
  const [fetchState, setFetchState] = useState<FetchState<TData, TParams>>({
    loading: false,
  });

  const run = (...params: TParams) => {
    setFetchState((oldState) => ({
      ...oldState,
      params,
      loading: true,
    }));
    onBefore?.(params)

    service(...params)
      .then((res) => {
        setFetchState((oldState) => ({
          ...oldState,
          loading: false,
          data: res,
          error: undefined,
        }));
        onSuccess?.(res, params)
        onFinally?.(params, res)
      })
      .catch((e) => {
        setFetchState((oldState) => ({
          ...oldState,
          loading: false,
          error: e,
        }));
        onError?.(e, params)
        onFinally?.(params, undefined, e)
      });
  };

  useEffect(() => {
    if (!manual) {
      run(...defaultParams as TParams);
    }
  }, [manual]);

  return {
    ...fetchState,
    run: useMemoizedFn(run),
  };
};
