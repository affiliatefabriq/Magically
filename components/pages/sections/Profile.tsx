'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { BrainCircuit, Cog, ForwardIcon, Mail, Pencil } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { EditProfileDialog } from '@/components/shared/user/EditProfileDialog';
import { UserAvatar } from '@/components/shared/user/UserAvatar';
import { PersonalProfileEmpty } from '@/components/states/empty/Empty';
import { NotAuthorized, ProfileError } from '@/components/states/error/Error';
import { ProfileLoader } from '@/components/states/loaders/Loaders';
import { Button } from '@/components/ui/button';
import { ConfettiButton } from '@/components/ui/confetti';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useMyProfile } from '@/hooks/useProfile';
import { API_URL, BASE_URL } from '@/lib/api';
import { PublicationImage } from '@/components/shared/publication/PublicationImage';

export const Profile = () => {
  const t = useTranslations('Pages.Profile');
  const pathname = usePathname();
  const router = useRouter();
  const { data: user, isLoading, isError } = useMyProfile();
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  if (!user) {
    return (
      <div className="state-center section-padding">
        <NotAuthorized />
      </div>
    );
  }

  if (user && isLoading) {
    return <ProfileLoader />;
  }

  if (user && isError) {
    return (
      <div className="state-center section-padding">
        <ProfileError />
      </div>
    );
  }

  const links = BASE_URL + pathname + '/' + user.username;

  const copyLink = (e: any) => {
    navigator.clipboard.writeText(links);
  };

  return (
    <section className="section-padding container max-w-7xl mx-auto border-0 md:border border-muted h-full rounded-t-4xl mt-0 sm:mt-4">
      <div className="flex flex-col px-2 md:px-4 mt-4">
        <div className="flex md:hidden items-center justify-between">
          <span className="text-2xl font-bold">{user.username}</span>
          <Link href="/settings" className="ease hover:bg-muted p-2 rounded-md">
            <Cog />
          </Link>
        </div>
        <Separator className="flex md:hidden my-2" />
        <div className="flex items-start justify-between">
          <div className="flex flex-col items-start justify-center md:justify-between">
            <UserAvatar {...user} size="xl" />
            <span className="text-sm font-semibold mt-4">{user.fullname}</span>
            <span className="hidden md:flex text-neutral-400 text-sm">
              @{user.username}
            </span>
            <div className="flex items-center gap-1 text-sm clear-start text-neutral-400 mt-1 w-16">
              <span>{user.email}</span>
            </div>
          </div>
          <div className="flex md:flex-row flex-col items-start md:items-center justify-between mt-0 md:mt-4 px-0 gap-2">
            <div className="flex items-center justify-start gap-2">
              <div
                onClick={copyLink}
                className="flex items-center justify-center w-full"
              >
                <ConfettiButton className="btn-outline text-xs sm:text-sm px-1.5! sm:px-2!">
                  <ForwardIcon className="hidden sm:flex" />
                  {t('share')}
                </ConfettiButton>
              </div>
              <div className="w-full">
                <Dialog
                  open={editProfileOpen}
                  onOpenChange={setEditProfileOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      className="w-full btn-login text-xs sm:text-sm px-1.5! sm:px-2!"
                      size="sm"
                    >
                      <Pencil className="hidden sm:flex" />
                      {t('edit')}
                    </Button>
                  </DialogTrigger>
                  <EditProfileDialog user={user} setOpen={setEditProfileOpen} />
                </Dialog>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center gap-1">
              <Link
                href="/settings"
                className="ease hover:bg-muted p-2 rounded-md"
              >
                <Cog />
              </Link>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground wrap-break-word mt-2">
          {user.bio}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-start gap-2">
        <Button
          className="btn-outline"
          onClick={() => router.push('/transactions')}
        >
          {t('history')} | ✦ {user.tokens}
        </Button>
        <Button className="btn-outline">
          <span className="px-2 text-sm">
            {t('activity')} {user.dailyActions.count} / 10
          </span>
        </Button>
      </div>

      <Separator className="bg-muted my-4" />

      <div className="flex items-center justify-evenly gap-4 secondary-text">
        <div className="text-center">
          <h3 className="font-semibold text-sm">{t('publications')}</h3>
          <p className="text-xs">{user.publicationsCount}</p>
        </div>
        <div
          // href="/profile/interested"
          className="text-center"
        >
          <h3 className="font-semibold text-sm">{t('interested')}</h3>
          <p className="text-xs">
            {user.followersCount === undefined
              ? 0
              : user.followersCount + user.followingCount}
          </p>
        </div>
      </div>
      <Separator className="bg-muted my-4" />
      {user.publications.length === 0 && (
        <div className="px-2 h-screen">
          <PersonalProfileEmpty />
        </div>
      )}
      <div className="grid-3-mobile">
        {user.publications.map((pub: any) => (
          <Link
            href={`/publications/${pub.id}`}
            key={pub.id}
            className="w-full border border-white dark:border-black"
          >
            {pub.imageUrl && (
              <PublicationImage
                src={pub.imageUrl}
                alt="pub"
                className="rounded-none! object-cover aspect-square"
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
