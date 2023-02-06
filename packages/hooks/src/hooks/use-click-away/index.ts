import {} from 'react';
import { useLatestRef } from '../use-latest-ref';
import { BasicTarget, getTargetElement } from '../utils/domTarget';
import getDocumentOrShadow from '../utils/getDocumentOrShadow';
import { useEffectWithTarget } from '../utils/useEffectWithTarget';

export const useClickAway = <T extends Event = Event>(
  onClickAway: (event: T) => void,
  target: BasicTarget | BasicTarget[],
  eventName: string | string[] = 'click'
) => {
  const clickAwayFnRef = useLatestRef(onClickAway);

  useEffectWithTarget(
    () => {
      const handler = (event: any) => {
        const targets = Array.isArray(target) ? target : [target];

        if (
            targets.some((item) => {
              const targetElement = getTargetElement(item);
              return !targetElement || targetElement.contains(event.target);
            })
        ) {
          return;
        }

        clickAwayFnRef.current(event);
      };

      const documentOrShadow = getDocumentOrShadow(target);

      const eventNames = Array.isArray(eventName) ? eventName : [eventName];

      eventNames.forEach((event) => documentOrShadow.addEventListener(event, handler));

      return () => {
        eventNames.forEach((event) => documentOrShadow.removeEventListener(event, handler));
      };
    },
    Array.isArray(eventName) ? eventName : [eventName],
    target
  );

  return {};
};
