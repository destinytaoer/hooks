import { MutableRefObject } from 'react';
import { FetchState, Options, Service, Subscribe } from './typings';
import { isFunction } from '../../utils';

export default class Fetch<TData, TParams extends any[]> {
  // 竞态条件控制
  count = 0;

  // 请求状态
  state: FetchState<TData, TParams> = {
    loading: false,
    params: undefined,
    data: undefined,
    error: undefined,
  };

  constructor(
    public serviceRef: MutableRefObject<Service<TData, TParams>>,
    public options: Options<TData, TParams>,
    public subscribe: Subscribe
  ) {
    this.state = {
      ...this.state,
      loading: !options.manual,
    };
  }

  setState(s: Partial<FetchState<TData, TParams>> = {}) {
    this.state = {
      ...this.state,
      ...s,
    };
    // 外部传入的 force update 方法
    this.subscribe();
  }

  async runAsync(...params: TParams): Promise<TData> {
    this.count++;
    const currentCount = this.count;

    this.setState({
      params,
      loading: true,
    });

    this.options.onBefore?.(params);

    try {
      const data = await this.serviceRef.current(...params);

      // 如果当前请求已经取消或者已经发起新的请求, 那么当前请求结果将不做处理
      if (currentCount !== this.count) {
        return new Promise(() => {});
      }

      this.setState({
        loading: false,
        data,
        error: undefined,
      });
      this.options.onSuccess?.(data, params);
      this.options.onFinally?.(params, data);

      return data;
    } catch (e: any) {
      // 如果当前请求已经取消或者已经发起新的请求, 那么当前请求结果将不做处理
      if (currentCount !== this.count) {
        return new Promise(() => {});
      }

      this.setState({
        loading: false,
        error: e,
      });
      this.options.onError?.(e, params);
      this.options.onFinally?.(params, undefined, e);

      // 外部自行处理错误
      throw e;
    }
  }

  run(...params: TParams) {
    this.runAsync(...params).catch((e) => {
      if (!this.options.onError) {
        console.error(e);
      }
    });
  }

  refresh() {
    this.run(...((this.state.params || []) as TParams));
  }

  refreshAsync() {
    return this.runAsync(...((this.state.params || []) as TParams));
  }

  mutate(data?: TData | ((oldData?: TData) => TData | undefined)) {
    const targetData = isFunction(data) ? data(this.state.data) : data;
    this.setState({
      data: targetData,
    });
  }

  cancel = () => {
    this.count++;

    this.setState({
      loading: false,
    });
  };
}
