'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export const BackButton = () => {
  const t = useTranslations('Components.PublicationActions');
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      onClick={() => router.back()}
      className="fixed md:hidden h-12 rounded-none flex justify-start bg-background w-full top-0 left-0 right-0 text-sm z-10 link-text"
    >
      <ChevronLeft className="size-4 " />
      <span>{t('back')}</span>
    </Button>
  );
};
