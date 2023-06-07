import React from "react";
import { setupJestCanvasMock } from "jest-canvas-mock";
import { renderHook } from "@testing-library/react";

import { useMeasureText } from "./use-measure-text";

const fontStyles = {
  fontStyle: "normal",
  fontVariant: "normal",
  fontWeight: "400",
  fontSize: "15px",
  lineHeight: "normal",
  fontFamily: "Arial",
  textAlign: "center",
};

const shortText = "This is short text.";
const longText =
  "This is very long text with a lot of words that should be pretty long!";

describe("useMeasureText hook", () => {
  afterEach(() => {
    jest.resetAllMocks();
    setupJestCanvasMock();
  });

  it("should measure text using the provided font styles", () => {
    const { result } = renderHook(() => useMeasureText(fontStyles));

    expect(result.current(shortText)).toEqual({
      width: 19,
      actualBoundingBoxLeft: 0,
      actualBoundingBoxRight: 0,
      fontBoundingBoxAscent: 0,
      fontBoundingBoxDescent: 0,
      actualBoundingBoxAscent: 0,
      actualBoundingBoxDescent: 0,
      emHeightAscent: 0,
      emHeightDescent: 0,
      hangingBaseline: 0,
      alphabeticBaseline: 0,
      ideographicBaseline: 0,
    });

    expect(result.current(longText)).toEqual({
      width: 70,
      actualBoundingBoxLeft: 0,
      actualBoundingBoxRight: 0,
      fontBoundingBoxAscent: 0,
      fontBoundingBoxDescent: 0,
      actualBoundingBoxAscent: 0,
      actualBoundingBoxDescent: 0,
      emHeightAscent: 0,
      emHeightDescent: 0,
      hangingBaseline: 0,
      alphabeticBaseline: 0,
      ideographicBaseline: 0,
    });
  });

  it("should set the canvas context correctly based on browser support", () => {
    window.OffscreenCanvas = jest.fn().mockImplementation(function () {
      return document.createElement("canvas");
    });

    const { result } = renderHook(() => useMeasureText(fontStyles));

    expect(result.current(longText).width).toBe(70);

    expect(window.OffscreenCanvas).toHaveBeenCalled();
  });
});
