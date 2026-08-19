package com.sentinel.api.logs.service;

import com.sentinel.api.common.response.CursorPaginationResponse;
import com.sentinel.api.logs.dto.request.RequestLogListRequest;
import com.sentinel.api.logs.dto.response.RequestLogListResponse;

import java.util.UUID;

public interface RequestLogFacade {

    CursorPaginationResponse<RequestLogListResponse> getAll(UUID tenantId, UUID serviceId, RequestLogListRequest request);

    RequestLogListResponse getById(UUID tenantId, UUID serviceId, UUID id);

}
