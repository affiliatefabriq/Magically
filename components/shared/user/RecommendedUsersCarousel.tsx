'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay"
import { RecommendedUserCard } from './RecommendedUserCard';
import { useTranslations } from 'next-intl';

interface Props {
  users: any[];
}

export const RecommendedUsersCarousel = ({ users }: Props) => {
  const t = useTranslations('Pages.Explore');

  if (!users?.length) return null;

  return (
    <div className="relative w-full min-w-0 overflow-hidden my-10">
      <div className="mb-5 px-1">
        <h3 className="text-xl font-bold">{t('Suggested')}</h3>
      </div>

      {/* overflow-hidden here is the hard visual clip guard */}
      <div className="w-full min-w-0 overflow-hidden">
        <Carousel
          opts={{
            align: 'start',
            dragFree: true,
            containScroll: 'trimSnaps',
          }}
          plugins={[
            Autoplay({
              delay: 3000,
            }),
          ]}
          className="w-full min-w-0"
        >
          <CarouselContent className="-ml-3">
            {users.map((user) => (
              <CarouselItem
                key={user.id}
                className="pl-3 min-w-0 basis-[85%] xs:basis-[70%] sm:basis-1/2 md:basis-1/3 lg:basis-1/5"
              >
                <div className="min-w-0 h-full p-3 rounded-2xl bg-card/40 backdrop-blur border border-border/50 hover:border-border transition-colors">
                  <RecommendedUserCard user={user} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};
