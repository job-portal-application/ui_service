import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import loaderReducer, { showLoader, hideLoader } from '../redux/slices/loaderSlice';
import authReducer from '../redux/slices/authSlice';
import userReducer from '../redux/slices/userSlice';
import App from '../App';

jest.useFakeTimers();

jest.mock('../components/Navbar', () => () => <div data-testid="navbar" />);
jest.mock('../components/Footer', () => () => <div data-testid="footer" />);
jest.mock('../routes/AppRouters', () => () => <div data-testid="approutes" />);
jest.mock('../components/PageWrapper', () => ({ children }: { children: React.ReactNode }) => (
  <div data-testid="pagewrapper">{children}</div>
));
jest.mock('react-hot-toast', () => ({
  Toaster: () => <div data-testid="toaster" />,
}));
jest.mock('../components/Loader', () => () => <div data-testid="loader" />);

const makeStore = (loaderState?: { loading: boolean; mode: string }) =>
  configureStore({
    reducer: { loader: loaderReducer, auth: authReducer, user: userReducer },
    ...(loaderState ? { preloadedState: { loader: loaderState } } : {}),
  });

const renderApp = (store = makeStore()) =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </Provider>
  );

beforeEach(() => {
  window.matchMedia = jest.fn().mockReturnValue({ matches: false });
  jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.clearAllTimers();
});

describe('App', () => {
  it('renders Navbar, Footer, AppRoutes, PageWrapper and Toaster', () => {
    renderApp();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('approutes')).toBeInTheDocument();
    expect(screen.getByTestId('pagewrapper')).toBeInTheDocument();
    expect(screen.getByTestId('toaster')).toBeInTheDocument();
  });

  it('renders .content wrapper div', () => {
    const { container } = renderApp();
    expect(container.querySelector('.content')).toBeInTheDocument();
  });

  it('does not render Loader when initialLoading is false (default)', () => {
    renderApp();
    // initialLoading starts false, so layout renders instead of Loader
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
  });

  it('dispatches showLoader("full") on mount', () => {
    const store = makeStore();
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    renderApp(store);
    expect(dispatchSpy).toHaveBeenCalledWith(showLoader('full'));
  });

  it('dispatches showLoader("content") for navigation effect on mount', () => {
    const store = makeStore();
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    renderApp(store);
    expect(dispatchSpy).toHaveBeenCalledWith(showLoader('content'));
  });

  it('dispatches hideLoader after 1500ms (full loader effect)', () => {
    const store = makeStore();
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    renderApp(store);
    act(() => { jest.advanceTimersByTime(1500); });
    expect(dispatchSpy).toHaveBeenCalledWith(hideLoader());
  });

  it('dispatches hideLoader after 800ms (navigation loader effect)', () => {
    const store = makeStore();
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    renderApp(store);
    act(() => { jest.advanceTimersByTime(800); });
    expect(dispatchSpy).toHaveBeenCalledWith(hideLoader());
  });

  it('initialLoading timer (30s) clears without error', () => {
    renderApp();
    expect(() => {
      act(() => { jest.advanceTimersByTime(30000); });
    }).not.toThrow();
  });

  it('unmount clears all timers without error', () => {
    const { unmount } = renderApp();
    expect(() => {
      unmount();
      act(() => { jest.advanceTimersByTime(30000); });
    }).not.toThrow();
  });

  it('full loader timer does not fire after unmount', () => {
    const store = makeStore();
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const { unmount } = renderApp(store);
    unmount();
    const callCount = dispatchSpy.mock.calls.length;
    act(() => { jest.advanceTimersByTime(1500); });
    expect(dispatchSpy.mock.calls.length).toBe(callCount);
  });

  it('navigation loader timer does not fire after unmount', () => {
    const store = makeStore();
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const { unmount } = renderApp(store);
    unmount();
    const callCount = dispatchSpy.mock.calls.length;
    act(() => { jest.advanceTimersByTime(800); });
    expect(dispatchSpy.mock.calls.length).toBe(callCount);
  });

  it('renders correctly when store loading=true', () => {
    renderApp(makeStore({ loading: true, mode: 'full' }));
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('renders correctly when store loading=false', () => {
    renderApp(makeStore({ loading: false, mode: 'full' }));
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('renders correctly when store mode=content', () => {
    renderApp(makeStore({ loading: true, mode: 'content' }));
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('all timers advance to 30000ms without state update errors', () => {
    renderApp();
    expect(() => {
      act(() => { jest.advanceTimersByTime(30000); });
    }).not.toThrow();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });
});
