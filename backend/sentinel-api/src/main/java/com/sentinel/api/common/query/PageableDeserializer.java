package com.sentinel.api.common.query;

import org.springframework.boot.jackson.JacksonComponent;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import tools.jackson.core.JsonParser;
import tools.jackson.databind.DeserializationContext;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ValueDeserializer;

@JacksonComponent
public class PageableDeserializer extends ValueDeserializer<Pageable> {

    private static final int DEFAULT_PAGE = 0;
    private static final int DEFAULT_SIZE = 20;

    @Override
    public Pageable deserialize(JsonParser parser, DeserializationContext context) {
        JsonNode node = parser.readValueAsTree();
        if (node == null || node.isNull()) {
            return PageRequest.of(DEFAULT_PAGE, DEFAULT_SIZE);
        }
        int page = node.path("page").asInt(DEFAULT_PAGE);
        int size = node.path("size").asInt(DEFAULT_SIZE);
        if (page < 0) {
            page = DEFAULT_PAGE;
        }
        if (size < 1) {
            size = DEFAULT_SIZE;
        }
        return PageRequest.of(page, size);
    }
}
