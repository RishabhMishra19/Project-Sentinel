package com.example.Sentinel.security;

import com.example.Sentinel.common.constants.CommonErrorCodes;
import com.example.Sentinel.common.exceptions.UnauthorizedException;
import com.example.Sentinel.security.userDetails.CustomUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {

    public CustomUserDetails getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails user)) {
            throw new UnauthorizedException(CommonErrorCodes.USER_UNAUTHENTICATED, "User is not authenticated.");
        }

        return user;
    }
}