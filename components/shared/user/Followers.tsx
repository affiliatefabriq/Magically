"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";

import { UserCard } from "@/components/shared/user/UserCard";
import { FollowersError } from "@/components/states/error/Error";
import { ListLoader } from "@/components/states/loaders/Loaders";
import { Separator } from "@/components/ui/separator";
import { useMyFollowers } from "@/hooks/useProfile";
import { UserAttributes } from "@/types";

export const Followers = () => {
  const t = useTranslations("Components.Followers");
  const { data, isLoading, isError } = useMyFollowers();

  if (isLoading) return <ListLoader />;
  if (isError)
    return (
      <div className="section-padding state-center">
        <FollowersError />
      </div>
    );

  return (
    <section className="section-padding container mx-auto max-w-6xl">
      <Separator orientation="horizontal" className="my-1" />
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
