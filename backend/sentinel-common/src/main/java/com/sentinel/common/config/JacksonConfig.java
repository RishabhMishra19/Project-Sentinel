package com.sentinel.common.config;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.HdrHistogram.Histogram;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import java.nio.ByteBuffer;
import java.util.Base64;

@Configuration
public class JacksonConfig {

    // Serializes the histogram into a compressed, Base64-encoded string
    public static class JacksonHdrSerializer extends JsonSerializer<Histogram> {
        @Override
        public void serialize(Histogram value, JsonGenerator gen, SerializerProvider serializers) {
            try {
                if (value == null) {
                    gen.writeNull();
                    return;
                }
                ByteBuffer buffer = ByteBuffer.allocate(value.getEstimatedFootprintInBytes());
                int size = value.encodeIntoCompressedByteBuffer(buffer);
                byte[] bytes = new byte[size];
                System.arraycopy(buffer.array(), 0, bytes, 0, size);

                gen.writeString(Base64.getEncoder().encodeToString(bytes));
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
    }

    // Deserializes the Base64 string back into a Histogram object
    public static class JacksonHdrDeserializer extends JsonDeserializer<Histogram> {
        @Override
        public Histogram deserialize(JsonParser p, DeserializationContext ctxt) {
            try {
                String base64Str = p.getValueAsString();
                if (base64Str == null)
                    return null;

                byte[] bytes = Base64.getDecoder().decode(base64Str);
                return Histogram.decodeFromCompressedByteBuffer(ByteBuffer.wrap(bytes), 0);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
    }

    @Bean
    @Primary
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();

        // Java time types: Instant, LocalDateTime, LocalDate, etc.
        mapper.registerModule(new JavaTimeModule());

        // Serialize Instant as ISO-8601 UTC string instead of epoch number
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        // Histogram custom serialization
        SimpleModule histogramModule = new SimpleModule();

        histogramModule.addSerializer(
            Histogram.class,
            new JacksonHdrSerializer()
        );

        histogramModule.addDeserializer(
            Histogram.class,
            new JacksonHdrDeserializer()
        );

        mapper.registerModule(histogramModule);

        return mapper;
    }
}
