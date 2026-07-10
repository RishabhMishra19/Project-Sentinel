package com.example.Sentinel.email.provider.impl;

import com.example.Sentinel.email.provider.EmailProvider;
import org.springframework.stereotype.Component;

@Component
public class SmtpEmailProvider implements EmailProvider {

    @Override
    public void send(String to, String subject, String html) {

    }
}
