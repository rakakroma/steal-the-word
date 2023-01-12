import { useEffect, useLayoutEffect, useRef, useState } from 'react';

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

export const useVisible = (callbackForVisible, callbackForHidden) => {
  const onVisibilityChange = () => {
    const visible = document.visibilityState === 'visible';
    if (visible && callbackForVisible) {
      callbackForVisible();
    } else if (callbackForHidden) {
      callbackForHidden();
    }
  };
  useEffect(() => {
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  });
};

export const useInterval = (callback, delay) => {
  const storedCallbackRef = useRef(null);

  useEffect(() => {
    storedCallbackRef.current = callback;
  }, [callback]);
  useEffect(() => {
    const tick = () => {
      storedCallbackRef.current();
    };

    if (delay !== null) {
      const intervalId = setInterval(() => {
        tick();
      }, delay);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [delay]);
};
