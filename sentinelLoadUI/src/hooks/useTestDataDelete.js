import { ApiManager } from "../services/ApiManager";
import { useState } from "react";

export const useTestDataDelete = (loadTestDataId, onSuccess) => {
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
        onSuccess();
      })
      .catch(error => setResult(pval => ({ ...pval, isLoading: false, errorMessage: error.message })));
  }

  return {
    handleDelete,
    result
  }
}