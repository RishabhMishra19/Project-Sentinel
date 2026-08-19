package com.sentinel.api.logs.service;

import com.sentinel.api.logs.dto.request.GetRequestLogsListRequest;
import com.sentinel.api.logs.dto.response.RequestLogListResponse;
import com.sentinel.common.cassandra.dto.CursorPaginationResponse;

import java.util.UUID;

public interface RequestLogFacade {

    CursorPaginationResponse<RequestLogListResponse> getAll(GetRequestLogsListRequest request);

    RequestLogListResponse getById(UUID tenantId, UUID serviceId, UUID id);

}
