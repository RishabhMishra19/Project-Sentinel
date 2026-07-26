package com.sentinel.server.logs.service;

import com.sentinel.server.common.query.ListQueryRequest;
import com.sentinel.server.common.response.PageResponse;
import com.sentinel.server.logs.dto.response.RequestLogResponse;
import java.util.UUID;

public interface RequestLogFacade {

    PageResponse<RequestLogResponse> list(UUID tenantId, ListQueryRequest query);

    RequestLogResponse getById(UUID tenantId, UUID id);
}
