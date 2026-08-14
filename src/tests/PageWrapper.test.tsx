import { render, screen, act, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import loaderReducer from "../redux/slices/loaderSlice";
import PageWrapper from "../components/PageWrapper";

jest.useFakeTimers();

const store = configureStore({ reducer: { loader: loaderReducer } });

const renderInRouter = () =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route
            path="*"
            element={
              <PageWrapper>
                <span data-testid="child">content</span>
              </PageWrapper>
            }
          />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

describe("PageWrapper", () => {
  it("renders children", () => {
    renderInRouter();
    expect(screen.getByTestId("child")).toBeTruthy();
  });

  it("shows loader overlay immediately on mount", () => {
    const { container } = renderInRouter();
    expect(container.querySelector(".absolute.inset-0.z-40")).not.toBeNull();
  });

  it("overlay has correct background class", () => {
    const { container } = renderInRouter();
    const overlay = container.querySelector(".absolute.inset-0.z-40") as HTMLElement;
    // Tailwind class bg-white/70 is stored as-is in className string
    expect(overlay.className).toContain("bg-white/70");
  });

  it("overlay has flex centering classes", () => {
    const { container } = renderInRouter();
    const overlay = container.querySelector(".absolute.inset-0.z-40") as HTMLElement;
    expect(overlay.classList.contains("flex")).toBe(true);
    expect(overlay.classList.contains("items-center")).toBe(true);
    expect(overlay.classList.contains("justify-center")).toBe(true);
  });

  it("hides loader overlay after 1000ms", () => {
    const { container } = renderInRouter();
    expect(container.querySelector(".absolute.inset-0.z-40")).not.toBeNull();
    act(() => { jest.advanceTimersByTime(1000); });
    expect(container.querySelector(".absolute.inset-0.z-40")).toBeNull();
  });

  it("children remain visible after loader hides", () => {
    renderInRouter();
    act(() => { jest.advanceTimersByTime(1000); });
    expect(screen.getByTestId("child")).toBeTruthy();
  });

  it("wrapper div has relative class", () => {
    const { container } = renderInRouter();
    expect((container.firstChild as HTMLElement).classList.contains("relative")).toBe(true);
  });

  it("re-triggers loader on route change", () => {
    const NavigateTrigger = () => {
      const navigate = useNavigate();
      return <button data-testid="nav" onClick={() => navigate("/page-b")} />;
    };

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/page-a"]}>
          <Routes>
            <Route
              path="*"
              element={
                <PageWrapper>
                  <NavigateTrigger />
                </PageWrapper>
              }
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Loader shown on initial mount
    expect(container.querySelector(".absolute.inset-0.z-40")).not.toBeNull();
    act(() => { jest.advanceTimersByTime(1000); });
    expect(container.querySelector(".absolute.inset-0.z-40")).toBeNull();

    // Trigger navigation — location changes, loader re-appears
    act(() => { fireEvent.click(screen.getByTestId("nav")); });
    expect(container.querySelector(".absolute.inset-0.z-40")).not.toBeNull();
    act(() => { jest.advanceTimersByTime(1000); });
    expect(container.querySelector(".absolute.inset-0.z-40")).toBeNull();
  });

  it("clears timer on unmount before timeout fires", () => {
    const { container, unmount } = renderInRouter();
    expect(container.querySelector(".absolute.inset-0.z-40")).not.toBeNull();
    unmount();
    act(() => { jest.advanceTimersByTime(1000); });
    // No error thrown — timer was cleared cleanly
  });
});
