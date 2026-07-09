package com.example.Sentinel.resources.invitations.repository;

import com.example.Sentinel.resources.invitations.entity.Invitation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface InvitationRepository extends JpaRepository<Invitation, UUID> {}
