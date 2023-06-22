import { MutableRefObject, useEffect, useRef } from "react";

export function useMutationObserver<T extends Element>(
  target: MutableRefObject<T | null>,
  callBack: (mutation: MutationRecord) => void,
  options: MutationObserverInit = {}
) {
  const callback = useRef<(mutation: MutationRecord) => void>();

  callback.current = callBack;

  useEffect(() => {
    if (!target.current) return;

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (callback.current) callback.current(mutation);
      });
    });

    mutationObserver.observe(target.current, options);

    return () => {
      mutationObserver.disconnect();
    };
  }, [target, options]);
}
