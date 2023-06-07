import { useEffect, useRef } from "react";

export function useResizeObserver<T extends Element>(
  node: T | null,
  callBack: (entry: ResizeObserverEntry) => void
) {
  const callback = useRef<(entry: ResizeObserverEntry) => void>();

  callback.current = callBack;

  useEffect(() => {
    if (!node) return;

    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        if (callback.current) callback.current(entry);
      });
    });

    resizeObserver.observe(node);

    return () => {
      resizeObserver.unobserve(node);
    };
  }, [node]);
}
