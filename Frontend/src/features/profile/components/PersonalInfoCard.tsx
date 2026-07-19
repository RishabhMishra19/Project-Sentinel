import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { InfoRow } from "./InfoRow";
import type { CurrentUser } from "@/features/auth/dto/response/AuthResponse";
import { formatDate } from "@/lib/utils";

interface Props {
  user: CurrentUser;
}

export function PersonalInfoCard({ user }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <InfoRow label="Name" value={user.name} />

        <InfoRow label="Email" value={user.email} />

        <InfoRow
          label="Email Verified"
          value={
            <Badge variant={user.emailVerified ? "default" : "destructive"}>
              {user.emailVerified ? "Verified" : "Not Verified"}
            </Badge>
          }
        />

        <InfoRow label="Member Since" value={formatDate({ date: user.createdAt, type: "DATE" })} />

        <InfoRow
          label="Last Login"
          value={formatDate({ date: user.lastLoginAt, type: "DATETIME" })}
        />
      </CardContent>
    </Card>
  );
}
