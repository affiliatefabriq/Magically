import Link from "next/link";
import { UserAvatar } from "./UserAvatar";

type UserProfileProps = {
  username: string;
  fullname: string;
  avatar?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
};

export const UserProfile = ({
  size,
  ...user
}: UserProfileProps) => {
  return (
    <Link
      href={`/profile/${user.username}`}
      className="flex items-center justify-center gap-2"
    >
      <UserAvatar {...user} size={size} />
      <div className="flex flex-col items-start justify-center">
        <span className="text-sm font-semibold">{user.fullname}</span>
        <span className="text-neutral-400 text-sm">@{user.username}</span>
      </div>
    </Link>
  );
};
