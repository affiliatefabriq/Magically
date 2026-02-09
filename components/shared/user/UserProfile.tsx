import Link from 'next/link';

import { UserAvatar } from './UserAvatar';

type UserProfileProps = {
  username: string;
  fullname: string;
  avatar?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
};

export const UserProfile = ({ size, ...user }: UserProfileProps) => {
  return (
    <Link
      href={`/profile/${user.username}`}
      className="flex items-center gap-2 min-w-0 hover:opacity-80 transition-opacity"
    >
      <UserAvatar {...user} size={size} className="shrink-0" />
      <div className="flex flex-col items-start justify-center min-w-0 overflow-hidden">
        <span className="text-sm font-semibold truncate w-full">
          {user.fullname}
        </span>
        <span className="text-neutral-400 text-sm truncate w-full">
          @{user.username}
        </span>
      </div>
    </Link>
  );
};
