import { createContext } from "react";

export const LoadTestDataContext = createContext({
    isLoading: true,
    loadTests: [],
    setLoadTestData: (loadTests) => console.log(loadTests),
    getLoadTest: (loadTestDataId) => (loadTestDataId ? {} : null),
    selectedLoadTestId: null,
    setSelectedLoadTestId: (loadTestDataId) => console.log(loadTestDataId),
});
