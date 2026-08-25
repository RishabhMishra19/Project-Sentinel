package com.sentinel.common.postgresql.refreshToken.repository;

import com.sentinel.common.postgresql.refreshToken.entity.RefreshToken;
import com.sentinel.common.postgresql.refreshToken.entity.RefreshTokenStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {

    Optional<RefreshToken> findByTokenHashAndStatus(String tokenHash, RefreshTokenStatus status);

    List<RefreshToken> findByUserIdAndStatus(UUID userId, RefreshTokenStatus status);
}
