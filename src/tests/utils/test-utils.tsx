import React, {type PropsWithChildren} from "react";
import {render} from "@testing-library/react";
import type {RenderOptions} from "@testing-library/react";
import {Provider} from "react-redux";
import {setupStore, type AppStore, type RootState} from "@/store/store";

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  function Wrapper({children}: PropsWithChildren<unknown>): React.JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }
  return {store, ...render(ui, {wrapper: Wrapper, ...renderOptions})};
}
