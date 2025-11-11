"use client";

import Link from "next/link";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useUserFollowers } from "@/hooks/useProfile";

import { UserAttributes } from "@/types";
import { ChevronLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { UserCard } from "@/components/shared/user/UserCard";
import { FollowersError } from "@/components/states/error/Error";
import { ListLoader } from "@/components/states/loaders/Loaders";

export const Followers = () => {
  const t = useTranslations("Components.Followers");
  const { username } = useParams<{ username: string }>();
  const safeUsername = Array.isArray(username) ? username[0] : username;

  const { data, isLoading, isError } = useUserFollowers(safeUsername);

  if (isLoading) return <ListLoader />;
  if (isError)
    return (
      <div className="section-padding state-center">
        <FollowersError />
      </div>
    );

  return (
    <section className="section-padding container mx-auto max-w-6xl">
      <Separator orientation="horizontal" className="my-2" />
      <div className="flex-column space-y-2">
        {data.length > 0 ? (
          data.map((user: UserAttributes) => <UserCard key={user.id} user={user} />)
        ) : (
          <p className="text-center text-muted-foreground py-4">{t("empty")}</p>
        )}
      </div>
    </section>
  );
};
