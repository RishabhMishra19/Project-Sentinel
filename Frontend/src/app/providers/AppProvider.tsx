import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import QueryProvider from "./QueryProvider";
import { store } from "../store/store";

interface AppProviderProps {
  children: React.ReactNode;
}

export default function AppProvider({ children }: AppProviderProps) {
  return (
    <ReduxProvider store={store}>
      <QueryProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </QueryProvider>
    </ReduxProvider>
  );
}
