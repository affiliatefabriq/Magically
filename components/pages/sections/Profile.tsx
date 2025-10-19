"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bolt, ForwardIcon, Pencil } from "lucide-react";
import { useTranslations } from "next-intl";

import { EditProfileDialog } from "@/components/shared/user/EditProfileDialog";
import { UserProfile } from "@/components/shared/user/UserProfile";
import { PersonalProfileEmpty } from "@/components/states/empty/Empty";
import { ProfileError } from "@/components/states/error/Error";
import { ProfileLoader } from "@/components/states/loaders/Loaders";
import { Button } from "@/components/ui/button";
import { ConfettiButton } from "@/components/ui/confetti";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useMyProfile } from "@/hooks/useProfile";
import { API_URL, BASE_URL } from "@/lib/api";

export const Profile = () => {
  const t = useTranslations("Profile");
  const pathname = usePathname();
  const { data: user, isLoading, isError } = useMyProfile();
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  if (isLoading) {
    return <ProfileLoader />;
  }

  if (isError) {
    return <ProfileError />;
  }

  const links = BASE_URL + pathname + "/" + user.username;

  const copyLink = (e: any) => {
    navigator.clipboard.writeText(links);
  };

  return (
    <section className="section-padding container max-w-7xl mx-auto border-0 md:border h-full rounded-t-2xl mt-0 sm:mt-4">
      <div className="flex items-center justify-between my-4 px-2 md:px-4">
        <h1 className="title-text">{t("Title")}</h1>
        <div className="flex items-center justify-center gap-1">
          <Link href="/settings" className="ease hover:bg-muted p-2 rounded-md">
            <Bolt />
          </Link>
        </div>
      </div>
      <Separator className="bg-muted my-4" />
      <div className="flex flex-col px-2 md:px-4">
        <div className="flex items-center justify-between">
          <UserProfile {...user} />
        </div>
        <p className="text-sm text-muted-foreground break-words mt-6">{user.bio}</p>
        <div className="flex items-center gap-2 text-muted-foreground mt-4">
          <p className="text-md">Ваши токены:</p>
          <span className="text-md">✦ {user.tokens}</span>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-muted-foreground">
          <span className="text-md w-40">Ваша активность:</span>
          <div className="flex items-center w-full mt-1">
            <Progress value={user.dailyActions.count} className="w-full max-w-[300px]" />
            <span className="px-2 w-16 text-sm text-muted-foreground text-center">{user.dailyActions.count} / 10</span>
          </div>
        </div>
      </div>
      <div className="flex md:flex-row flex-col items-center justify-between w-full mt-4 px-2 gap-2">
        <div onClick={copyLink} className="flex items-center justify-center w-full">
          <ConfettiButton className="w-full btn-outline">
            <ForwardIcon />
            Поделиться профилем
          </ConfettiButton>
        </div>
        <div className="w-full">
          <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
            <DialogTrigger asChild>
              <Button className="w-full btn-login">
                <Pencil />
                Редактировать профиль
              </Button>
            </DialogTrigger>
            <EditProfileDialog user={user} setOpen={setEditProfileOpen} />
          </Dialog>
        </div>
      </div>
      <Separator className="bg-muted my-4" />
      <div className="flex items-center justify-around gap-4 secondary-text">
        <div className="text-center">
          <h3 className="font-semibold text-sm">{t("UserInfo.Publications")}</h3>
          <p className="text-xs">{user.publicationsCount}</p>
        </div>
        <Link href="/profile/followers" className="text-center">
          <h3 className="font-semibold text-sm">{t("UserInfo.Followers")}</h3>
          <p className="text-xs">{user.followersCount === undefined ? 0 : user.followersCount}</p>
        </Link>
        <Link href="/profile/following" className="text-center">
          <h3 className="font-semibold text-sm">{t("UserInfo.Following")}</h3>
          <p className="text-xs">{user.followingCount === undefined ? 0 : user.followingCount}</p>
        </Link>
      </div>
      <Separator className="bg-muted my-4" />
      {user.publications.length === 0 && (
        <div className="px-2 h-screen">
          <PersonalProfileEmpty />
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
