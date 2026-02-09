'use client';

import { UserAttributes } from '@/types';
import { FollowButton } from './FollowButton';
import { UserProfile } from './UserProfile';

export const UserCard = ({ user }: { user: UserAttributes }) => (
  <div
    key={user.id}
    className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg empty hover:bg-muted transition-colors"
  >
    <div className="flex-1 min-w-0 overflow-hidden">
      <UserProfile {...user} />
    </div>
    <div className="shrink-0">
      <FollowButton id={user.id} isFollowing={user.isFollowing!} />
    </div>
  </div>
);
