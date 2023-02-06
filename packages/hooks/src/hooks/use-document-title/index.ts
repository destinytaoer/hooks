import { useEffect, useRef } from 'react';
import { useUnmount } from '../use-unmount';

export interface Options {
  restoreOnUnmount?: boolean;
}

const DEFAULT_OPTIONS: Options = {
  restoreOnUnmount: false,
};

export const useDocumentTitle = (title: string, options: Options = DEFAULT_OPTIONS) => {
  const titleRef = useRef(document?.title ?? '');

  useEffect(() => {
    document.title = title;
  }, [title]);

  // 销毁时, 恢复之前的标题
  useUnmount(() => {
    if (options.restoreOnUnmount) {
      document.title = titleRef.current;
    }
  });
};
