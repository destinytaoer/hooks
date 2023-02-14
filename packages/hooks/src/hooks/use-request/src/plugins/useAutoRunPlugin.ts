import { useRef } from 'react';
import { Plugin } from '../typings';
import { useUpdate } from '../../../use-update';

// 支持 refreshDeps & ready options
const useAutoRunPlugin: Plugin<any, any[]> = (fetchInstance, options) => {
  const { manual, ready = true, defaultParams = [], refreshDeps = [] } = options;

  // 用于防止两个 useUpdate 同时符合, 导致执行两次请求
  const hasAutoRun = useRef(false);
  hasAutoRun.current = false;

  useUpdate(() => {
    if (!manual && ready) {
      hasAutoRun.current = true;
      fetchInstance.run(...defaultParams);
    }
  }, [ready]);

  useUpdate(() => {
    if (hasAutoRun.current) {
      return;
    }
    if (!manual) {
      hasAutoRun.current = true;
      fetchInstance.refresh();
    }
  }, refreshDeps);

  return {
    // !ready 时, 就算调用 run, 也不会执行请求
    onBefore() {
      if (!ready) {
        return {
          stopNow: true,
        };
      }
    },
  };
};

useAutoRunPlugin.onInit = ({ ready = true, manual }) => {
  return {
    loading: !manual && ready,
  };
};

export default useAutoRunPlugin;
