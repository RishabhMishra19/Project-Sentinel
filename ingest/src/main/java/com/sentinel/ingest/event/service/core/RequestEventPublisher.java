package com.sentinel.ingest.event.service.core;

import com.sentinel.common.kafka.RequestEventMessage;
import java.util.List;

public interface RequestEventPublisher {

    void publish(List<RequestEventMessage> messages);
}
