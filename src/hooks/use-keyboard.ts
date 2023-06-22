import { KeyboardEvent, useState } from "react";

type KeydownHandler = (event: KeyboardEvent<HTMLElement>) => void;

export const KEYS = {
  CMD: ["OSLeft", "MetaLeft"],
  CONTROL: "ControlLeft",
  C: "KeyC",
  ESCAPE: "Escape",
};

export function useKeyboard(handlers: { [p: string]: KeydownHandler }) {
  const [commandPressed, setCommandPressed] = useState<boolean>(false);

  return (event: KeyboardEvent<HTMLElement>) => {
    if (KEYS.CMD.includes(event.code) || event.code === KEYS.CONTROL) {
      setCommandPressed(true);
    }

    if (event.code === KEYS.C && commandPressed) {
      if (handlers[KEYS.C]) {
        handlers[KEYS.C](event);
      }
    }

    if (event.code === KEYS.ESCAPE) {
      if (handlers[KEYS.ESCAPE]) {
        handlers[KEYS.ESCAPE](event);
      }
    }
  };
}
