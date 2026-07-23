package com.sentinel.server.security;

import com.sentinel.server.auth.service.core.JwtService;
import com.sentinel.server.permission.entity.PermissionStatus;
import com.sentinel.server.role.entity.RoleStatus;
import com.sentinel.server.user.entity.User;
import com.sentinel.server.user.service.core.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserService userService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                UUID userId = jwtService.parseUserId(token);
                User user = userService.findByIdWithAuthorities(userId);
                List<SimpleGrantedAuthority> authorities = new ArrayList<>();
                user.getRoles().stream()
                        .filter(role -> role.getStatus() == RoleStatus.ACTIVE)
                        .forEach(role -> {
                            authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getName()));
                            role.getPermissions().stream()
                                    .filter(permission -> permission.getStatus() == PermissionStatus.ACTIVE)
                                    .forEach(permission ->
                                            authorities.add(new SimpleGrantedAuthority(permission.getName())));
                        });
                UserPrincipal principal =
                        new UserPrincipal(user.getId(), user.getEmail(), user.getStatus(), authorities);
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(principal, null, authorities);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (RuntimeException ignored) {
                SecurityContextHolder.clearContext();
            }
        }
        filterChain.doFilter(request, response);
    }
}
