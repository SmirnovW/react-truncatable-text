import React from "react";
import { render, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Hidden } from "./hidden";

const onFoundMock = jest.fn();
const onHideMock = jest.fn();
const testId = "test-id";
const outsideContainerTestId = "outside-container-test-id";

beforeEach(() => {
  onFoundMock.mockReset();
  onHideMock.mockReset();
});

const renderComponent = () => {
  return render(
    <div data-testid={outsideContainerTestId}>
      <Hidden visible onFound={onFoundMock} onHide={onHideMock} testId={testId}>
        Hello World
      </Hidden>
    </div>
  );
};

describe("<Hidden />", () => {
  const user = userEvent.setup({ delay: null });

  it("should render children when visible is true", () => {
    const { getByTestId } = renderComponent();

    expect(getByTestId(testId)).toHaveTextContent("Hello World");
  });

  it("should call onFound callback when hidden attribute is removed", async () => {
    const { getByTestId } = renderComponent();
    const element = getByTestId(testId);

    await act(() => element.removeAttribute("hidden"));

    expect(onFoundMock).toHaveBeenCalled();
  });

  it("should call onHide callback when click outside the component", async () => {
    const { getByTestId } = renderComponent();

    const outsideElement = getByTestId(outsideContainerTestId);

    await act(() => user.click(outsideElement));

    expect(onHideMock).toHaveBeenCalled();
  });
});
