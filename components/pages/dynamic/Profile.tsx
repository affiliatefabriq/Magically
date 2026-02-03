"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { UserProfile } from "@/components/shared/user/UserProfile";
import { UserProfileEmpty } from "@/components/states/empty/Empty";
import { NotAuthorized, ProfileError } from "@/components/states/error/Error";
import { UserProfileLoader } from "@/components/states/loaders/Loaders";
import { Separator } from "@/components/ui/separator";
import { useProfile } from "@/hooks/useProfile";
import { API_URL } from "@/lib/api";
import { PublicationImage } from "@/components/shared/publication/PublicationImage";

export const Profile = ({ username }: { username: string }) => {
  const t = useTranslations("Pages.Profile");
  const { data: user, isLoading, isError } = useProfile(username);

  if (!user) {
    return (
      <div className="state-center section-padding">
        <NotAuthorized />
      </div>
    );
  }

  if (user && isLoading) {
    return <UserProfileLoader />;
  }

  if (user && isError) {
    return (
      <div className="state-center section-padding">
        <ProfileError />
      </div>
    );
  }

  return (
    <section className="section-padding container max-w-7xl mx-auto border-0 border-muted md:border h-full rounded-t-3xl mt-0 sm:mt-4">
      <div className="flex flex-col px-2 md:px-4 mt-4">
        <div className="flex items-center justify-between">
          <UserProfile {...user} />
        </div>
        <p className="text-sm text-muted-foreground wrap-break-word mt-6">{user.bio}</p>
      </div>
      <Separator className="bg-muted my-4" />
      <div className="flex items-center justify-evenly gap-4 secondary-text">
        <div className="text-center">
          <h3 className="font-semibold text-sm">{t("publications")}</h3>
          <p className="text-xs">{user.publicationsCount}</p>
        </div>
        <Link href={`/profile/${user.username}/interested`} className="text-center">
          <h3 className="font-semibold text-sm">{t("interested")}</h3>
          <p className="text-xs">{user.followersCount === undefined ? 0 : user.followersCount + user.followingCount}</p>
        </Link>
      </div>
      <Separator className="bg-muted my-4" />
      {user.publications.length === 0 && (
        <div className="px-2 h-screen">
          <UserProfileEmpty />
        </div>
      )}
      <div className="grid-3-mobile">
        {user.publications.map((pub: any) => (
          <Link href={`/publications/${pub.id}`} key={pub.id} className="w-full border border-white dark:border-black">
            {pub.imageUrl && (
              <PublicationImage
                src={pub.imageUrl}
                alt="pub"
                className="rounded-none! object-cover aspect-square"
              />
            )}
            {pub.videoUrl && <video src={`${API_URL}${pub.videoUrl}`} className="object-cover aspect-square" />}
          </Link>
        ))}
      </div>
    </section>
  );
};
