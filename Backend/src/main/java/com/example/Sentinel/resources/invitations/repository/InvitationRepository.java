package com.example.Sentinel.resources.invitations.repository;

import com.example.Sentinel.resources.invitations.entity.Invitation;
import com.example.Sentinel.resources.invitations.entity.InvitationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface InvitationRepository extends JpaRepository<Invitation, UUID> {

    Optional<Invitation> findByTokenHash(String tokenHash);

    Optional<Invitation> findByEmailAndStatus(String email, InvitationStatus status);

}
