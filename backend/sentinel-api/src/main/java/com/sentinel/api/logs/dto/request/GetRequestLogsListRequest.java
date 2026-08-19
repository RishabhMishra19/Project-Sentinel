package com.sentinel.api.logs.dto.request;

import com.sentinel.common.cassandra.dto.CursorPaginationRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
public class GetRequestLogsListRequest extends CursorPaginationRequest {

    private UUID tenantId;
    private UUID serviceId;
}
