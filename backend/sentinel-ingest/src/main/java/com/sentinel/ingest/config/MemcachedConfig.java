package com.sentinel.ingest.config;

import net.rubyeye.xmemcached.MemcachedClient;
import net.rubyeye.xmemcached.XMemcachedClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.List;

@Configuration
public class MemcachedConfig {

    @Bean
    public MemcachedClient memcachedClient(
        @Value("${sentinel.memcached.host}") String host,
        @Value("${sentinel.memcached.port}") int port) throws IOException {

        return new XMemcachedClientBuilder(
            List.of(new InetSocketAddress(host, port))
        ).build();
    }
}
