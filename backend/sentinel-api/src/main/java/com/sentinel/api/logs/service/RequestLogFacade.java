package com.sentinel.api.logs.service;

import com.sentinel.api.common.query.ListQueryRequest;
import com.sentinel.api.common.response.PageResponse;
import com.sentinel.api.logs.dto.response.RequestLogResponse;
import java.util.UUID;

public interface RequestLogFacade {

    PageResponse<RequestLogResponse> list(UUID tenantId, ListQueryRequest query);

    RequestLogResponse getById(UUID tenantId, UUID id);
}
