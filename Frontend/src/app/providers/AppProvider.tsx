import {ReactNode} from "react";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";

import QueryProvider from "./QueryProvider";
import {store} from "../store/store";

interface AppProviderProps {
    children: ReactNode;
}

export default function AppProvider({
                                        children,
                                    }: AppProviderProps) {
    return (
        <Provider store={store}>
            <QueryProvider>
                <BrowserRouter>
                    {children}
                </BrowserRouter>
            </QueryProvider>
        </Provider>
    );
}