"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { HiggsfieldMotionError, NotAuthorized } from "@/components/states/error/Error";
import { ExploreLoader } from "@/components/states/loaders/Loaders";
import { useUser } from "@/hooks/useAuth";
import { HiggsMotion, useHiggsfieldMotions } from "@/hooks/useHiggsfield";

export const VideoEffects = () => {
  const t = useTranslations("Pages.Effects.VideoEffects");
  const { data: user } = useUser();
  const { data: motions, isLoading, isError } = useHiggsfieldMotions();

  if (!user)
    <div className="section-padding state-center">
      <NotAuthorized />
    </div>;

  if (isLoading)
    <div className="section-padding">
      <ExploreLoader />
    </div>;

  if (isError)
    <div className="section-padding state-center">
      <HiggsfieldMotionError />
    </div>;

  return (
    <section className="flex flex-col section-padding ">
      <h1 className="title-text my-4">{t("title")}</h1>
      <div className="grid-4 gap-6!">
        {motions?.map((motion: HiggsMotion) => (
          <Link
            href={`/create/video-effects/${motion.id}`}
            key={motion.id}
            className="flex flex-col items-start justify-start hover:scale-102 magic-transition cursor-pointer"
          >
            <Image
              src={motion.media.url}
              alt={motion.name}
              width={300}
              height={300}
              className="rounded-2xl object-contain w-full"
            />

            <div className="mt-2 font-medium">{motion.name}</div>
          </Link>
        ))}
      </div>
    </section>
  );
};
