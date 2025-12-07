"use client";

import { useTheme } from "next-themes";
import { useUser } from "@/hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import { usePublications } from "@/hooks/usePublications";

import { ExploreEmpty } from "@/components/states/empty/Empty";
import { ExploreLoader } from "@/components/states/loaders/Loaders";
import { ShootingStars } from "@/components/ui/magic/shooting-stars";
import { StarsBackground } from "@/components/ui/magic/stars-background";
import { ExploreError } from "@/components/states/error/Error";
import { PublicationCard } from "@/components/shared/publication/PublicationCard";

export const Explore = () => {
  const { data: user } = useUser();
  const { theme } = useTheme();
  const [filters] = useState({ sortBy: "newest", hashtag: "" });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = usePublications(filters);

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

  const starColor = theme === "dark" ? "#FFFFFF" : "#111111";
  const trailColor = theme === "dark" ? "#F020F0" : "#A174D1";

  if (isLoading) {
    return (
      <div className="section-padding">
        <ExploreLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-screen! state-center">
        <ExploreError />
      </div>
    );
  }

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* Stars Layer */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <StarsBackground className="h-full! w-full! opacity-100" />
        <ShootingStars
          starColor={starColor}
          trailColor={trailColor}
          className="h-full! w-full!"
        />
      </div>

      {/* Scrollable content */}
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

        {data?.pages[0].publications.length === 0 && (
          <div className="h-screen! state-center">
            <ExploreEmpty />
          </div>
        )}

        {/* Infinite scroll trigger */}
        {hasNextPage && (
          <div ref={observerRef} className="h-20 flex items-center justify-center mt-8">
            {isFetchingNextPage && <ExploreLoader />}
          </div>
        )}
      </div>
    </section>
  );
};