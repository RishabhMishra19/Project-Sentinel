package com.sentinel.common.observability.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.cassandra.core.cql.PrimaryKeyType;
import org.springframework.data.cassandra.core.mapping.Column;
import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.PrimaryKeyClass;
import org.springframework.data.cassandra.core.mapping.PrimaryKeyColumn;
import org.springframework.data.cassandra.core.mapping.Table;

import java.util.UUID;

@Table("endpoint_lookup")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class EndpointLookup {
    @PrimaryKey
    private PrimaryKeyComposite id;

    @Column("endpoint_id")
    private UUID endpointId;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @PrimaryKeyClass
    public static class PrimaryKeyComposite {

        @PrimaryKeyColumn(
                name = "service_id",
                type = PrimaryKeyType.PARTITIONED
        )
        private UUID serviceId;

        @PrimaryKeyColumn(
                name = "method",
                type = PrimaryKeyType.CLUSTERED
        )
        private String method;

        @PrimaryKeyColumn(
                name = "path_template",
                type = PrimaryKeyType.CLUSTERED
        )
        private String pathTemplate;
    }
}
