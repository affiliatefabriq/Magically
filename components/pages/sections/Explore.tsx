"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { PublicationCard } from "@/components/shared/publication/PublicationCard";
import { ExploreEmpty } from "@/components/states/empty/Empty";
import { ExploreError, NotAuthorized } from "@/components/states/error/Error";
import { ExploreLoader } from "@/components/states/loaders/Loaders";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useUser } from "@/hooks/useAuth";
import { usePublications } from "@/hooks/usePublications";

export const Explore = () => {
  const { data: user, isError } = useUser();

  const t = useTranslations("Home");
  const [filters, setFilters] = useState({ sortBy: "newest", hashtag: "" });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = usePublications(filters);

  const handleFilterChange = (value: string) => {
    setFilters((prev) => ({ ...prev, sortBy: value }));
  };

  const handleHashtagClick = (tag: string) => {
    setFilters((prev) => ({ ...prev, hashtag: prev.hashtag === tag ? "" : tag }));
  };

  const categories = ["Higgsfield", "Kling", "GPT", "FalAI"];

  return (
    <section className="w-full h-full section-padding">
      {/* Publications fetch */}
      <div>
        {/* Title */}
        <h1 className="title-text mt-4 mb-6">Publications</h1>
        <div className="grid-4 mt-4">
          {data?.pages.map((page) =>
            page.publications.map((publication: any) => (
              <PublicationCard key={publication.id} publication={publication} userId={user!.id} />
            ))
          )}
        </div>

        {data?.pages[0].publications.length === 0 && <ExploreEmpty />}

        {hasNextPage && (
          <div className="flex-center mt-6">
            <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
              {isFetchingNextPage ? "Loading more..." : "Load More"}
            </Button>
          </div>
        )}
      </div>
      {/* States Handler */}
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
      {user && isLoading && <ExploreLoader />}
    </section>
  );
};
