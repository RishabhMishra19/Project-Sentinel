package com.sentinel.api.logs.service;

import com.sentinel.api.logs.dto.RequestLogCursorEncoder;
import com.sentinel.api.logs.dto.request.GetRequestLogsListRequest;
import com.sentinel.api.logs.service.core.RequestLogService;
import com.sentinel.common.cassandra.CassandraPaginator;
import com.sentinel.common.observability.entity.RequestLog;
import org.springframework.stereotype.Component;

@Component
public class RequestLogCassandraPaginator extends CassandraPaginator<RequestLog, GetRequestLogsListRequest,
        RequestLogCursorEncoder.RequestLogCursor> {

    public RequestLogCassandraPaginator(
            RequestLogService requestLogService,
            RequestLogCursorEncoder requestLogCursorEncoder) {

        super(requestLogService, requestLogCursorEncoder);
    }
}
