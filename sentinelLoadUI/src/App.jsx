import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoadTestDataListPage } from "./pages/LoadTestDataListPage";
import { PageWrapper } from "./components/PageWrapper";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PageWrapper />}>
                    <Route
                        index={true}
                        path="/load-test/data"
                        element={<LoadTestDataListPage />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
