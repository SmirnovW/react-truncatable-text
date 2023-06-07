import * as useResizeObserver from "../hooks/use-resize-observer";

export function createUseResizeObserverMock() {
  const triggerResize = jest.fn();

  const resizeObserverSpy = jest.spyOn(useResizeObserver, "useResizeObserver");

  const observeMock = jest.fn();
  const unobserveMock = jest.fn();
  const resizeObserverMock = jest.fn();

  beforeEach(() => {
    observeMock.mockReset();
    unobserveMock.mockReset();
    resizeObserverMock.mockReset().mockImplementation((node, callback) => {
      triggerResize.mockImplementation((entry) => {
        callback(entry);
      });
      return {
        observe: observeMock,
        unobserve: unobserveMock,
      };
    });
  });

  resizeObserverSpy.mockImplementation(resizeObserverMock);

  return { triggerResize, resizeObserverSpy };
}
