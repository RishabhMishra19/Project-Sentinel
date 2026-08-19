package com.sentinel.api.logs.dto.request;

import com.sentinel.api.common.query.CursorPaginationRequest;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@NoArgsConstructor
@Setter
@Getter
public class RequestLogListRequest extends CursorPaginationRequest {

    UUID endpointId;

    String search;

    String requestId;

}
