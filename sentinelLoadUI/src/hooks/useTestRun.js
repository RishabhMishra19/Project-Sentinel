import { ApiManager } from "../services/ApiManager";
import { useEffect, useState } from "react";

export const useTestRun = ({ loadTestDataId, disabled = false }) => {
  const [loadTestData, setLoadTestData] = useState(null);
  const [result, setResult] = useState({
    isLoading: true,
    errorMessage: ''
  })

  useEffect(() => {
    if (!disabled) {
      ApiManager.getLoadTestById(loadTestDataId)
        .then(result => {
          setLoadTestData(result.data);
          setResult(pval => ({ ...pval, isLoading: false, errorMessage: '' }))
        })
        .catch(error => setResult(pval => ({ ...pval, isLoading: false, errorMessage: error.message })))
    }
  }, [disabled])

  return {
    result,
    loadTestData
  }
}