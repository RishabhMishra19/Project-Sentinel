package com.example.Sentinel.invitation.repository;

import com.example.Sentinel.invitation.entity.Invitation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface InvitationRepository extends JpaRepository<Invitation, UUID> {

    Optional<Invitation> findByHashedToken(String hashedToken);

    boolean existsByHashedToken(String hashedToken);

}
