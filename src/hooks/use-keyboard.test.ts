import { renderHook, act } from "@testing-library/react";

import { useKeyboard, KEYS } from "./use-keyboard";
import { KeyboardEvent } from "react";

describe("useKeyboard hook", () => {
  it('should call the "C" handler when CMD/Ctrl and "C" keys are pressed', () => {
    const handlers = {
      [KEYS.C]: jest.fn(),
    };

    const { result } = renderHook(() => useKeyboard(handlers));

    act(() => {
      result.current({
        code: KEYS.CMD[0],
      } as KeyboardEvent<HTMLElement>);
    });

    act(() => {
      result.current({
        code: KEYS.C,
      } as KeyboardEvent<HTMLElement>);
    });

    expect(handlers[KEYS.C]).toHaveBeenCalledTimes(1);
  });

  it('should call the "ESCAPE" handler when "Escape" key is pressed', () => {
    const handlers = {
      [KEYS.ESCAPE]: jest.fn(),
    };

    const { result } = renderHook(() => useKeyboard(handlers));

    act(() => {
      result.current({
        code: KEYS.ESCAPE,
      } as KeyboardEvent<HTMLElement>);
    });

    expect(handlers[KEYS.ESCAPE]).toHaveBeenCalledTimes(1);
  });

  it('should not call any handler when "C" key is pressed without CMD/Ctrl', () => {
    const handlers = {
      [KEYS.C]: jest.fn(),
    };

    const { result } = renderHook(() => useKeyboard(handlers));

    act(() => {
      result.current({
        code: KEYS.C,
      } as KeyboardEvent<HTMLElement>);
    });

    expect(handlers[KEYS.C]).not.toHaveBeenCalled();
  });

  // Add more test cases for other scenarios as needed
});
