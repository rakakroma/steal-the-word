import { useLayoutEffect, useState } from 'react';

//from https://www.robinwieruch.de/react-custom-hook-check-if-overflow/

export const useIsOverflow = (ref, callback) => {
  const [isOverflow, setIsOverflow] = useState(undefined);

  useLayoutEffect(() => {
    const { current } = ref;

    const trigger = () => {
      const hasOverflow = current.scrollHeight > current.clientHeight;

      setIsOverflow(hasOverflow);

      if (callback) callback(hasOverflow);
    };
    let resizeObserver;
    if (current) {
      if ('ResizeObserver' in window) {
        resizeObserver = new ResizeObserver(trigger);
        resizeObserver.observe(current);
      }

      trigger();
    }
    return () => {
      resizeObserver?.unobserve(current);
    };
  }, [callback, ref]);

  return isOverflow;
};
