package com.sentinel.ingest.event.service;

import com.sentinel.ingest.event.dto.request.IngestEventsRequest;
import java.util.UUID;

public interface EventFacade {

    void ingest(UUID serviceId, IngestEventsRequest request);
}
