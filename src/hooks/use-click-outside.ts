import { MutableRefObject, useEffect, DependencyList } from "react";

export function useClickOutside<T extends HTMLElement>(
  targets: MutableRefObject<T | null> | MutableRefObject<T | null>[],
  callback: () => void,
  deps?: DependencyList
) {
  useEffect(() => {
    const listener = (event: Event) => {
      const isClickInside = Array.isArray(targets)
        ? targets.some((target) =>
            target?.current?.contains(event.target as Node)
          )
        : targets?.current?.contains(event.target as Node);

      if (!isClickInside) {
        callback();
      }
    };
    document.addEventListener("click", listener);

    return () => {
      document.removeEventListener("click", listener);
    };
  }, deps);
}
