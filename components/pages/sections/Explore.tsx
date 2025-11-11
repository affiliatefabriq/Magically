"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { useUser } from "@/hooks/useAuth";
import { usePublications } from "@/hooks/usePublications";

import { Button } from "@/components/ui/button";
import { ExploreEmpty } from "@/components/states/empty/Empty";
import { ExploreLoader } from "@/components/states/loaders/Loaders";
import { ShootingStars } from "@/components/ui/magic/shooting-stars";
import { StarsBackground } from "@/components/ui/magic/stars-background";
import { ExploreError, NotAuthorized } from "@/components/states/error/Error";
import { PublicationCard } from "@/components/shared/publication/PublicationCard";

export const Explore = () => {
  const { data: user, isError } = useUser();
  const { theme } = useTheme();
  const [filters, setFilters] = useState({ sortBy: "newest", hashtag: "" });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = usePublications(filters);

  const handleFilterChange = (value: string) => {
    setFilters((prev) => ({ ...prev, sortBy: value }));
  };

  const handleHashtagClick = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      hashtag: prev.hashtag === tag ? "" : tag,
    }));
  };

  const categories = ["Higgsfield", "Kling", "GPT", "FalAI"];

  // Динамичные цвета под тему
  const starColor = theme === "dark" ? "#FFFFFF" : "#111111";
  const trailColor = theme === "dark" ? "#F020F0" : "#A174D1";

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* --- Stars Layer --- */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <StarsBackground className="!h-full !w-full opacity-100" />
        <ShootingStars
          starColor={starColor}
          trailColor={trailColor}
          className="!h-full !w-full"
        />
      </div>

      {/* --- Scrollable content --- */}
      <div className="relative z-10 w-full h-full section-padding">
        <div className="grid-4 mt-4 gap-6">
          {data?.pages.map((page) =>
            page.publications.map((publication: any) => (
              <PublicationCard
                key={publication.id}
                publication={publication}
                userId={user?.id}
              />
            ))
          )}
        </div>

        {data?.pages[0].publications.length === 0 && <div className="!h-screen state-center"><ExploreEmpty /></div>}

        {hasNextPage && (
          <div className="flex justify-center mt-8">
            <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
              {isFetchingNextPage ? "Loading more..." : "Load More"}
            </Button>
          </div>
        )}

        {!user && (
          <div className="!h-screen state-center">
            <NotAuthorized />
          </div>
        )}
        {user && isError && (
          <div className="!h-screen state-center">
            <ExploreError />
          </div>
        )}
        {user && isLoading && (
          <div>
            <ExploreLoader />
          </div>
        )}
      </div>
    </section>
  );
};
