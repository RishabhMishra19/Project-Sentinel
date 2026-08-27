package com.sentinel.common.cassandra;

import com.datastax.oss.driver.api.core.CqlSession;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.cassandra.core.AsyncCassandraTemplate;

@Configuration
public class CassandraAsyncConfig {

    @Bean
    public AsyncCassandraTemplate asyncCassandraTemplate(CqlSession cqlSession) {
        return new AsyncCassandraTemplate(cqlSession);
    }

}
