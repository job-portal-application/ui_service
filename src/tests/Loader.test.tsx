import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import loaderReducer from "../redux/slices/loaderSlice";
import Loader from "../components/Loader";

const renderWithStore = (mode: string) => {
  const store = configureStore({
    reducer: { loader: loaderReducer },
    preloadedState: { loader: { loading: true, mode } },
  });
  return render(
    <Provider store={store}>
      <Loader />
    </Provider>
  );
};

const hasClasses = (el: HTMLElement, ...classes: string[]) =>
  classes.every((c) => el.classList.contains(c));

describe("Loader", () => {
  it("renders full-screen overlay when mode is 'full'", () => {
    const { container } = renderWithStore("full");
    const overlay = container.firstChild as HTMLElement;
    expect(hasClasses(overlay, "fixed", "inset-0", "z-50")).toBe(true);
  });

  it("renders content overlay when mode is 'content'", () => {
    const { container } = renderWithStore("content");
    const overlay = container.firstChild as HTMLElement;
    expect(hasClasses(overlay, "absolute", "inset-0", "z-40")).toBe(true);
  });

  it("renders null when mode is neither 'full' nor 'content'", () => {
    const { container } = renderWithStore("none");
    expect(container.firstChild).toBeNull();
  });

  it("full mode spinner has animate-spin class", () => {
    const { container } = renderWithStore("full");
    const spinner = container.querySelector(".animate-spin") as HTMLElement;
    expect(hasClasses(spinner, "w-20", "h-20", "border-4", "rounded-full")).toBe(true);
  });

  it("content mode spinner has animate-spin class", () => {
    const { container } = renderWithStore("content");
    const spinner = container.querySelector(".animate-spin") as HTMLElement;
    expect(hasClasses(spinner, "w-20", "h-20", "border-4", "rounded-full")).toBe(true);
  });

  it("full mode overlay has flex centering", () => {
    const { container } = renderWithStore("full");
    const overlay = container.firstChild as HTMLElement;
    expect(hasClasses(overlay, "flex", "items-center", "justify-center")).toBe(true);
  });

  it("content mode overlay has flex centering", () => {
    const { container } = renderWithStore("content");
    const overlay = container.firstChild as HTMLElement;
    expect(hasClasses(overlay, "flex", "items-center", "justify-center")).toBe(true);
  });
});
