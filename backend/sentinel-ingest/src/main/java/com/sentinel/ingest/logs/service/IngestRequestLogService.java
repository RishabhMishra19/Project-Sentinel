package com.sentinel.ingest.logs.service;

import com.sentinel.ingest.logs.dto.request.IngestLogRequest;
import com.sentinel.ingest.logs.dto.response.IngestLogResponse;

public interface IngestRequestLogService {

    IngestLogResponse ingest(IngestLogRequest request);

}
