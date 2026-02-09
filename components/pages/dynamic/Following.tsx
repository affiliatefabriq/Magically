'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { UserCard } from '@/components/shared/user/UserCard';
import { FollowingError } from '@/components/states/error/Error';
import { ListLoader } from '@/components/states/loaders/Loaders';
import { Separator } from '@/components/ui/separator';
import { useUserFollowing } from '@/hooks/useProfile';
import { UserAttributes } from '@/types';

export const Following = () => {
  const t = useTranslations('Components.Following');
  const { username } = useParams<{ username: string }>();
  const safeUsername = Array.isArray(username) ? username[0] : username;

  const { data, isLoading, isError } = useUserFollowing(safeUsername);

  if (isLoading) return <ListLoader />;
  if (isError)
    return (
      <div className="section-padding state-center">
        <FollowingError />
      </div>
    );

  return (
    <section className="section-padding container mx-auto max-w-6xl">
      <Separator orientation="horizontal" className="my-2" />
      <div className="flex-column space-y-2">
        {data.length > 0 ? (
          data.map((user: UserAttributes) => (
            <UserCard key={user.id} user={user} />
          ))
        ) : (
          <p className="text-center text-muted-foreground py-4">{t('empty')}</p>
        )}
      </div>
    </section>
  );
};
