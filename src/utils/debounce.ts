export function debounce(
  callback: () => void,
  delay: number = 500
): () => void {
  let timerId: NodeJS.Timeout = 0 as unknown as NodeJS.Timeout;

  return () => {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      callback();
    }, delay);
  };
}
