import { useEffect, useRef } from 'react';
import type { Plugin } from '../typings';
import { Timeout } from '../typings';

// 支持 loadingDelay option
export const useLoadingDelayPlugin: Plugin<any, any[]> = (
  fetchInstance,
  { loadingDelay, ready = true }
) => {
  const timerRef = useRef<Timeout>();
  if (!loadingDelay) {
    return {};
  }

  const cancelTimeout = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };
  return {
    // 请求开始前, 定时将 loading 置为 true
    // 如果请求被取消, 同时取消定时
    // 如果请求已完成, 同时取消定时
    onBefore() {
      cancelTimeout();

      if (ready) {
        timerRef.current = setTimeout(() => {
          fetchInstance.setState({
            loading: true,
          });
        }, loadingDelay);
      }

      return {
        loading: false,
      };
    },
    onFinally() {
      cancelTimeout();
    },
    onCancel() {
      cancelTimeout();
    },
  };
};
