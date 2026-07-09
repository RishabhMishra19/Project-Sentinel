package com.example.Sentinel.resources.invitations.service.impl;

import com.example.Sentinel.common.exceptions.BadRequestException;
import com.example.Sentinel.common.exceptions.ResourceNotFoundException;
import com.example.Sentinel.common.security.TokenService;
import com.example.Sentinel.email.EmailTemplate;
import com.example.Sentinel.email.dto.request.EmailRequest;
import com.example.Sentinel.email.service.EmailService;
import com.example.Sentinel.resources.invitations.constants.InvitationErrorCodes;
import com.example.Sentinel.resources.invitations.entity.Invitation;
import com.example.Sentinel.resources.invitations.entity.InvitationStatus;
import com.example.Sentinel.resources.invitations.repository.InvitationRepository;
import com.example.Sentinel.resources.invitations.service.InvitationService;
import com.example.Sentinel.resources.orgs.entity.Org;
import com.example.Sentinel.resources.roles.entity.Role;
import com.example.Sentinel.resources.users.entity.repository.UserRepository;
import com.example.Sentinel.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InvitationServiceImpl implements InvitationService {

    private final InvitationRepository invitationRepository;
    private final EmailService emailService;
    private final TokenService tokenService;
    private final UserRepository userRepository;
    private final SecurityUtils securityUtils;

    @Value("${app.invitation-expiration}")
    private long invitationExpiration;

    @Override
    public Invitation createInvitation(String email,
                                       Org org,
                                       Role role) {
        invitationRepository.findByEmailAndStatus(email, InvitationStatus.PENDING)
                            .ifPresent(invitation -> {
                                if (invitation.getExpiresAt().isAfter(Instant.now())) {
                                    throw new BadRequestException(
                                            InvitationErrorCodes.ACTIVE_INVITATION_ALREADY_EXISTS,
                                            "An active invitation already exists."
                                    );
                                }
                            });

        String invitationToken = tokenService.generateToken();

        Instant now = Instant.now();

        Invitation invitation = Invitation.builder()
                                          .email(email)
                                          .org(org)
                                          .role(role)
                                          .hashedToken(tokenService.hash(invitationToken))
                                          .expiresAt(now.plusMillis(invitationExpiration))
                                          .status(InvitationStatus.PENDING)
                                          .build();

        invitationRepository.save(invitation);

        emailService.sendEmail(
                EmailRequest.builder()
                            .to(email)
                            .subject("You're invited to Sentinel")
                            .template(EmailTemplate.INVITATION)
                            .variables(Map.of(
                                    "invitationUrl",
                                    "frontendBaseUrl" + "/set-password?token=" + invitationToken,
                                    "organizationName", org.getName(),
                                    "roleName", role.getName()
                            ))
                            .build()
        );

        return invitation;
    }

    @Override
    public Invitation validateInvitation(String invitationToken) {
        String tokenHash = tokenService.hash(invitationToken);

        Invitation invitation = invitationRepository
                .findByTokenHash(tokenHash)
                .orElseThrow(() ->
                                     new ResourceNotFoundException(InvitationErrorCodes.INVITATION_NOT_FOUND,
                                             "Invitation not found."
                                     )
                );

        if (invitation.getStatus() == InvitationStatus.ACCEPTED) {
            throw new BadRequestException(
                    InvitationErrorCodes.INVITATION_ALREADY_ACCEPTED,
                    "Invitation already accepted."
            );
        }

        if (invitation.getStatus() == InvitationStatus.REVOKED) {
            throw new BadRequestException(
                    InvitationErrorCodes.INVITATION_REVOKED,
                    "Invitation has been revoked."
            );
        }

        if (invitation.getExpiresAt().isBefore(Instant.now())) {
            throw new BadRequestException(
                    InvitationErrorCodes.INVITATION_EXPIRED,
                    "Invitation has expired."
            );
        }

        return invitation;
    }

    @Override
    public void rejectInvitation(String invitationToken) {
        Invitation invitation = validateInvitation(invitationToken);
        invitation.setStatus(InvitationStatus.REJECTED);
        invitation.setUpdatedAt(Instant.now());
    }

    @Override
    public void revokeInvitation(UUID invitationId) {
        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(()->new ResourceNotFoundException(InvitationErrorCodes.INVITATION_NOT_FOUND, "Invitation not found."));

        if (invitation.getStatus() == InvitationStatus.REVOKED) {
            throw new BadRequestException(
                    InvitationErrorCodes.INVITATION_REVOKED,
                    "Invitation has already been revoked."
            );
        }

        if (invitation.getStatus() == InvitationStatus.ACCEPTED) {
            throw new BadRequestException(
                    InvitationErrorCodes.INVITATION_ALREADY_ACCEPTED,
                    "Accepted invitations cannot be revoked."
            );
        }

        invitation.setStatus(InvitationStatus.REVOKED);
        invitation.setUpdatedAt(Instant.now());
        invitation.setUpdatedBy(securityUtils.getCurrentUser().getId());

        invitationRepository.save(invitation);
    }

    @Override
    @Transactional
    public Invitation resendInvitation(UUID invitationId) {

        Invitation invitation = invitationRepository.findById(invitationId)
                                                    .orElseThrow(() -> new ResourceNotFoundException(
                                                            InvitationErrorCodes.INVITATION_NOT_FOUND,
                                                            "Invitation not found."
                                                    ));

        if (invitation.getStatus() == InvitationStatus.ACCEPTED) {
            throw new BadRequestException(
                    InvitationErrorCodes.INVITATION_ALREADY_ACCEPTED,
                    "Accepted invitations cannot be resent."
            );
        }

        if (invitation.getStatus() == InvitationStatus.REVOKED) {
            throw new BadRequestException(
                    InvitationErrorCodes.INVITATION_REVOKED,
                    "Revoked invitations cannot be resent."
            );
        }

        String invitationToken = tokenService.generateToken();

        invitation.setHashedToken(
                tokenService.hash(invitationToken)
        );

        invitation.setExpiresAt(
                Instant.now().plusMillis(invitationExpiration)
        );

        invitation.setStatus(InvitationStatus.PENDING);

        emailService.sendEmail(
                EmailRequest.builder()
                            .to(invitation.getEmail())
                            .subject("You're invited to Sentinel")
                            .template(EmailTemplate.INVITATION)
                            .variables(Map.of(
                                    "invitationUrl",
                                    "frontendBaseUrl" + "/set-password?token=" + invitationToken,
                                    "organizationName",
                                    invitation.getOrg().getName(),
                                    "roleName",
                                    invitation.getRole().getName()
                            ))
                            .build()
        );

        return invitation;
    }
}
