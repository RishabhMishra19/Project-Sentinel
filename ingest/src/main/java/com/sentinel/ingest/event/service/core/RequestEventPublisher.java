package com.sentinel.ingest.event.service.core;

import com.sentinel.ingest.event.dto.RequestEventMessage;
import java.util.List;

public interface RequestEventPublisher {

    void publish(List<RequestEventMessage> messages);
}
