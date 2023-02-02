import type { BasicTarget } from '../utils/domTarget';
import { getTargetElement } from '../utils/domTarget';
import { useLatestRef } from '../use-latest-ref';
import { useEffect } from 'react';

type noop = (...p: any) => void;

// target 可以是 DOM 元素/ DOM 元素的 ref / 获取 DOM 元素的函数
export type Target = BasicTarget<HTMLElement | Element | Window | Document>;

type Options<T extends Target = Target> = {
  target?: T;
  capture?: boolean;
  once?: boolean;
  passive?: boolean;
};

function useEventListener<K extends keyof HTMLElementEventMap>(
  eventName: K,
  handler: (ev: HTMLElementEventMap[K]) => void,
  options?: Options<HTMLElement>
): void;
function useEventListener<K extends keyof ElementEventMap>(
  eventName: K,
  handler: (ev: ElementEventMap[K]) => void,
  options?: Options<Element>
): void;
function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (ev: DocumentEventMap[K]) => void,
  options?: Options<Document>
): void;
function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (ev: WindowEventMap[K]) => void,
  options?: Options<Window>
): void;
function useEventListener(eventName: string, handler: noop, options: Options): void;

function useEventListener(eventName: string, handler: noop, options: Options = {}) {
  const handlerRef = useLatestRef(handler);

  useEffect(() => {
    const targetElement = getTargetElement(options.target, window);

    if (!targetElement?.addEventListener) return;

    const eventListener = (event: Event) => {
      handlerRef.current(event);
    };

    targetElement.addEventListener(eventName, eventListener, {
      capture: options.capture,
      once: options.once,
      passive: options.passive,
    });

    return () => {
      targetElement.removeEventListener(eventName, eventListener, { capture: options.capture });
    };
  }, [eventName, options.capture, options.once, options.passive]);
}

export { useEventListener };
