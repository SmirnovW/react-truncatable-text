import { truncate } from "./truncate";

const longText = "This is a long text that needs to be truncated";
const shortText = "Short text";

describe("truncate", () => {
  it("should return the original text if it is shorter than or equal to the max letters in the line", () => {
    expect(truncate(shortText, 20, 3)).toBe(shortText);
  });

  it("should truncate the text and add ellipsis if it exceeds the max letters in the line", () => {
    expect(truncate(longText, 15, 3)).toBe("This is a...ted");
  });

  it("should not include the tail at the end of the truncated text", () => {
    expect(truncate(longText, 15, 0)).toBe("This is a lo...");
  });
});
