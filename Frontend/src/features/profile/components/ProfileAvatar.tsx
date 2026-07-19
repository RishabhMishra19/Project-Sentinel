import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ProfileAvatarProps {
  name: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function ProfileAvatar({ name }: ProfileAvatarProps) {
  return (
    <Avatar className="h-20 w-20">
      <AvatarFallback className="text-xl font-semibold">{getInitials(name)}</AvatarFallback>
    </Avatar>
  );
}
