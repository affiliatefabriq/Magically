"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { UserCard } from "@/components/shared/user/UserCard";
import { FollowingError } from "@/components/states/error/Error";
import { ListLoader } from "@/components/states/loaders/Loaders";
import { Separator } from "@/components/ui/separator";
import { useMyFollowing } from "@/hooks/useProfile";
import { UserAttributes } from "@/types";

export const Following = () => {
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
      <div className="flex items-center justify-start gap-2 mt-2">
        <Link href="/profile" className="secondary-hover magic-transition rounded-md">
          <ChevronLeft />
        </Link>
        <h1 className="text-xl sm:text-2xl font-semibold">Подписки</h1>
      </div>

      <Separator orientation="horizontal" className="my-2" />

      <div className="flex-column space-y-2">
        {data.length > 0 ? (
          data.map((user: UserAttributes) => <UserCard key={user.id} user={user} />)
        ) : (
          <p className="text-center text-muted-foreground py-4">Нет подписок</p>
        )}
      </div>
    </section>
  );
};
