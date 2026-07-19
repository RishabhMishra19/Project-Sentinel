import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileAvatar } from "./ProfileAvatar";
import type { CurrentUser } from "@/features/auth/dto/response/AuthResponse";

interface ProfileHeaderProps {
  user: CurrentUser;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-6 py-6">
        <ProfileAvatar name={user.name} />

        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">{user.name}</h2>

          <p className="text-muted-foreground">{user.email}</p>

          <Badge variant={user.status === "ACTIVE" ? "default" : "secondary"}>{user.status}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
