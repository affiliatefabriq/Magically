"use client";

import { useEffect, useRef, useState } from "react";
import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDebounceValue } from "usehooks-ts";

import { PublicationCardSimplified } from "@/components/shared/publication/PublicationCard";
import { UserCard } from "@/components/shared/user/UserCard";
import { SearchPublicationEmpty, SearchUserEmpty } from "@/components/states/empty/Empty";
import { ExploreError, NotAuthorized, SearchError } from "@/components/states/error/Error";
import { SearchLoader } from "@/components/states/loaders/Loaders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/hooks/useAuth";
import { usePublications } from "@/hooks/usePublications";
import { useRecommendedUsers, useSearch } from "@/hooks/useSearch";

export const Search = () => {
  const t = useTranslations("Pages.Search");
  const [filters, setFilters] = useState({ query: "", type: "all", sortBy: "newest" });
  const [debouncedQuery] = useDebounceValue(filters.query, 500);

  const { data: user, isError } = useUser();
  const {
    data: searchResults,
    isLoading: isSearchLoading,
    isError: isSearchError,
  } = useSearch({ ...filters, query: debouncedQuery });

  const { data: recommendedUsers, isLoading: isLoadingRecommended } = useRecommendedUsers(!debouncedQuery);
  const { data: feedData, fetchNextPage, hasNextPage, isFetchingNextPage } = usePublications({ sortBy: "newest" });

  const isEmptySearch = !debouncedQuery;

  const observerRef = useRef<HTMLDivElement>(null);

  // Infinite scroll with IntersectionObserver
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    const currentRef = observerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <section className="flex flex-col container mx-auto section-padding">
      <h1 className="title-text my-4">{t("title")}</h1>
      <div className="relative flex gap-4">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder={t("search")}
          className="component-dark pl-10 h-10 w-full"
          value={filters.query}
          onChange={(e: any) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
        />
      </div>

      {isEmptySearch ? (
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="w-full mt-2">
            <TabsTrigger value="users">{t("recommended")}</TabsTrigger>
            <TabsTrigger value="publications">{t("publications")}</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-2 mt-4">
            {isLoadingRecommended ? (
              <SearchLoader />
            ) : recommendedUsers && recommendedUsers.length > 0 ? (
              <>
                <p className="text-xs text-muted-foreground mb-4">{t("recommendedDescription")}</p>
                {recommendedUsers.map((user: any) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </>
            ) : user ? (
              <SearchUserEmpty />
            ) : null}
          </TabsContent>

          <TabsContent value="publications" className="space-y-4 mt-4">
            {feedData?.pages && feedData.pages[0]?.publications.length > 0 ? (
              <>
                <div className="grid grid-cols-3 gap-0 grid-flow-dense auto-rows-auto">
                  {feedData.pages.map((page) =>
                    page.publications.map((pub: any, id: number) => (
                      <PublicationCardSimplified key={pub.id} publication={pub} id={id} />
                    ))
                  )}
                </div>

                {isFetchingNextPage && (
                  <div className="flex justify-center mt-4">
                    <SearchLoader />
                  </div>
                )}

                {/* sentinel for IntersectionObserver to auto-load next page */}
                {hasNextPage && (
                  <div className="flex justify-center mt-4">
                    <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} variant="outline">
                      {isFetchingNextPage ? t("loading") : t("loadMore")}
                    </Button>
                  </div>
                )}
              </>
            ) : user ? (
              <SearchPublicationEmpty />
            ) : null}
          </TabsContent>
        </Tabs>
      ) : (
        <Tabs defaultValue="users">
          <TabsList className="w-full mt-2">
            <TabsTrigger value="users">{t("users")}</TabsTrigger>
            <TabsTrigger value="publications">{t("publications")}</TabsTrigger>
          </TabsList>
          <TabsContent value="users" className="space-y-2 mt-4">
            {searchResults?.users.length > 0 ? (
              <>
                {searchResults.users.map((user: any) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </>
            ) : user ? (
              <SearchUserEmpty />
            ) : null}
          </TabsContent>
          <TabsContent value="publications" className="space-y-4 mt-4">
            {searchResults?.publications.length > 0 ? (
              <>
                <div className="grid grid-cols-3 gap-0 grid-flow-dense auto-rows-auto">
                  {searchResults.publications.map((pub: any, id: any) => (
                    <PublicationCardSimplified key={pub.id} publication={pub} id={id} />
                  ))}
                </div>
              </>
            ) : user ? (
              <SearchPublicationEmpty />
            ) : null}
          </TabsContent>
        </Tabs>
      )}

      {/* States Handler */}
      <div className="flex flex-col items-center justify-center w-full h-full">
        {!user && (
          <div className="state-center">
            <NotAuthorized />
          </div>
        )}
        {user && isError && (
          <div className="state-center">
            <ExploreError />
          </div>
        )}
        {isSearchLoading && (
          <div className="flex flex-col items-center w-full h-full gap-2">
            <SearchLoader />
          </div>
        )}
        {user && isSearchError && <SearchError />}
      </div>
    </section>
  );
};
