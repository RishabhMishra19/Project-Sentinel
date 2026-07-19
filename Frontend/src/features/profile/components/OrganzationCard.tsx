import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { InfoRow } from "./InfoRow";
import type { CurrentUser } from "@/features/auth/dto/response/AuthResponse";

interface Props {
  user: CurrentUser;
}

export function OrganizationCard({ user }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <InfoRow label="Organization" value={user.orgName} />

        <div className="space-y-2 pt-2">
          <div className="text-sm text-muted-foreground">Roles</div>

          <div className="flex flex-wrap gap-2">
            {user.roles.map((role) => (
              <Badge key={role} variant="secondary">
                {role}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
