"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { UserProfile } from "@/components/shared/user/UserProfile";
import { UserProfileEmpty } from "@/components/states/empty/Empty";
import { ProfileError } from "@/components/states/error/Error";
import { UserProfileLoader } from "@/components/states/loaders/Loaders";
import { Separator } from "@/components/ui/separator";
import { useProfile } from "@/hooks/useProfile";
import { API_URL } from "@/lib/api";

export const Profile = ({ username }: { username: string }) => {
  const t = useTranslations("Profile");
  const { data: user, isLoading, isError } = useProfile(username);

  if (isLoading) {
    return <UserProfileLoader />;
  }

  if (isError) {
    return <ProfileError />;
  }

  return (
    <section className="section-padding container max-w-7xl mx-auto border-0 md:border h-full rounded-t-2xl mt-0 sm:mt-4">
      <div className="flex items-center justify-between my-4 px-2 md:px-4">
        <h1 className="title-text">{t("Title")}</h1>
      </div>
      <Separator className="bg-muted my-4" />
      <div className="flex flex-col px-2 md:px-4">
        <div className="flex items-center justify-between">
          <UserProfile {...user} />
        </div>
        <p className="text-sm text-muted-foreground break-words mt-6">{user.bio}</p>
      </div>
      <Separator className="bg-muted my-4" />
      <div className="flex items-center justify-around gap-4 secondary-text">
        <div className="text-center">
          <h3 className="font-semibold text-sm">{t("UserInfo.Publications")}</h3>
          <p className="text-xs">{user.publicationsCount}</p>
        </div>
        <Link href={`/profile/${user.username}/followers`} className="text-center">
          <h3 className="font-semibold text-sm">{t("UserInfo.Followers")}</h3>
          <p className="text-xs">{user.followersCount === undefined ? 0 : user.followersCount}</p>
        </Link>
        <Link href={`/profile/${user.username}/following`} className="text-center">
          <h3 className="font-semibold text-sm">{t("UserInfo.Following")}</h3>
          <p className="text-xs">{user.followingCount === undefined ? 0 : user.followingCount}</p>
        </Link>
      </div>
      <Separator className="bg-muted my-4" />
      {user.publications.length === 0 && (
        <div className="px-2 h-screen">
          <UserProfileEmpty />
        </div>
      )}
      <div className="grid-3">
        {user.publications.map((pub: any) => (
          <Link href={`/publications/${pub.id}`} key={pub.id} className="w-full">
            {pub.imageUrl && (
              <Image
                src={`${API_URL}${pub.imageUrl}`}
                width={1024}
                height={1024}
                alt="pub"
                className="rounded-xl object-cover aspect-square"
              />
            )}
            {pub.videoUrl && (
              <video src={`${API_URL}${pub.videoUrl}`} className="rounded-xl object-cover aspect-square" />
            )}
          </Link>
        ))}
      </div>
    </section>
  );
};
