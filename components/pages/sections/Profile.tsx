"use client";

import Link from "next/link";
import Image from "next/image";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Cog, ForwardIcon, Pencil } from "lucide-react";
import { useTranslations } from "next-intl";

import { EditProfileDialog } from "@/components/shared/user/EditProfileDialog";
import { PersonalProfileEmpty } from "@/components/states/empty/Empty";
import { NotAuthorized, ProfileError } from "@/components/states/error/Error";
import { ProfileLoader } from "@/components/states/loaders/Loaders";
import { Button } from "@/components/ui/button";
import { ConfettiButton } from "@/components/ui/confetti";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useMyProfile } from "@/hooks/useProfile";
import { API_URL, BASE_URL } from "@/lib/api";
import { UserAvatar } from "@/components/shared/user/UserAvatar";

export const Profile = () => {
  const t = useTranslations("Pages.Profile");
  const pathname = usePathname();
  const { data: user, isLoading, isError } = useMyProfile();
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  if (!user) {
    return <div className="state-center section-padding"><NotAuthorized /></div>;
  }

  if (user && isLoading) {
    return <ProfileLoader />;
  }

  if (user && isError) {
    return <div className="state-center section-padding"><ProfileError /></div>;
  }

  const links = BASE_URL + pathname + "/" + user.username;

  const copyLink = (e: any) => {
    navigator.clipboard.writeText(links);
  };

  return (
    <section className="section-padding container max-w-7xl mx-auto border-0 md:border border-muted h-full rounded-t-4xl mt-0 sm:mt-4">
      <div className="flex flex-col px-2 md:px-4 mt-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col items-start justify-center md:justify-between">
            <UserAvatar {...user} size="xl" />
            <span className="text-sm font-semibold mt-4">{user.fullname}</span>
            <span className="hidden md:flex text-neutral-400 text-sm">@{user.username}</span>
          </div>
          <div className="flex md:flex-row flex-col items-start md:items-center justify-between mt-0 md:mt-4 px-0 gap-2">
            <div className="flex md:hidden items-center justify-between w-full">
              <span className="text-2xl font-bold">{user.username}</span>
              <Link href="/settings" className="ease hover:bg-muted p-2 rounded-md">
                <Cog />
              </Link>
            </div>
            <div className="flex items-center justify-start gap-2">
              <div onClick={copyLink} className="flex items-center justify-center w-full">
                <ConfettiButton className="btn-outline text-xs sm:text-sm px-1.5! sm:px-2!">
                  <ForwardIcon className="hidden sm:flex" />
                  {t("share")}
                </ConfettiButton>
              </div>
              <div className="w-full">
                <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full btn-login text-xs sm:text-sm px-1.5! sm:px-2!" size="sm">
                      <Pencil className="hidden sm:flex" />
                      {t("edit")}
                    </Button>
                  </DialogTrigger>
                  <EditProfileDialog user={user} setOpen={setEditProfileOpen} />
                </Dialog>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center gap-1">
              <Link href="/settings" className="ease hover:bg-muted p-2 rounded-md">
                <Cog />
              </Link>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground wrap-break-word mt-2">{user.bio}</p>
        <div className="flex items-center gap-2 text-muted-foreground mt-4">
          <p className="text-sm">{t("tokens")}</p>
          <span className="text-sm">✦ {user.tokens}</span>
        </div>
        <div className="flex flex-row items-center gap-3 text-muted-foreground">
          <div className="flex text-sm w-auto">{t("activity")}</div>
          <div className="flex flex-1 items-center w-full mt-1">
            <Progress value={user.dailyActions.count * 10} className="w-full max-w-18.75 lg:max-w-37.5" />
            <span className="px-2 w-16 text-sm text-muted-foreground text-center">{user.dailyActions.count} / 10</span>
          </div>
        </div>
      </div>

      <Separator className="bg-muted my-4" />
      <div className="flex items-center justify-evenly gap-4 secondary-text">
        <div className="text-center">
          <h3 className="font-semibold text-sm">{t("publications")}</h3>
          <p className="text-xs">{user.publicationsCount}</p>
        </div>
        <Link href="/profile/interested" className="text-center">
          <h3 className="font-semibold text-sm">{t("interested")}</h3>
          <p className="text-xs">{user.followersCount === undefined ? 0 : user.followersCount + user.followingCount}</p>
        </Link>
      </div>
      <Separator className="bg-muted my-4" />
      {user.publications.length === 0 && (
        <div className="px-2 h-screen">
          <PersonalProfileEmpty />
        </div>
      )}
      <div className="grid-3-mobile">
        {user.publications.map((pub: any) => (
          <Link href={`/publications/${pub.id}`} key={pub.id} className="w-full border border-white dark:border-black">
            {pub.imageUrl && (
              <Image
                src={`${API_URL}${pub.imageUrl}`}
                width={1024}
                height={1024}
                alt="pub"
                className="rounded-none object-cover aspect-square"
              />
            )}
            {pub.videoUrl && (
              <video
                src={`${API_URL}${pub.videoUrl}`}
                autoPlay
                loop
                muted
                playsInline
                className="rounded-none object-cover aspect-square"
              />
            )}
          </Link>
        ))}
      </div>
    </section>
  );
};
