"use client";

import { useTheme } from "next-themes";
import { NotFoundPage } from "@/components/states/empty/Empty";
import { ShootingStars } from "@/components/ui/magic/shooting-stars";
import { StarsBackground } from "@/components/ui/magic/stars-background";

export default function NotFound() {
    const { theme } = useTheme();


    const starColor = theme === "dark" ? "#FFFFFF" : "#111111";
    const trailColor = theme === "dark" ? "#F020F0" : "#A174D1";

    return (
        <div className="state-center">
            {/* Stars Layer */}
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <StarsBackground className="h-full! w-full! opacity-100" />
                <ShootingStars
                    starColor={starColor}
                    trailColor={trailColor}
                    className="h-full! w-full!"
                />
            </div>
            <NotFoundPage />
        </div>
    );
};