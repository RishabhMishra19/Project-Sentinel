package com.sentinel.ingest.instance.controller;

import com.sentinel.ingest.common.response.ApiResponses;
import com.sentinel.ingest.instance.dto.response.InstanceResponse;
import com.sentinel.ingest.instance.service.InstanceFacade;
import com.sentinel.ingest.security.ServicePrincipal;
import com.sentinel.ingest.security.ServicePrincipalHolder;
import jakarta.servlet.http.HttpServletRequest;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/instances")
public class InstanceController {

    private final InstanceFacade instanceFacade;

    public InstanceController(InstanceFacade instanceFacade) {
        this.instanceFacade = instanceFacade;
    }

    @PostMapping
    public ResponseEntity<InstanceResponse> register(HttpServletRequest request) {
        ServicePrincipal principal = ServicePrincipalHolder.require(request);
        return ApiResponses.created(instanceFacade.register(principal.serviceId()));
    }

    @PostMapping("/{instanceId}/heartbeat")
    public ResponseEntity<Void> heartbeat(
            @PathVariable UUID instanceId, HttpServletRequest request) {
        ServicePrincipal principal = ServicePrincipalHolder.require(request);
        instanceFacade.heartbeat(instanceId, principal.serviceId());
        return ApiResponses.noContent();
    }
}
