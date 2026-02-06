"use client"

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { PublicationCard } from "@/components/shared/publication/PublicationCard";
import { RecommendedUserCard } from "@/components/shared/user/RecommendedUserCard";
import { ExploreEmpty } from "@/components/states/empty/Empty";
import { ExploreError } from "@/components/states/error/Error";
import { ExploreLoader } from "@/components/states/loaders/Loaders";
import { ShootingStars } from "@/components/ui/magic/shooting-stars";
import { StarsBackground } from "@/components/ui/magic/stars-background";
import { useUser } from "@/hooks/useAuth";
import { usePublications } from "@/hooks/usePublications";
import { useRecommendedUsers } from "@/hooks/useSearch";
import { useTranslations } from "next-intl";

export const Explore = () => {
  const t = useTranslations("Pages.Explore")
  const { theme } = useTheme();
  const [filters] = useState({ sortBy: "newest", hashtag: "" });
  
  const { data: user } = useUser();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError
  } = usePublications(filters);

  const {
    data: recommendedUsers,
    isLoading: isLoadingRecommended
  } = useRecommendedUsers(true, 20);

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
      { threshold: 1.0 }
    );

    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Вставка рекомендованных пользователей между публикациями
  const insertRecommendations = () => {
    if (!data?.pages) return [];

    const allPublications = data.pages.flatMap(page => page.publications);
    const result: any[] = [];
    let userIndex = 0;

    // Проверяем есть ли рекомендованные пользователи
    const hasRecommendations = recommendedUsers && Array.isArray(recommendedUsers) && recommendedUsers.length > 0;
    const usersArray = hasRecommendations ? recommendedUsers : [];

    allPublications.forEach((pub, index) => {
      result.push({ type: 'publication', data: pub });

      // Вставляем блок рекомендаций каждые 20 публикаций (если есть что показывать)
      if (hasRecommendations && (index + 1) % 20 === 0 && userIndex < usersArray.length) {
        // Берем до 3 пользователей для показа
        const usersToShow = usersArray.slice(userIndex, userIndex + 3);

        if (usersToShow.length > 0) {
          result.push({ type: 'recommendations', data: usersToShow });
          userIndex += 3;
        }
      }
    });

    return result;
  };

  const starColor = theme === "dark" ? "#FFFFFF" : "#111111";
  const trailColor = theme === "dark" ? "#F020F0" : "#A174D1";

  // Показываем лоадер только если грузятся публикации (не ждем рекомендации)
  if (isLoading) {
    return (
      <div className="section-padding">
        <ExploreLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="section-padding state-center">
        <ExploreError />
      </div>
    );
  }

  const mixedContent = insertRecommendations();

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* Stars Layer */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <StarsBackground className="h-full w-full opacity-100" />
        <ShootingStars
          starColor={starColor}
          trailColor={trailColor}
          className="h-full w-full"
        />
      </div>

      {/* Scrollable content */}
      <div className="relative z-10 w-full h-full section-padding">
        <div className="grid-4 mt-4 gap-6">
          {mixedContent.map((item, index) => {
            if (item.type === 'publication') {
              return (
                <PublicationCard
                  key={`pub-${item.data.id}`}
                  publication={item.data}
                  userId={user?.id}
                />
              );
            }

            if (item.type === 'recommendations') {
              return (
                <div
                  key={`rec-${index}`}
                  className="col-span-full bg-linear-to-br from-card/30 to-card/10 backdrop-blur-sm rounded-2xl p-6 border border-border/50"
                >
                  <h3 className="text-lg font-bold mb-4">
                    {t("Suggested")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {item.data.map((user: any) => (
                      <RecommendedUserCard key={user.id} user={user} />
                    ))}
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>

        {/* Empty state - только если нет публикаций вообще */}
        {data?.pages[0]?.publications?.length === 0 && (
          <div className="h-screen state-center">
            <ExploreEmpty />
          </div>
        )}

        {/* Infinite scroll trigger - продолжаем загружать публикации независимо от рекомендаций */}
        {hasNextPage && (
          <div ref={observerRef} className="h-20 flex items-center justify-center mt-8">
            {isFetchingNextPage && <ExploreLoader />}
          </div>
        )}
      </div>
    </section>
  );
};