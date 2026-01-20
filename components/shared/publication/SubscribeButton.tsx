"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useSubscribe, useUnsubscribe } from "@/hooks/useProfile";
import { Publication } from "@/types";

type SubscribeButtonProps = {
  publication: Publication;
  style?: string;
  className?: string;
};

export const SubscribeButton = ({ publication, style = "login", className }: SubscribeButtonProps) => {
  const t = useTranslations("Components.FollowButton");

  const subscribe = useSubscribe();
  const unsubscribe = useUnsubscribe();

  const [isFollowing, setIsFollowing] = useState(publication.isFollowing);

  useEffect(() => {
    setIsFollowing(publication.isFollowing);
  }, [publication.isFollowing]);

  const handleSubscribe = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (isFollowing) return;

    setIsFollowing(true);
    try {
      await subscribe.mutateAsync(publication.author.id);
    } catch {
      setIsFollowing(false);
    }
  };

  const handleUnsubscribe = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (!isFollowing) return;

    setIsFollowing(false);
    try {
      await unsubscribe.mutateAsync(publication.author.id);
    } catch {
      setIsFollowing(true);
    }
  };

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      onClick={isFollowing ? handleUnsubscribe : handleSubscribe}
      className={`${style === "glass" ? "btn-glass" : "btn-login"} ${className}`}
    >
      {isFollowing ? t("Unfollow") : t("Follow")}
    </Button>
  );
};
