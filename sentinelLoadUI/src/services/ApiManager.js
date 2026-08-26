import { AxiosClient } from "./AxiosClient";

export class ApiManager {
    static generateTestData(payload) {
        return AxiosClient.post("/data", payload)
            .then(result => result.data)
            .catch(error => alert(error.message))
    }

    static getAllTestData() {
        return AxiosClient.get("/data")
            .then(result => result.data)
            .catch(error => alert(error.message))
    }

    static getLoadTestById(loadTestId) {
        return AxiosClient.get(`/data/${loadTestId}`)
            .then(result => result.data)
            .catch(error => alert(error.message))
    }

    static startLoadTestById(loadTestId, payload) {
        return AxiosClient.post(`/data/${loadTestId}/start`, payload)
            .then(result => result.data)
            .catch(error => alert(error.message))
    }

    static stopLoadTestById(loadTestId) {
        return AxiosClient.post(`/data/${loadTestId}/stop`)
            .then(result => result.data)
            .catch(error => alert(error.message))
    }

    static deleteLoadTestById(loadTestId) {
        return AxiosClient.delete(`/data/${loadTestId}`)
            .then(result => result.data)
            .catch(error => alert(error.message))
    }
}