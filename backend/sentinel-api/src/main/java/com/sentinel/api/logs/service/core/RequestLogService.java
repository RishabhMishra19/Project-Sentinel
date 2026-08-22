package com.sentinel.api.logs.service.core;

import com.sentinel.api.logs.dto.RequestLogCursorEncoder;
import com.sentinel.api.logs.dto.request.GetRequestLogsListRequest;
import com.sentinel.common.cassandra.paginator.CassandraService;
import com.sentinel.common.cassandra.requestlog.entity.RequestLog;

import java.util.Optional;
import java.util.UUID;

public interface RequestLogService extends CassandraService<RequestLog, GetRequestLogsListRequest, RequestLogCursorEncoder.RequestLogCursor> {

    Optional<RequestLog> getLogById(UUID tenantId, UUID serviceId, UUID requestLogId);

}
