'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { useTheme } from 'next-themes'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'

import { PublicationCard } from '@/components/shared/publication/PublicationCard'
import { RecommendedUsersCarousel } from '@/components/shared/user/RecommendedUsersCarousel'

import { ExploreEmpty } from '@/components/states/empty/Empty'
import { ExploreError } from '@/components/states/error/Error'
import { ExploreLoader } from '@/components/states/loaders/Loaders'

import { ShootingStars } from '@/components/ui/magic/shooting-stars'
import { StarsBackground } from '@/components/ui/magic/stars-background'

import { useUser } from '@/hooks/useAuth'
import { usePublications } from '@/hooks/usePublications'
import { useRecommendedUsers } from '@/hooks/useSearch'

const CAROUSEL_INTERVAL = 50

/**
 * Splits an array into chunks of `size`, inserting a carousel marker
 * after every `CAROUSEL_INTERVAL` items.
 */
function buildChunks(publications: any[]) {
  const chunks: Array<{ type: 'posts'; items: any[] } | { type: 'carousel'; key: string }> = []
  let i = 0
  let chunkIndex = 0

  while (i < publications.length) {
    const slice = publications.slice(i, i + CAROUSEL_INTERVAL)
    chunks.push({ type: 'posts', items: slice })
    i += CAROUSEL_INTERVAL

    // Insert carousel marker after every full chunk (not after the last partial one)
    if (i < publications.length || slice.length === CAROUSEL_INTERVAL) {
      chunks.push({ type: 'carousel', key: `carousel-${chunkIndex}` })
    }
    chunkIndex++
  }

  return chunks
}

// Skeleton card for loading state
const SkeletonCard = ({ height }: { height: number }) => (
  <div
    className="w-full rounded-xl bg-muted/40 animate-pulse mb-4 break-inside-avoid"
    style={{ height }}
  />
)

const SKELETON_HEIGHTS = [200, 280, 180, 320, 240, 200, 260, 300, 220, 180, 340, 200]

export const Explore = () => {
  const t = useTranslations('Pages.Explore')
  const { theme } = useTheme()
  const [filters] = useState({ sortBy: 'newest', hashtag: '' })

  const { data: user } = useUser()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = usePublications(filters)

  const {
    data: recommendedUsers,
    isLoading: isLoadingRecommended,
  } = useRecommendedUsers(true, 20)

  const observerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage()
      },
      { threshold: 0.5 },
    )

    const currentRef = observerRef.current
    if (currentRef) observer.observe(currentRef)
    return () => { if (currentRef) observer.unobserve(currentRef) }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const allPublications = useMemo(
    () => data?.pages.flatMap((page) => page.publications) ?? [],
    [data]
  )

  const chunks = useMemo(() => buildChunks(allPublications), [allPublications])

  const carouselUsers = useMemo(
    () => recommendedUsers?.slice(0, 15) ?? [],
    [recommendedUsers]
  )

  const starColor = theme === 'dark' ? '#FFFFFF' : '#111111'
  const trailColor = theme === 'dark' ? '#F020F0' : '#A174D1'

  if (isLoading) {
    return (
      <div className="section-padding">
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
          {SKELETON_HEIGHTS.map((h, i) => (
            <SkeletonCard key={i} height={h} />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="section-padding state-center">
        <ExploreError />
      </div>
    )
  }

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <StarsBackground className="h-full w-full opacity-100" />
        <ShootingStars
          starColor={starColor}
          trailColor={trailColor}
          className="h-full w-full"
        />
      </div>

      <div className="relative z-10 w-full h-full section-padding">
        <div className="relative mt-4 space-y-4">
          {allPublications.length === 0 ? (
            <div className="h-screen state-center w-full">
              <ExploreEmpty />
            </div>
          ) : (
            chunks.map((chunk, idx) => {
              if (chunk.type === 'carousel') {
                // Only render carousel when recommended users are loaded and available
                if (isLoadingRecommended || carouselUsers.length === 0) return null

                return (
                  <motion.div
                    key={chunk.key}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  >
                    <RecommendedUsersCarousel users={carouselUsers} />
                  </motion.div>
                )
              }

              return (
                <div
                  key={idx}
                  className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4"
                >
                  {chunk.items.map((pub) => (
                    <motion.div
                      key={pub.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                    >
                      <PublicationCard
                        publication={pub}
                        userId={user?.id}
                      />
                    </motion.div>
                  ))}
                </div>
              )
            })
          )}
        </div>

        {/* Infinite scroll trigger */}
        <div
          ref={observerRef}
          className="h-20 flex items-center justify-center mt-8"
        >
          <AnimatePresence>
            {isFetchingNextPage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ExploreLoader />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}