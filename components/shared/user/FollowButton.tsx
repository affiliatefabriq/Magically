'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useFollow } from '@/hooks/useProfile';
import { useTranslations } from 'next-intl';

export const FollowButton = ({
  id,
  isFollowing: initialFollowing,
}: {
  id: string;
  isFollowing: boolean;
}) => {
  const t = useTranslations('Components.FollowButton');
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const followMutation = useFollow();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (followMutation.isPending) return;

    const next = !isFollowing;

    setIsFollowing(next);

    try {
      await followMutation.mutateAsync({
        userId: id,
        follow: next,
      });
    } catch (err) {
      setIsFollowing(!next);
      console.error('follow error', err);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={followMutation.isPending}
      className={`${isFollowing ? 'btn-outline' : 'btn-solid'} min-w-24`}
    >
      {followMutation.isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : isFollowing ? (
        t('Unfollow')
      ) : (
        t('Follow')
      )}
    </Button>
  );
};
