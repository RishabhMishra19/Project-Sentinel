import { useState } from "react";
import { LoadTestDataContext } from "./LoadTestDataContext";

export const LoadTestDataProvider = ({ children }) => {
    const [data, setData] = useState({
        isLoading: true,
        loadTests: [],
        selectedLoadTestId: null,
    });

    const setLoadTestData = (loadTests) => {
        setData((pval) => ({ ...pval, isLoading: false, loadTests }));
    };

    const getLoadTest = (loadTestId) => {
        return data.loadTests.find((loadTest) => loadTest.id === loadTestId);
    };

    const setSelectedLoadTestId = (selectedLoadTestId) => {
        setData((pval) => ({ ...pval, selectedLoadTestId }));
    };

    return (
        <LoadTestDataContext.Provider
            value={{
                isLoading: data.isLoading,
                loadTests: data.loadTests,
                selectedLoadTestId: data.selectedLoadTestId,
                setLoadTestData,
                getLoadTest,
                setSelectedLoadTestId,
            }}
        >
            {children}
        </LoadTestDataContext.Provider>
    );
};
