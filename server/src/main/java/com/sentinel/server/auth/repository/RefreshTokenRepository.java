package com.sentinel.server.auth.repository;

import com.sentinel.server.auth.entity.RefreshToken;
import com.sentinel.server.auth.entity.RefreshTokenStatus;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {

    Optional<RefreshToken> findByTokenHashAndStatus(String tokenHash, RefreshTokenStatus status);

    List<RefreshToken> findByUserIdAndStatus(UUID userId, RefreshTokenStatus status);
}
