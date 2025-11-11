"use client";

import { UserCard } from "@/components/shared/user/UserCard";
import { FollowingError } from "@/components/states/error/Error";
import { ListLoader } from "@/components/states/loaders/Loaders";
import { Separator } from "@/components/ui/separator";
import { useMyFollowing } from "@/hooks/useProfile";
import { UserAttributes } from "@/types";
import { useTranslations } from "next-intl";

export const Following = () => {
  const t = useTranslations("Components.Following");
  const { data, isLoading, isError } = useMyFollowing();

  if (isLoading) return <ListLoader />;
  if (isError)
    return (
      <div className="section-padding state-center">
        <FollowingError />
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
