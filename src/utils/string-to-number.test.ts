import { stringToNumber } from "./string-to-number";

describe("stringToNumber", () => {
  it("should convert a valid string to a number", () => {
    expect(stringToNumber("42")).toBe(42);
  });

  it("should convert a string with pixels to a number", () => {
    expect(stringToNumber("23px")).toBe(23);
  });

  it("should return 0 for an invalid string", () => {
    expect(stringToNumber("invalid")).toBe(0);
  });

  it("should return 0 for an empty string", () => {
    expect(stringToNumber("")).toBe(0);
  });
});
