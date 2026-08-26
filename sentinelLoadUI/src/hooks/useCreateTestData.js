import { ApiManager } from "../services/ApiManager";
import { useState } from "react";
import { useLoadContext } from "./useLoadContext";

export const useCreateTestData = ({ onSuccess }) => {
  const { setSelectedLoadTestId, setLoadTestData } = useLoadContext();

  const [result, setResult] = useState({
    isLoading: false,
    errorMessage: ''
  })

  const [loadData, setLoadData] = useState({
    name: "load-test-01",
    tenantCount: 5,
    productsPerTenant: 5,
    servicesPerProduct: 4,
    endpointsPerService: 10,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoadData(pval => ({ ...pval, [name]: value }))
  }

  const handleCreate = (e) => {
    e.preventDefault();
    setResult(pval => ({ ...pval, isLoading: true }))
    ApiManager.generateTestData(loadData)
      .then(id => {
        ApiManager.getAllTestData().then(setLoadTestData).finally(() => {
          setSelectedLoadTestId(id)
          onSuccess()
        })
      })
      .finally(() => setResult(pval => ({ ...pval, isLoading: false })))
  }

  return {
    loadData,
    handleChange,
    handleCreate,
    result
  }
}