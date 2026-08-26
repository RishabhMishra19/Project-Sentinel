import { AxiosClient } from "./AxiosClient";

export class ApiManager {
    static generateTestData(payload) {
        return AxiosClient.post("/data", payload)
    }

    static getAllTestData() {
        return AxiosClient.get("/data")
    }

    static getLoadTestById(loadTestId) {
        return AxiosClient.get(`/data/${loadTestId}`)
    }

    static startLoadTestById(loadTestId, payload) {
        return AxiosClient.post(`/data/${loadTestId}/start`, payload)
    }

    static stopLoadTestById(loadTestId) {
        return AxiosClient.post(`/data/${loadTestId}/stop`)
    }

    static deleteLoadTestById(loadTestId) {
        return AxiosClient.delete(`/data/${loadTestId}`)
    }
}