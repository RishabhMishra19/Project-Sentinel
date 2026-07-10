package com.example.Sentinel.resources.invitations.constants;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class InvitationErrorCodes {

    public static final String INVITATION_NOT_FOUND = "IEC_001";
    public static final String INVITATION_ALREADY_ACCEPTED = "IEC_002";
    public static final String INVITATION_REVOKED = "IEC_003";
    public static final String INVITATION_EXPIRED = "IEC_004";
    public static final String ACTIVE_INVITATION_ALREADY_EXISTS = "IEC_005";
}
