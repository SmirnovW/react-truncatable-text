import React from "react";
import { render, act, cleanup } from "@testing-library/react";
import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { mockAllIsIntersecting } from "react-intersection-observer/test-utils";
import * as truncate from "./utils/truncate";
import {
  CONTAINER_TEST_ID,
  TEXT_TEST_ID,
  TruncatableText,
} from "./react-truncatable-text";
import { createUseResizeObserverMock } from "./test-utils/use-resize-observer-mock";
import { prepareTextMetrics } from "./test-utils/prepare-text-metrics";

function renderComponent(
  debounced = false,
  text = longText,
  isIntersecting = true
) {
  const Component = () => (
    <TruncatableText tailLength={3} debounced={debounced}>
      {text}
    </TruncatableText>
  );

  const renderResult = render(<Component />);
  mockAllIsIntersecting(isIntersecting);
  return renderResult;
}

const truncateSpy = jest.spyOn(truncate, "truncate");

const longText = "This is a long text that needs to be truncated";
const truncatedText = "This is a long t...ted";

const { triggerResize } = createUseResizeObserverMock();
const { configureText } = prepareTextMetrics();

beforeEach(() => {
  jest.useFakeTimers();
  truncateSpy.mockReset();
});

afterEach(() => {
  cleanup();
});

describe("<TruncatedText />", () => {
  const user = userEvent.setup({ delay: null });

  it("should truncate the text based on container width", () => {
    configureText();
    renderComponent();
    const visibleText = screen.getByTestId(TEXT_TEST_ID);
    expect(visibleText).toBeInTheDocument();
    expect(visibleText).toHaveTextContent(truncatedText);
  });

  it("should debounce text transformation when debounced prop is TRUE", async () => {
    configureText();
    renderComponent(true);
    const node = document.createElement("div");
    const entry = { target: node };

    await waitFor(() => expect(truncateSpy).toHaveBeenCalledTimes(2));

    configureText(90, 200);
    await act(() => triggerResize([entry] as any));
    jest.advanceTimersByTime(90);

    configureText(90, 200);
    await act(() => triggerResize([entry] as any));
    jest.advanceTimersByTime(100);

    await waitFor(() => expect(truncateSpy).toHaveBeenCalledTimes(4));
  });

  it("should call the debounce function when execution time exceeds the limit", async () => {
    configureText();
    renderComponent(true);
    const node = document.createElement("div");
    const entry = { target: node };

    configureText(90, 200);
    await act(() => triggerResize([entry] as any));

    jest.runAllTimers();

    await waitFor(() => expect(truncateSpy).toHaveBeenCalledTimes(4));
  });

  it('should copy the text to clipboard on "Cmd + C" key combination', async () => {
    navigator.clipboard.writeText = jest.fn().mockResolvedValueOnce(true);
    configureText();
    renderComponent(true);
    const textContainer = screen.getByTestId(TEXT_TEST_ID);

    await act(() => user.type(textContainer, "[MetaLeft]"));
    await act(() => user.type(textContainer, "[KeyC]"));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(longText);
  });

  it('should copy the text to clipboard when "Ctrl + C" key combination is used', async () => {
    navigator.clipboard.writeText = jest.fn().mockResolvedValueOnce(true);
    configureText();
    renderComponent(true);
    const textContainer = screen.getByTestId(TEXT_TEST_ID);

    await act(() => user.type(textContainer, "[ControlLeft]"));
    await act(() => user.type(textContainer, "[KeyC]"));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(longText);
  });

  it("should select the visible text by double click", async () => {
    configureText();
    const { getByTestId } = renderComponent(false, longText);
    const container = getByTestId(CONTAINER_TEST_ID);

    await act(() => user.dblClick(container));
    const selection = window.getSelection();
    expect(selection?.toString()).toBe(truncatedText);
  });

  it("should not truncate the text if the container width is greater than the text width", () => {
    configureText(200, 100);
    renderComponent();
    const textContainer = screen.getByTestId(TEXT_TEST_ID);

    expect(textContainer).toHaveTextContent(longText);
  });

  it("should not update the visible text if the container width has not changed", async () => {
    configureText();
    renderComponent();
    const textContainer = screen.getByTestId(TEXT_TEST_ID);
    expect(textContainer).toHaveTextContent(truncatedText);

    const node = document.createElement("div");
    const entry = { target: node };

    configureText(100, 200);
    await act(() => triggerResize([entry] as any));

    await waitFor(() => expect(textContainer).toHaveTextContent(truncatedText));
  });

  it("should update the visible text when the container becomes in view", async () => {
    configureText();
    renderComponent(false, longText, false);
    const textContainer = screen.getByTestId(TEXT_TEST_ID);

    expect(textContainer).toHaveTextContent(longText);

    await act(() => mockAllIsIntersecting(true));

    expect(textContainer).toHaveTextContent(truncatedText);
  });

  it("should not call the transformText function when the container is resized but not in view", async () => {
    configureText();
    renderComponent(false, longText, false);
    const textContainer = screen.getByTestId(TEXT_TEST_ID);

    expect(textContainer).toHaveTextContent(longText);

    await act(() => mockAllIsIntersecting(true));

    expect(textContainer).toHaveTextContent(truncatedText);
  });
});
