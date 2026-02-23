'use client'

import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from '@/components/ui/carousel'
import { RecommendedUserCard } from './RecommendedUserCard'
import { useTranslations } from 'next-intl'

interface Props {
    users: any[]
}

export const RecommendedUsersCarousel = ({ users }: Props) => {
    const t = useTranslations("Pages.Explore");

    if (!users?.length) return null

    return (
        /*
         * KEY FIX: every wrapper needs min-w-0 + overflow-hidden.
         *
         * shadcn SidebarProvider shifts the main content area via a CSS variable
         * (--sidebar-width) applied as margin or transform on the sibling div.
         * Embla Carousel measures its root element with getBoundingClientRect(),
         * but if any ancestor is missing min-w-0 in a flex context, that element
         * can report a width equal to the full viewport — causing cards to spill
         * past the right edge.
         *
         * The fix: contain every flex child with min-w-0 so width is always
         * derived from the available space AFTER the sidebar offset, and clip the
         * overflow visually at the outermost wrapper.
         */
        <div className="relative w-full min-w-0 overflow-hidden my-10">
            <div className="mb-5 px-1">
                <h3 className="text-xl font-bold">{t("Suggested")}</h3>
            </div>

            {/* overflow-hidden here is the hard visual clip guard */}
            <div className="w-full min-w-0 overflow-hidden">
                <Carousel
                    opts={{
                        align: 'start',
                        dragFree: true,
                        /*
                         * trimSnaps keeps Embla from scrolling past the last card,
                         * which would expose empty space and look broken.
                         */
                        containScroll: 'trimSnaps',
                    }}
                    className="w-full min-w-0"
                >
                    {/*
           * Standard Embla negative-margin trick for gutters.
           * overflow-visible lets Embla animate sibling cards into view;
           * the parent overflow-hidden clips them visually — this combo
           * is intentional and required for the carousel to work correctly.
           */}
                    <CarouselContent className="-ml-3">
                        {users.map((user) => (
                            <CarouselItem
                                key={user.id}
                                className="pl-3 min-w-0 basis-[85%] xs:basis-[70%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                            >
                                {/*
                 * min-w-0 on the card itself prevents long text content
                 * (usernames, bios) from expanding the item beyond its basis.
                 */}
                                <div className="min-w-0 h-full p-3 rounded-2xl bg-card/40 backdrop-blur border border-border/50 hover:border-border transition-colors">
                                    <RecommendedUserCard user={user} />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </div>
    )
}