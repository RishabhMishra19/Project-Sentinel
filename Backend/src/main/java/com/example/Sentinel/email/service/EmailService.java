package com.example.Sentinel.email.service;

import com.example.Sentinel.email.dto.request.EmailRequest;

public interface EmailService {

    void sendEmail(EmailRequest emailRequest);

}
