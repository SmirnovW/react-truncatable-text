import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
  KeyboardEvent,
  MouseEvent,
  CSSProperties,
} from "react";
import { useInView } from "react-intersection-observer";

import { useMeasureText } from "./hooks/use-measure-text";
import { useResizeObserver } from "./hooks/use-resize-observer";
import { useClickOutside } from "./hooks/use-click-outside";
import { useKeyboard, KEYS } from "./hooks/use-keyboard";
import { debounce, getWidth, truncate } from "./utils";
import { Hidden } from "./components/hidden";

type Props = {
  children: string;
  tailLength: number;
  title?: string;
  className?: string;
  debounced?: boolean;
  searchable?: boolean;
};

type ContainerStyles = Pick<
  CSSProperties,
  "whiteSpace" | "overflowX" | "overflowY" | "contentVisibility"
>;

const LETTER = 1;
const ROOT_MARGIN = "300px";
const EXECUTION_TIME_LIMIT = 1;
const SEARCHABLE_TEXT_LEFT_OFFSET = "100px";

const INLINE_STYLES: ContainerStyles = {
  whiteSpace: "nowrap",
  overflowX: "auto",
  overflowY: "hidden",
  contentVisibility: "auto",
};

export const CONTAINER_TEST_ID = "truncated-container";
export const TEXT_TEST_ID = "truncated-text";
export const SEARCHABLE_TEXT_TEST_ID = "searchable-text";

export const TruncatableText: React.FC<Props> = ({
  children,
  tailLength,
  title = "",
  className = "",
  debounced = false,
  searchable = false,
}) => {
  const [styles, setStyles] = useState<ContainerStyles>({
    ...INLINE_STYLES,
    overflowX: searchable ? "auto" : "hidden",
  });
  const [visibleText, setVisibleText] = useState<string>(children);
  const [forceDebounce, setForceDebounce] = useState<boolean>(false);
  const [previousContainerWidth, setPreviousContainerWidth] =
    useState<number>(0);
  const [shouldShowText, setShouldShowText] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const [isMatched, setMatched] = useState<boolean>(false);
  const { ref: inViewRef, inView } = useInView({
    rootMargin: ROOT_MARGIN,
  });
  const [isMouseEntered, setMouseEntered] = useState<boolean>(false);

  const shouldBeUsedFallbackForHidden = useMemo(() => {
    if (typeof document !== "undefined") {
      return !("onbeforematch" in document.body);
    }
    return true;
  }, []);

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
      range.setStart(event.currentTarget, 0);
      range.setEnd(event.currentTarget, 1);
      selection.addRange(range);
    }
  };

  /**
   * For search implementation we're using the attribute "hidden" with the "until-found"
   * since it's not supported in some browsers, we're doing the fallback search with the the scroll.
   * For this need to track the scroll event but only it was initiated by browser built-in search.
   **/
  const onScroll = () => {
    if (!isMouseEntered && shouldBeUsedFallbackForHidden) {
      onFound();
    }
  };

  const onFound = useCallback(() => {
    setShouldShowText(false);
    setMatched(true);
  }, []);

  const hideSearchableText = useCallback(() => {
    setShouldShowText(true);
    setMatched(false);
    if (containerRef.current !== null) {
      (containerRef.current as HTMLElement).scrollLeft = 0;
    }
  }, [containerRef]);

  const onMouseEnter = () => {
    if (searchable && shouldBeUsedFallbackForHidden) {
      setMouseEntered(true);

      if (!isMatched) {
        setStyles({ ...INLINE_STYLES, overflowX: "hidden" });
      }
    }
  };

  const onMouseLeave = () => {
    if (searchable) {
      const selection = window.getSelection();
      if (selection?.isCollapsed) {
        hideSearchableText();
      }

      if (shouldBeUsedFallbackForHidden) {
        setMouseEntered(false);
        setStyles(INLINE_STYLES);
      }
    }
  };

  const copyTextToClipboard = (event: KeyboardEvent<HTMLElement>) => {
    const selection = window.getSelection();

    if (
      selection &&
      (selection.focusOffset === 1 ||
        selection.focusOffset === visibleText.length)
    ) {
      event.preventDefault(); // for safari
      navigator.clipboard.writeText(children).catch((error) => {
        console.error(error);
      });
    }
  };

  const onKeyDown = useKeyboard({
    [KEYS.C]: copyTextToClipboard,
    [KEYS.ESCAPE]: hideSearchableText,
  });

  useClickOutside<HTMLDivElement>(
    containerRef,
    () => {
      hideSearchableText();
    },
    []
  );

  // Here we're changing the text size
  const transformText = useCallback(() => {
    if (!containerRef.current || !textRef.current) return;

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
      // in case if there is a performance issue, we'll force debouncing of the text truncation
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
    const { width } = measureText(children);
    // we're determining the average letter size
    const letterWidth = width / children.length;

    if (letterWidth === 0) {
      return 0;
    }

    let maximumLettersAmount = containerWidth / letterWidth;

    let currentWidth =
      measureText(truncate(children, maximumLettersAmount, tailLength)).width ??
      0;

    /**
     * The maximum letter amount is an approximate value and can be possible that the container can fit
     * more letters. So we need to measure if it's possible to add more letters to the container.
     **/
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
      if (searchable && !shouldShowText) {
        hideSearchableText();
      }
      debouncedTransformText();
    }
  }, [inView, debouncedTransformText, visibleText]);

  useResizeObserver<HTMLDivElement>(containerRef.current, onResize);

  useEffect(() => {
    if (containerRef.current !== null && inView) {
      transformText();
    }
  }, [containerRef.current, inView]);

  const shouldRenderSearchableText = useMemo(() => {
    return visibleText !== children && searchable;
  }, [visibleText]);

  return (
    <div
      onDoubleClick={onDoubleClick}
      className={className}
      style={styles}
      onKeyDown={onKeyDown}
      ref={(node) => {
        containerRef.current = node;
        inViewRef(node);
      }}
      title={title}
      tabIndex={-1}
      data-testid={CONTAINER_TEST_ID}
      onScroll={onScroll}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span ref={textRef} data-testid={TEXT_TEST_ID}>
        {shouldShowText && visibleText}
      </span>
      {shouldRenderSearchableText && shouldBeUsedFallbackForHidden && (
        <span
          data-testid={SEARCHABLE_TEXT_TEST_ID}
          style={{
            opacity: shouldShowText ? "0" : "1",
            marginLeft: shouldShowText ? SEARCHABLE_TEXT_LEFT_OFFSET : "0",
            contentVisibility: shouldBeUsedFallbackForHidden
              ? "hidden"
              : "visible",
          }}
        >
          {children}
        </span>
      )}
      {shouldRenderSearchableText && !shouldBeUsedFallbackForHidden && (
        <Hidden
          onFound={onFound}
          onHide={hideSearchableText}
          visible={!shouldShowText}
          testId={SEARCHABLE_TEXT_TEST_ID}
        >
          {children}
        </Hidden>
      )}
    </div>
  );
};

export default TruncatableText;
