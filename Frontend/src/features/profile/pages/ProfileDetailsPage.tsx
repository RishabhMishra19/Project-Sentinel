import { useAppSelector } from "@/reduxStore/hooks";
import type { RootState } from "@/reduxStore/store";
import { OrganizationCard } from "../components/OrganzationCard";
import { PasswordCard } from "../components/PasswordCard";
import { PersonalInfoCard } from "../components/PersonalInfoCard";
import { ProfileHeader } from "../components/ProfileHeader";

export default function ProfileDetailsPage() {
  const user = useAppSelector((state: RootState) => state.auth.currentUser);

  if (!user) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <ProfileHeader user={user} />

      <PersonalInfoCard user={user} />

      <OrganizationCard user={user} />

      <PasswordCard />
    </div>
  );
}
