import React, { useEffect, useRef } from "react";

import { useClickOutside } from "../hooks/use-click-outside";
import { useMutationObserver } from "../hooks/use-mutation-observer";

type Props = {
  children: string;
  onFound: () => void;
  onHide: () => void;
  visible?: boolean;
  testId?: string;
};

/**
 * Hidden Component
 */
export const Hidden: React.FC<Props> = ({
  children,
  onFound,
  onHide,
  visible = false,
  testId = "",
}) => {
  const textRef = useRef<HTMLSpanElement | null>(null);
  const oldAttributeValue = useRef<string | null>(null);

  useEffect(() => {
    if (textRef.current && !visible) {
      textRef.current.setAttribute("hidden", "until-found");
      oldAttributeValue.current = "until-found";
    }
  }, [visible]);

  useClickOutside<HTMLSpanElement>(
    textRef,
    () => {
      if (textRef.current) {
        textRef.current.setAttribute("hidden", "until-found");
        oldAttributeValue.current = "until-found";
      }
      onHide();
    },
    [textRef]
  );

  const onMutation = (mutation: MutationRecord) => {
    if (mutation.type === "attributes" && mutation.attributeName === "hidden") {
      const currentAttributeValue = (
        mutation.target as HTMLElement
      ).getAttribute("hidden");

      if (
        currentAttributeValue === null &&
        oldAttributeValue.current !== null
      ) {
        onFound();
      }

      oldAttributeValue.current = currentAttributeValue;
    }
  };

  useEffect(() => {
    if (!textRef.current) return;

    textRef.current.setAttribute("hidden", "until-found");
    oldAttributeValue.current = "until-found";
  }, [textRef]);

  useMutationObserver<HTMLSpanElement>(textRef, onMutation, {
    attributes: true,
  });

  return (
    <span
      style={{
        display: "inline-block",
      }}
      ref={textRef}
      data-testid={testId}
    >
      {children}
    </span>
  );
};
