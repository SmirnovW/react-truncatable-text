const DOTS_LENGTH = 3;

export function truncate(
  text: string,
  maxLettersInTheLine: number,
  tailLength: number
) {
  if (text.length <= maxLettersInTheLine) {
    return text;
  }

  const truncatedText = text.substring(
    0,
    maxLettersInTheLine - tailLength - DOTS_LENGTH
  );
  const tail = text.substring(text.length - tailLength);

  return `${truncatedText}...${tail}`;
}
