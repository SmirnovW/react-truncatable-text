import { stringToNumber } from "./string-to-number";

export function getWidth(node: HTMLDivElement) {
  const { width: containerWidth } = node.getBoundingClientRect();
  const clientWidth = node.clientWidth;
  const { width: computedWidth, paddingRight } = window.getComputedStyle(node);

  const results = [
    clientWidth,
    containerWidth,
    stringToNumber(computedWidth) - stringToNumber(paddingRight),
  ].filter((w) => w !== 0);

  return results.length ? Math.min(...results) : 0;
}
