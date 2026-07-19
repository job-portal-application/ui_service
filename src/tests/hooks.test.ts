import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createElement } from 'react';
import { store } from '../redux/store';
import type { Rootstate } from '../redux/store';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

const wrapper = ({ children }: { children: React.ReactNode }) =>
  createElement(Provider, { store, children });

describe('useAppDispatch', () => {
  it('returns a function', () => {
    const { result } = renderHook(() => useAppDispatch(), { wrapper });
    expect(typeof result.current).toBe('function');
  });

  it('returns the store dispatch', () => {
    const { result } = renderHook(() => useAppDispatch(), { wrapper });
    expect(result.current).toBe(store.dispatch);
  });
});

describe('useAppSelector', () => {
  it('selects full state', () => {
    const { result } = renderHook(() => useAppSelector((state: Rootstate) => state), { wrapper });
    expect(result.current).toEqual(store.getState());
  });

  it('selects auth slice', () => {
    const { result } = renderHook(() => useAppSelector((state: Rootstate) => state.auth), { wrapper });
    expect(result.current).toEqual(store.getState().auth);
  });

  it('selects loader slice', () => {
    const { result } = renderHook(() => useAppSelector((state: Rootstate) => state.loader), { wrapper });
    expect(result.current).toEqual(store.getState().loader);
  });

  it('selects user slice', () => {
    const { result } = renderHook(() => useAppSelector((state: Rootstate) => state.user), { wrapper });
    expect(result.current).toEqual(store.getState().user);
  });
});
