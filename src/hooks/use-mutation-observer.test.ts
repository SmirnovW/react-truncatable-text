import { renderHook } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import { useMutationObserver } from "./use-mutation-observer";

const options = { attributes: true };

describe("useMutationObserver hook", () => {
  const callBack = jest.fn();
  const observerSpy = jest.spyOn(MutationObserver.prototype, "observe");
  const disconnectSpy = jest.spyOn(MutationObserver.prototype, "disconnect");

  beforeEach(() => {
    callBack.mockReset();
    observerSpy.mockReset();
    disconnectSpy.mockReset();
  });

  it("should observe mutations when target is present", async () => {
    const target = { current: document.createElement("div") };

    renderHook(() => useMutationObserver(target, callBack, options));

    target.current.setAttribute("id", "test-id");
    await waitFor(() => expect(callBack).toHaveBeenCalledTimes(1));
  });

  it("should not observe mutations when target is null", async () => {
    const target = { current: null };

    renderHook(() => useMutationObserver(target, callBack, options));

    await waitFor(() => expect(observerSpy).toHaveBeenCalledTimes(1));
  });

  it("should disconnect observer on unmount", () => {
    const target = { current: document.createElement("div") };

    const { unmount } = renderHook(() =>
      useMutationObserver(target, callBack, options)
    );

    expect(disconnectSpy).not.toHaveBeenCalled();

    unmount();

    expect(disconnectSpy).toHaveBeenCalledTimes(1);
  });
});
