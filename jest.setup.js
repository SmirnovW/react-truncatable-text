import "@testing-library/jest-dom";
import { defaultFallbackInView } from "react-intersection-observer";
import {
  setupIntersectionMocking,
  resetIntersectionMocking,
} from "react-intersection-observer/test-utils";

defaultFallbackInView(false);

beforeEach(() => {
  setupIntersectionMocking(jest.fn);
});

afterEach(() => {
  resetIntersectionMocking();
});
