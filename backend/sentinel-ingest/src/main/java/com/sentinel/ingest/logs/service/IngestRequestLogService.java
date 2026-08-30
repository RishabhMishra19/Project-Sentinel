package com.sentinel.ingest.logs.service;

import com.sentinel.ingest.logs.dto.request.IngestLogRequest;

public interface IngestRequestLogService {

    void ingest(IngestLogRequest request);

}
