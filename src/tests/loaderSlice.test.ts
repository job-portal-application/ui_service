import reducer, { showLoader, hideLoader } from "../redux/slices/loaderSlice";

const initialState = { loading: false, mode: "full" };

describe("loaderSlice", () => {
  it("returns initial state when called with undefined", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toEqual(initialState);
  });

  it("showLoader sets loading to true with default mode 'full' when no payload", () => {
    const state = reducer(initialState, showLoader(undefined));
    expect(state.loading).toBe(true);
    expect(state.mode).toBe("full");
  });

  it("showLoader sets loading to true with provided mode payload", () => {
    const state = reducer(initialState, showLoader("partial"));
    expect(state.loading).toBe(true);
    expect(state.mode).toBe("partial");
  });

  it("showLoader uses payload over default when payload is a non-empty string", () => {
    const state = reducer(initialState, showLoader("inline"));
    expect(state.mode).toBe("inline");
  });

  it("showLoader falls back to 'full' when payload is empty string (falsy)", () => {
    const state = reducer(initialState, showLoader(""));
    expect(state.mode).toBe("full");
  });

  it("showLoader falls back to 'full' when payload is null (falsy)", () => {
    const state = reducer(initialState, showLoader(null));
    expect(state.mode).toBe("full");
  });

  it("hideLoader sets loading to false", () => {
    const loadingState = { loading: true, mode: "partial" };
    const state = reducer(loadingState, hideLoader());
    expect(state.loading).toBe(false);
  });

  it("hideLoader preserves existing mode", () => {
    const loadingState = { loading: true, mode: "partial" };
    const state = reducer(loadingState, hideLoader());
    expect(state.mode).toBe("partial");
  });

  it("showLoader then hideLoader returns loading false", () => {
    let state = reducer(initialState, showLoader("full"));
    state = reducer(state, hideLoader());
    expect(state.loading).toBe(false);
  });

  it("showLoader action has correct type", () => {
    expect(showLoader("full").type).toBe("loader/showLoader");
  });

  it("hideLoader action has correct type", () => {
    expect(hideLoader().type).toBe("loader/hideLoader");
  });
});
