package com.sentinel.api.logs.dto.request;

import com.sentinel.api.common.query.CursorPaginationRequest;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@NoArgsConstructor
@Setter
@Getter
public class RequestLogListRequest extends CursorPaginationRequest {

    @NotNull(message = "serviceId is required")
    UUID serviceId;

    UUID endpointId;

    String search;

    String requestId;

}
