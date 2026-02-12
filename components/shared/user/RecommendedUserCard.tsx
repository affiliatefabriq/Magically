import Link from 'next/link';

import { FollowButton } from './FollowButton';
import { getImageUrl } from '../publication/PublicationImage';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface RecommendedUserCardProps {
  user: {
    id: string;
    username: string;
    fullname?: string;
    avatar?: string;
    bio?: string;
    isFollowing?: boolean;
  };
}

export const RecommendedUserCard = ({ user }: RecommendedUserCardProps) => {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-3 p-4 rounded-2xl theme-2 transition-colors">
      <Link href={`/profile/${user.username}`} className="flex">
        <Avatar className="size-12 ring-2 ring-primary/10">
          <AvatarImage src={getImageUrl(user.avatar!)} alt={user.username} />
          <AvatarFallback className="bg-linear-to-br from-primary/20 to-secondary/20">
            {user.username?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </Link>

      <div className="flex flex-col flex-1 items-center justify-start lg:items-start min-w-0">
        <Link href={`/profile/${user.username}`} className="block">
          <p className="font-semibold text-base truncate">{user.username}</p>
          {user.fullname && (
            <p className="text-sm text-muted-foreground truncate">
              {user.fullname}
            </p>
          )}
        </Link>
        {user.bio && (
          <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
            {user.bio}
          </p>
        )}
      </div>

      <FollowButton id={user.id} isFollowing={user.isFollowing!} />
    </div>
  );
};
