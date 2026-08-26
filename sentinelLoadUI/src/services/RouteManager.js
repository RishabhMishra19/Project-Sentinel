export class RouteManager {
  static getLoadDataListPage() {
    return '/load-test/data'
  }

  static getLoadTestDetailsPage(loadTestDataId) {
    return `/load-test/data/${loadTestDataId}`
  }

  static getLoadTestDashboardPage(loadTestDataId) {
    return `/load-test/data/${loadTestDataId}/dashboard`
  }
}