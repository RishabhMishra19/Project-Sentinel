package com.sentinel.common.analytics;

public class AnalyticsUtils {

    public static String getTableName(AnalyticsScope scope,  AnalyticsBucket bucket) {
        return "analytics_" + scope.getName() + "_stats_" + bucket.getName();
    }

    public static String getIdColumnName(AnalyticsScope scope){
        return scope.getName() + "_id";
    }

}
