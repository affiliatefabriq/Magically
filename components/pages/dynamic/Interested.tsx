import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Followers } from './Followers';
import { Following } from './Following';

export const Interested = ({ username }: { username: string }) => {
  const t = useTranslations('Components.Interested');

  return (
    <div className="section-padding container mx-auto max-w-6xl">
      <div className="flex items-center justify-start gap-2 mt-4">
        <Link
          href="/profile"
          className="flex items-center gap-2 rounded-md font-semibold"
        >
          <ChevronLeft />
          <h1 className="text-xl sm:text-2xl ">{t('profile')}</h1>
        </Link>
      </div>

      <Tabs defaultValue="followers">
        <TabsList className="mt-4">
          <TabsTrigger value="followers">{t('Followers.title')}</TabsTrigger>
          <TabsTrigger value="following">{t('Following.title')}</TabsTrigger>
        </TabsList>
        <TabsContent value="followers" className="-mt-3">
          <Followers />
        </TabsContent>
        <TabsContent value="following" className="-mt-3">
          <Following />
        </TabsContent>
      </Tabs>
    </div>
  );
};
