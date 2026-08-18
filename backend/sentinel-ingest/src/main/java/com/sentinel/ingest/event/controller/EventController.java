package com.sentinel.ingest.event.controller;

import com.sentinel.ingest.common.response.ApiResponses;
import com.sentinel.ingest.event.dto.request.IngestEventsRequest;
import com.sentinel.ingest.event.service.EventFacade;
import com.sentinel.ingest.security.ServicePrincipal;
import com.sentinel.ingest.security.ServicePrincipalHolder;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/events")
public class EventController {

    private final EventFacade eventFacade;

    public EventController(EventFacade eventFacade) {
        this.eventFacade = eventFacade;
    }

    @PostMapping
    public ResponseEntity<Void> ingest(
            @Valid @RequestBody IngestEventsRequest body, HttpServletRequest request) {
        ServicePrincipal principal = ServicePrincipalHolder.require(request);
        eventFacade.ingest(principal.serviceId(), body);
        return ApiResponses.accepted();
    }
}
