export function stringToNumber(value: string): number {
  const parsedInt = parseInt(value);
  return isNaN(parsedInt) ? 0 : parsedInt;
}
