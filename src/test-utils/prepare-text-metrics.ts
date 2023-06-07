import * as getWidth from "../utils/get-width";
import * as useMeasureText from "../hooks/use-measure-text";

export const TEXT_METRICS = {
  actualBoundingBoxAscent: 0,
  actualBoundingBoxDescent: 0,
  actualBoundingBoxLeft: 0,
  actualBoundingBoxRight: 0,
  fontBoundingBoxAscent: 0,
  fontBoundingBoxDescent: 0,
  width: 0,
};

export function prepareTextMetrics() {
  const getWidthSpy = jest.spyOn(getWidth, "getWidth");
  const useMeasureTextSpy = jest.spyOn(useMeasureText, "useMeasureText");
  const measureTextMock = jest.fn();

  beforeEach(() => {
    useMeasureTextSpy.mockReset().mockImplementation(() => measureTextMock);
  });

  /*
  afterEach(() => {
  });
*/

  const configureText = (
    containerWidth: number = 100,
    textWidth: number = 200
  ) => {
    measureTextMock.mockReset();
    getWidthSpy.mockReset();
    measureTextMock.mockReturnValue({ ...TEXT_METRICS, width: textWidth });
    getWidthSpy
      .mockReturnValueOnce(containerWidth)
      .mockReturnValueOnce(textWidth)
      .mockReturnValueOnce(containerWidth)
      .mockReturnValueOnce(textWidth);
  };
  return { configureText, getWidthSpy };
}
