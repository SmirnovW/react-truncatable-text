import { useEffect, useState } from "react";

type CSSFontStylesType = {
  fontStyle: string;
  fontVariant: string;
  fontWeight: string;
  fontSize: string;
  lineHeight: string;
  fontFamily: string;
  textAlign: string;
};

const CANVAS_SIZE = 100;

export function useMeasureText(fontStyles: FontCSSStylesDeclaration) {
  const [context, setContext] = useState<
    OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D | null
  >(null);
  useEffect(() => {
    let offscreenCanvas: OffscreenCanvas | HTMLCanvasElement | null;
    if (typeof OffscreenCanvas !== "undefined") {
      offscreenCanvas = new OffscreenCanvas(CANVAS_SIZE, CANVAS_SIZE);
    } else {
      offscreenCanvas = document.createElement("canvas");
      offscreenCanvas.width = CANVAS_SIZE;
      offscreenCanvas.height = CANVAS_SIZE;
    }
    const canvasContext = offscreenCanvas.getContext(
      "2d"
    ) as CanvasRenderingContext2D;

    if (canvasContext) {
      canvasContext.scale(window.devicePixelRatio, window.devicePixelRatio);
      setContext(canvasContext);
    }
  }, []);

  useEffect(() => {
    if (context) {
      const {
        fontStyle,
        fontVariant,
        fontWeight,
        fontSize,
        lineHeight,
        fontFamily,
        textAlign,
      } = fontStyles;
      context.font = `${fontStyle} ${fontVariant} ${fontWeight} ${fontSize}/${lineHeight} ${fontFamily}`;
      context.textAlign = textAlign as CanvasTextAlign;
    }
  }, [context]);

  return (text: string): TextMetrics => {
    return context
      ? context.measureText(text)
      : ({
          actualBoundingBoxAscent: 0,
          actualBoundingBoxDescent: 0,
          actualBoundingBoxLeft: 0,
          actualBoundingBoxRight: 0,
          fontBoundingBoxAscent: 0,
          fontBoundingBoxDescent: 0,
          width: 0,
        } as TextMetrics);
  };
}
