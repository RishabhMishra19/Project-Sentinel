package com.sentinel.ingest.event.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;

public record IngestEventsRequest(
        @NotEmpty @Size(max = 500) List<@Valid IngestEventItem> events) {}
