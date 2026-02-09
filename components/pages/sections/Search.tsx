'use client';

import { useEffect, useRef, useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { PublicationCardSimplified } from '@/components/shared/publication/PublicationCard';
import { SearchPublicationEmpty } from '@/components/states/empty/Empty';
import { NotAuthorized, SearchError } from '@/components/states/error/Error';
import {
  SearchLoader,
  SearchPublicationLoader,
} from '@/components/states/loaders/Loaders';
import { Input } from '@/components/ui/input';
import { useUser } from '@/hooks/useAuth';
import { useSearchPublications } from '@/hooks/useSearch';

export const Search = () => {
  const t = useTranslations('Pages.Search');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: user, isError: isUserError } = useUser();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useSearchPublications({
    query: debouncedQuery,
    sortBy: 'newest',
  });

  const observerRef = useRef<HTMLDivElement>(null);

  // Infinite scroll
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 },
    );

    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!user) {
    return (
      <section className="flex flex-col container mx-auto section-padding">
        <div className="state-center">
          <NotAuthorized />
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col container mx-auto section-padding">
      <h1 className="title-text my-4">{t('title')}</h1>

      <div className="relative flex gap-4">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder={t('search')}
          className="component-dark pl-10 h-10 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Publications Grid */}
      <div className="mt-6">
        {isLoading ? (
          <SearchPublicationLoader />
        ) : data?.pages && data.pages[0]?.publications.length > 0 ? (
          <>
            <div className="grid grid-cols-3 gap-0 grid-flow-dense auto-rows-auto">
              {data.pages.map((page) =>
                page.publications.map((pub: any, idx: number) => (
                  <PublicationCardSimplified
                    key={pub.id}
                    publication={pub}
                    id={idx}
                  />
                )),
              )}
            </div>

            {/* Infinite scroll loader */}
            {isFetchingNextPage && (
              <div className="flex justify-center mt-8">
                <SearchPublicationLoader />
              </div>
            )}

            {/* Intersection observer target */}
            {hasNextPage && <div ref={observerRef} className="h-4 mt-4" />}
          </>
        ) : debouncedQuery ? (
          <SearchPublicationEmpty />
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>{t('startSearching')}</p>
          </div>
        )}
      </div>

      {/* Error State */}
      {(isError || isUserError) && (
        <div className="state-center">
          <SearchError />
        </div>
      )}
    </section>
  );
};
