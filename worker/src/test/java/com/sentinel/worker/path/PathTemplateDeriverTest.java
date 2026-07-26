package com.sentinel.worker.path;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class PathTemplateDeriverTest {

    private final PathTemplateDeriver deriver = new PathTemplateDeriver();

    @Test
    void replacesNumericAndUuidSegments() {
        String template = deriver.derive(
                "/orders/42/items/a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11");
        assertEquals("/orders/{id}/items/{id}", template);
    }

    @Test
    void ignoresQueryAndFragment() {
        assertEquals("/orders/{id}", deriver.derive("/orders/42?status=open&page=2"));
        assertEquals("/orders/{id}", deriver.derive("/orders/42#section"));
    }

    @Test
    void normalizesLeadingSlashAndMethod() {
        assertEquals("/users/{id}", deriver.derive("users/7"));
        assertEquals("POST", deriver.normalizeMethod("post"));
        assertEquals("/", deriver.derive(""));
    }
}
