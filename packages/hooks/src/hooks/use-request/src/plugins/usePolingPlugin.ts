import { useRef } from 'react';
import { Plugin, Timeout } from '../typings';

export const usePolingPlugin: Plugin<any, any[]> = (fetchInstance, { pollingInterval }) => {
  const timerRef = useRef<Timeout>();
  if (!pollingInterval) {
    return {};
  }

  const stopPolling = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  return {
    onBefore() {
      stopPolling();
    },
    onFinally() {
      timerRef.current = setTimeout(() => {
        fetchInstance.refresh();
      }, pollingInterval);
    },
    onCancel() {
      stopPolling();
    },
  };
};
