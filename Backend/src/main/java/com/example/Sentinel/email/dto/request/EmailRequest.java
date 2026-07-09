package com.example.Sentinel.email.dto.request;

import com.example.Sentinel.email.EmailTemplate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailRequest {

    private String to;

    private String subject;

    private EmailTemplate template;

    private Map<String, Object> variables;
}
