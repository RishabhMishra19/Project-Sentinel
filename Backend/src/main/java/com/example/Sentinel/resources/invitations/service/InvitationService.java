package com.example.Sentinel.resources.invitations.service;

import com.example.Sentinel.resources.invitations.entity.Invitation;
import com.example.Sentinel.resources.orgs.entity.Org;
import com.example.Sentinel.resources.roles.entity.Role;

import java.util.UUID;

public interface InvitationService {

    Invitation createInvitation(String email, Org org, Role role);

    Invitation validateInvitation(String invitationToken);

    void rejectInvitation(String invitationToken);

    void revokeInvitation(UUID invitationId);

    Invitation resendInvitation(UUID invitationId);
}