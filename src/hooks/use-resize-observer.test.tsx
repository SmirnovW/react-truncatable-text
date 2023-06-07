import { renderHook } from "@testing-library/react";

import { useResizeObserver } from "./use-resize-observer";

const triggerResize = jest.fn();

const observeMock = jest.fn();
const unobserveMock = jest.fn();
const resizeObserverMock = jest.fn();

beforeEach(() => {
  observeMock.mockReset();
  unobserveMock.mockReset();
  resizeObserverMock.mockReset().mockImplementation((callback) => {
    triggerResize.mockImplementation((entry) => {
      callback(entry);
    });
    return {
      observe: observeMock,
      unobserve: unobserveMock,
    };
  });
});

describe("useResizeObserver hook", () => {
  it("should call the callback function when the target element is resized", () => {
    window.ResizeObserver = resizeObserverMock;

    const callbackMock = jest.fn();
    const node = document.createElement("div");
    renderHook(() => useResizeObserver(node, callbackMock));

    expect(callbackMock).not.toBeCalled();

    const entry = { target: node };

    triggerResize([entry] as any);

    expect(callbackMock).toHaveBeenCalledWith(entry);
  });

  it("should not observe or unobserve when node is not provided", () => {
    window.ResizeObserver = resizeObserverMock;

    const callbackMock = jest.fn();
    const { unmount } = renderHook(() => useResizeObserver(null, callbackMock));

    expect(observeMock).not.toHaveBeenCalled();

    unmount();

    expect(unobserveMock).not.toHaveBeenCalled();
  });

  it("should not call useEffect more then once", () => {
    window.ResizeObserver = resizeObserverMock;

    let callbackMock = jest.fn();
    const node = document.createElement("div");

    expect(resizeObserverMock).not.toHaveBeenCalled();

    const { rerender } = renderHook(
      ({ node, callbackMock }) =>
        useResizeObserver<HTMLDivElement>(node, callbackMock),
      {
        initialProps: {
          node,
          callbackMock,
        },
      }
    );

    callbackMock = jest.fn();

    rerender({ node, callbackMock });
    expect(resizeObserverMock).toHaveBeenCalledTimes(1);
  });
});
