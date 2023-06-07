import { getWidth } from "./get-width";

describe("getWidth", () => {
  it("should calculate the width correctly based on the container, client, and computed widths", () => {
    const node = document.createElement("div");

    jest.spyOn(node, "clientWidth", "get").mockReturnValue(150);
    window.getComputedStyle = jest.fn().mockReturnValue({
      width: "150px",
      paddingRight: "10px",
    });
    node.getBoundingClientRect = jest
      .fn()
      .mockImplementation(() => ({ width: 200 } as DOMRect));

    const result = getWidth(node);

    expect(result).toBe(140);
  });

  it("should return 0 if all width values are 0", () => {
    const node = document.createElement("div");

    jest.spyOn(node, "clientWidth", "get").mockReturnValue(0);
    window.getComputedStyle = jest.fn().mockReturnValue({
      width: "0px",
      paddingRight: "0px",
    });
    node.getBoundingClientRect = jest
      .fn()
      .mockImplementation(() => ({ width: 0 } as DOMRect));
    const result = getWidth(node);

    expect(result).toBe(0);
  });

  it("should return min value, but not the 0", () => {
    const node = document.createElement("div");

    jest.spyOn(node, "clientWidth", "get").mockReturnValue(0);
    window.getComputedStyle = jest.fn().mockReturnValue({
      width: "30px",
      paddingRight: "0px",
    });
    node.getBoundingClientRect = jest
      .fn()
      .mockImplementation(() => ({ width: 50 } as DOMRect));
    const result = getWidth(node);

    expect(result).toBe(30);
  });
});
