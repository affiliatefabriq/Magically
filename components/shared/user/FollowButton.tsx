"use client";

import { Button } from "@/components/ui/button";
import { useSubscribe, useUnsubscribe } from "@/hooks/useProfile";
import { UserAttributes } from "@/types";

export const FollowButton = (user: UserAttributes) => {
  const subscribeMutation = useSubscribe();
  const unsubscribeMutation = useUnsubscribe();

  const handleFollowToggle = (user: UserAttributes) => {
    user.isFollowing ? unsubscribeMutation.mutate(user.id) : subscribeMutation.mutate(user.id);
  };

  return (
    <Button
      className={user.isFollowing ? "btn-outline" : "btn-solid"}
      onClick={() => handleFollowToggle(user)}
      disabled={subscribeMutation.isPending || unsubscribeMutation.isPending}
    >
      {user.isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
};
