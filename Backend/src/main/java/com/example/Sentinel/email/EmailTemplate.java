package com.example.Sentinel.email;

import lombok.Getter;

@Getter
public enum EmailTemplate {
    INVITATION("email/invitation.html"),
    PASSWORD_RESET("email/password-reset.html"),
    WELCOME("email/welcome.html");

    private final String path;

    EmailTemplate(String path) {
        this.path = path;
    }

}
