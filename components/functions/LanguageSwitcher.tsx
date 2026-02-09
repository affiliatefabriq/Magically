'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import { GlobeIcon } from 'lucide-react';
import { useLocale } from 'next-intl';

import { Locale } from '@/app/i18n/config';
import { setUserLocale } from '@/app/i18n/locale';
import { Button } from '../ui/button';

export const LanguageSwitcher = () => {
  const locale = useLocale();
  const [currentLocale, setCurrentLocale] = useState<Locale>(locale as Locale);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setCurrentLocale(locale as Locale);
  }, [locale]);

  const toggleLocale = useCallback(() => {
    const nextLocale = currentLocale === 'en' ? 'ru' : 'en';
    startTransition(async () => {
      localStorage.setItem('locale', nextLocale);
      await setUserLocale(nextLocale);
      setCurrentLocale(nextLocale as Locale);
    });
  }, [currentLocale, startTransition, setCurrentLocale]);

  return (
    <Button
      onClick={toggleLocale}
      disabled={isPending}
      variant="ghost"
      className="flex items-center justify-start cursor-pointer rounded-full py-2 px-4! w-full secondary-hover magic-transition"
    >
      <GlobeIcon className="size-4" />
      {currentLocale === 'en' ? 'English' : 'Русский'}
    </Button>
  );
};
