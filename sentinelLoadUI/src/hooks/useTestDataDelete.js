import { ApiManager } from "../services/ApiManager";
import { useState } from "react";
import { useLoadContext } from "./useLoadContext";

export const useTestDataDelete = (loadTestDataId) => {
  const { setLoadTestData } = useLoadContext();
  const [result, setResult] = useState({
    isLoading: false,
    errorMessage: ''
  })

  const handleDelete = (e) => {
    e.preventDefault();
    if (
      !window.confirm(
        "Are you sure you want to delete this test and its related records?",
      )
    ) {
      return;
    }

    setResult(pval => ({ ...pval, isLoading: true }))
    ApiManager.deleteLoadTestById(loadTestDataId)
      .then(() => {
        setResult(pval => ({ ...pval, isLoading: false, errorMessage: '' }));
        ApiManager.getAllTestData().then(setLoadTestData)
      })
      .finally(() => setResult(pval => ({ ...pval, isLoading: false })))
  }

  return {
    handleDelete,
    result
  }
}