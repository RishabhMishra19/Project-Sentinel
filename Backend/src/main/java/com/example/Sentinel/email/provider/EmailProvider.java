package com.example.Sentinel.email.provider;

public interface EmailProvider {

    void send(String to, String subject, String html);

}
