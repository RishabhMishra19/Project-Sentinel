import { ApiManager } from "../services/ApiManager";
import { useEffect, useState } from "react";

export const useTestDataList = () => {
  const [result, setResult] = useState({
    isLoading: false,
    errorMessage: ''
  })

  const [loadDataList, setLoadDataList] = useState([]);

  useEffect(() => {
    ApiManager.getAllTestData()
      .then(result => {
        setLoadDataList(result.data);
        setResult(pval => ({ ...pval, isLoading: false, errorMessage: '' }))
      })
      .catch(error => setResult(pval => ({ ...pval, isLoading: false, errorMessage: error.message })))
  }, [])


  return {
    loadDataList,
    result
  }
}