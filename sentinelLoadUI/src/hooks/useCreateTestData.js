import { useNavigate } from "react-router-dom";
import { ApiManager } from "../services/ApiManager";
import { useState } from "react";
import { RouteManager } from "../services/RouteManager";

export const useCreateTestData = () => {
  const navigate = useNavigate();

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
      .then(result => {
        setResult(pval => ({ ...pval, isLoading: false, errorMessage: '' }));
        navigate(RouteManager.getLoadTestDetailsPage(result.data));
      })
      .catch(error => setResult(pval => ({ ...pval, isLoading: false, errorMessage: error.message })));
  }

  return {
    loadData,
    handleChange,
    handleCreate,
    result
  }
}