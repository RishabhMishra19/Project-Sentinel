import { useContext } from "react";
import { LoadTestDataContext } from "../context/LoadTestDataContext";

export const useLoadContext = () => {
  const context = useContext(LoadTestDataContext);

  if (!context) {
    throw new Error(
      "useLoadTestData must be used inside LoadTestDataProvider",
    );
  }

  return context;
};