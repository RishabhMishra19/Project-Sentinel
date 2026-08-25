package com.sentinel.api.security;

import com.sentinel.api.auth.service.core.JwtService;
import com.sentinel.api.common.exception.AccessTokenExpiredException;
import com.sentinel.api.common.exception.ErrorCode;
import com.sentinel.common.postgresql.permission.PermissionType;
import com.sentinel.common.postgresql.role.RoleScopeStatus;
import com.sentinel.common.postgresql.role.RoleStatus;
import com.sentinel.common.postgresql.user.User;
import com.sentinel.api.user.service.core.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserService userService;

    private static void rejectAccessTokenExpired(HttpServletResponse response) throws IOException {
        ErrorCode code = ErrorCode.ACCESS_TOKEN_EXPIRED;
        response.setStatus(code.getStatus().value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter()
            .write("{\"errorCode\":\""
                + code.name()
                + "\",\"error\":\""
                + code.getReason()
                + "\",\"message\":\"Invalid or expired access token\"}");
    }

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
                List<ScopeGrant> scopeGrants = new ArrayList<>();
                if (user.isSentinelAdmin()) {
                    authorities.add(new SimpleGrantedAuthority("ROLE_SENTINEL_ADMIN"));
                    authorities.add(new SimpleGrantedAuthority(PermissionType.ALL.name()));
                }
                user.getRoles().stream()
                    .filter(role -> role.getStatus() == RoleStatus.ACTIVE)
                    .forEach(role -> {
                        authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getName()));
                        role.getRoleScopes().stream()
                            .filter(scope -> scope.getStatus() == RoleScopeStatus.ACTIVE)
                            .forEach(scope -> {
                                authorities.add(new SimpleGrantedAuthority(
                                    scope.getPermission().name()));
                                scopeGrants.add(new ScopeGrant(
                                    scope.getScopeType(),
                                    scope.getScopeId(),
                                    scope.getPermission()));
                            });
                    });
                UserPrincipal principal = new UserPrincipal(
                    user.getId(),
                    user.getEmail(),
                    user.getStatus(),
                    user.isSentinelAdmin(),
                    user.isTenantAdmin(),
                    user.getTenant() != null ? user.getTenant().getId() : null,
                    null,
                    scopeGrants,
                    authorities);
                UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(principal, null, authorities);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (AccessTokenExpiredException ex) {
                SecurityContextHolder.clearContext();
                rejectAccessTokenExpired(response);
                return;
            } catch (RuntimeException ignored) {
                SecurityContextHolder.clearContext();
            }
        }
        filterChain.doFilter(request, response);
    }
}
