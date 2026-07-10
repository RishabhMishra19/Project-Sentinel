package com.example.Sentinel.email.service.impl;

import com.example.Sentinel.email.EmailTemplate;
import com.example.Sentinel.email.dto.request.EmailRequest;
import com.example.Sentinel.email.provider.EmailProvider;
import com.example.Sentinel.email.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final EmailProvider emailProvider;

    @Override
    public void sendEmail(EmailRequest request) {
        String html = buildHtml(request);

        emailProvider.send(request.getTo(), request.getSubject(), html);
    }

    private String buildHtml(EmailRequest request) {

        String html = loadTemplate(request.getTemplate());

        for (Map.Entry<String, Object> entry : request.getVariables().entrySet()) {

            html = html.replace("{{" + entry.getKey() + "}}", String.valueOf(entry.getValue()));
        }

        return html;
    }

    private String loadTemplate(EmailTemplate template) {

        try (InputStream inputStream = new ClassPathResource(template.getPath()).getInputStream()) {

            return new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);

        } catch (IOException ex) {
            throw new IllegalStateException("Unable to load email template: " + template.getPath(), ex);
        }
    }
}
