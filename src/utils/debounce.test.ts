import { debounce } from "./debounce";

describe("debounce", () => {
  jest.useFakeTimers();

  it("should call the callback function after the specified delay", () => {
    const callbackMock = jest.fn();
    const debouncedCallback = debounce(callbackMock, 1000);

    debouncedCallback();
    expect(callbackMock).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);
    expect(callbackMock).toHaveBeenCalled();
  });

  test("should cancel the previous timer if called again within the delay", () => {
    const callbackMock = jest.fn();
    const debouncedCallback = debounce(callbackMock, 500);

    debouncedCallback();
    jest.advanceTimersByTime(300);
    debouncedCallback();

    jest.advanceTimersByTime(200);
    expect(callbackMock).not.toHaveBeenCalled();

    jest.advanceTimersByTime(300);
    expect(callbackMock).toHaveBeenCalled();
  });

  it("should use a default delay of 500 milliseconds if not provided", () => {
    const callbackMock = jest.fn();
    const debouncedCallback = debounce(callbackMock);

    debouncedCallback();
    expect(callbackMock).not.toHaveBeenCalled();

    jest.advanceTimersByTime(500);
    expect(callbackMock).toHaveBeenCalled();
  });
});
