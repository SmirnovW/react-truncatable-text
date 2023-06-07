import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
  KeyboardEvent,
  MouseEvent,
} from "react";
import { useInView } from "react-intersection-observer";

import { useMeasureText } from "./hooks/use-measure-text";
import { useResizeObserver } from "./hooks/use-resize-observer";
import { debounce, getWidth, truncate } from "./utils";

import styles from "./truncatable-text.module.css";

type Props = {
  children: string;
  tailLength: number;
  title?: string;
  className?: string;
  debounced?: boolean;
};

const LETTER = 1;
const ROOT_MARGIN = "300px";
const EXECUTION_TIME_LIMIT = 1;
const KEYS = {
  CMD: "MetaLeft",
  CONTROL: "ControlLeft",
  C: "KeyC",
};

export const CONTAINER_TEST_ID = "truncated-container";
export const TEXT_TEST_ID = "truncated-text";

export const TruncatableText: React.FC<Props> = ({
  children,
  tailLength,
  title = "",
  className = "",
  debounced = false,
}) => {
  const [commandPressed, setCommandPressed] = useState<boolean>(false);
  const [visibleText, setVisibleText] = useState<string>(children);
  const [forceDebounce, setForceDebounce] = useState<boolean>(false);
  const [previousContainerWidth, setPreviousContainerWidth] =
    useState<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const { ref: inViewRef, inView } = useInView({
    rootMargin: ROOT_MARGIN,
  });

  const {
    fontStyle,
    fontVariant,
    fontWeight,
    fontSize,
    lineHeight,
    fontFamily,
    textAlign,
  } = useMemo((): FontCSSStylesDeclaration => {
    if (containerRef.current !== null && window) {
      return window.getComputedStyle(containerRef.current as HTMLDivElement);
    }
    return {
      fontStyle: "",
      fontVariant: "",
      fontWeight: "",
      fontSize: "",
      lineHeight: "",
      fontFamily: "",
      textAlign: "",
    };
  }, [containerRef.current]);

  const measureText = useMeasureText({
    fontStyle,
    fontVariant,
    fontWeight,
    fontSize,
    lineHeight,
    fontFamily,
    textAlign,
  });

  const onDoubleClick = (event: MouseEvent<HTMLDivElement>) => {
    const selection = window.getSelection();
    if (selection !== null) {
      selection.removeAllRanges();
      const range = document.createRange();
      range.selectNodeContents(event.currentTarget);
      selection.addRange(range);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.code === KEYS.CMD || event.code === KEYS.CONTROL) {
      setCommandPressed(true);
    }

    if (event.code === KEYS.C) {
      if (commandPressed) {
        navigator.clipboard.writeText(children).catch((error) => {
          console.error(error);
        });
      }
    }
  };

  const transformText = useCallback(() => {
    const start = performance.now();
    const containerWidth = getWidth(containerRef.current as HTMLDivElement);
    const textWidth = getWidth(textRef.current as HTMLDivElement);

    if (containerWidth === previousContainerWidth) return;

    if (containerWidth > textWidth && children?.length === visibleText.length) {
      return;
    }

    const maximumLetters = findMaximumLettersAmount(containerWidth);

    if (maximumLetters !== 0) {
      setVisibleText(truncate(children, maximumLetters, tailLength));
    }

    setPreviousContainerWidth(containerWidth);
    const end = performance.now();

    const executionTime = end - start;

    if (debounced) {
      if (executionTime >= EXECUTION_TIME_LIMIT) {
        if (!forceDebounce) {
          setForceDebounce(true);
        }
      } else if (forceDebounce) {
        setForceDebounce(false);
      }
    }
  }, [containerRef.current, textRef.current, visibleText, measureText]);

  const debouncedTransformText = forceDebounce
    ? debounce(transformText, 100)
    : transformText;

  const findMaximumLettersAmount = (containerWidth: number) => {
    const { width } = measureText(children); // 200
    const letterWidth = width / children.length;

    if (letterWidth === 0) {
      return 0;
    }

    let maximumLettersAmount = containerWidth / letterWidth;

    let currentWidth =
      measureText(truncate(children, maximumLettersAmount, tailLength)).width ??
      0;

    while (
      maximumLettersAmount < children.length &&
      currentWidth <= containerWidth
    ) {
      maximumLettersAmount += 1;
      currentWidth = measureText(
        truncate(children, maximumLettersAmount, tailLength)
      ).width;
    }

    if (Math.round(currentWidth) > containerWidth) {
      maximumLettersAmount -= LETTER;
    }

    return maximumLettersAmount;
  };

  const onResize = useCallback(() => {
    if (inView) {
      debouncedTransformText();
    }
  }, [inView, debouncedTransformText, visibleText]);

  useResizeObserver<HTMLDivElement>(containerRef.current, onResize);

  useEffect(() => {
    if (containerRef.current !== null && inView) {
      transformText();
    }
  }, [containerRef.current, inView]);

  return (
    <div
      onDoubleClick={onDoubleClick}
      className={`${styles.container} ${className}`}
      onKeyDown={onKeyDown}
      ref={(node) => {
        containerRef.current = node;
        inViewRef(node);
      }}
      title={title}
      tabIndex={-1}
      data-testid={CONTAINER_TEST_ID}
    >
      <span ref={textRef} data-testid={TEXT_TEST_ID}>
        {visibleText}
      </span>
    </div>
  );
};
