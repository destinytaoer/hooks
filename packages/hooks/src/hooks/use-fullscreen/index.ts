import { useState } from 'react';
import screenfull from 'screenfull';
import { BasicTarget, getTargetElement } from '../utils/domTarget';
import { useLatestRef } from '../use-latest-ref';
import useMemoizedFn from '../use-memoized-fn';
import { useUnmount } from '../use-unmount';

export interface Options {
  onExit?: () => void;
  onEnter?: () => void;
}

export const useFullscreen = (target: BasicTarget, options?: Options) => {
  const { onEnter, onExit } = options ?? {};
  const onEnterRef = useLatestRef(onEnter);
  const onExitRef = useLatestRef(onExit);

  const [state, setState] = useState(false);

  const onChange = () => {
    if (screenfull.isEnabled) {
      const el = getTargetElement(target);

      if (screenfull.isFullscreen) {
        const isFullscreen = screenfull.element === el;
        if (isFullscreen) {
          onEnterRef.current?.();
        } else {
          onExitRef.current?.();
        }
        setState(isFullscreen);
      } else {
        screenfull.off('change', onChange);
        onExitRef.current?.();
        setState(false);
      }
    }
  };

  const enterFullscreen = () => {
    const element = getTargetElement(target);
    if (!element) return;

    if (screenfull.isEnabled) {
      try {
        screenfull.request(element);
        screenfull.on('change', onChange);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const exitFullscreen = () => {
    const element = getTargetElement(target);
    if (!element) return;

    if (screenfull.isEnabled && screenfull.element === element) {
      screenfull.exit();
    }
  };

  const toggleFullscreen = () => {
    if (state) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };

  useUnmount(() => {
    if (screenfull.isEnabled) {
      screenfull.off('change', onChange);
    }
  });

  return [
    state,
    {
      enterFullscreen: useMemoizedFn(enterFullscreen),
      exitFullscreen: useMemoizedFn(exitFullscreen),
      toggleFullscreen: useMemoizedFn(toggleFullscreen),
      isEnabled: screenfull.isEnabled,
    },
  ] as const;
};
