"use client";

import Link from "next/link";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { PublicationImage } from "@/components/shared/publication/PublicationImage";
import { JobEmpty, LibraryEmpty } from "@/components/states/empty/Empty";
import { NotAuthorized } from "@/components/states/error/Error";
import { ExploreLoader, LargeListLoader } from "@/components/states/loaders/Loaders";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/hooks/useAuth";
import { useGallery, usePublishGallery } from "@/hooks/useGallery";
import { useGenerationHistory } from "@/hooks/useGenerations";
import { API_URL } from "@/lib/api";
import { JobImage } from "@/components/shared/create/JobImage";
import { Button } from "@/components/ui/button";

export const Library = () => {
  const t = useTranslations("Pages.Library");
  const [galleryFilters] = useState({ sortBy: "newest" });

  const { data: user } = useUser();
  const { data: galleryItems, isLoading: isGalleryLoading } = useGallery(galleryFilters);
  const { data: jobs, isLoading: isJobsLoading } = useGenerationHistory();
  const publishGalleryItem = usePublishGallery();

  const handlePublishGallery = (galleryItemId: string) => {
    publishGalleryItem.mutate(galleryItemId);
  };

  if (!user)
    return (
      <div className="state-center">
        <NotAuthorized />
      </div>
    );

  return (
    <section className="container mx-auto section-padding">
      <h1 className="title-text mt-4 mb-6">{t("title")}</h1>

      <Tabs defaultValue="jobs" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-2">
          <TabsTrigger value="jobs">{t("Jobs")}</TabsTrigger>
          <TabsTrigger value="gallery">{t("Gallery")}</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs">
          {isJobsLoading && <LargeListLoader />}
          {jobs?.length === 0 && (
            <div className="state-center">
              <JobEmpty />
            </div>
          )}
          <div className="grid-3 gap-6!">
            {jobs?.map((job: any) => (
              <div key={job.id}>
                <Card className="theme shadow-none overflow-hidden p-0 border-none rounded-none">
                  <CardContent className="p-0 pt-0 space-y-3">
                    <JobImage
                      status={job.status}
                      imageUrl={job.resultUrl}
                      alt={job.meta?.prompt}
                      error={job.errorMessage}
                    />

                    <p className="text-sm text-tertiary-text">
                      {job.meta?.prompt || "No prompt"}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}

          </div>
        </TabsContent>

        <TabsContent value="gallery">
          {isGalleryLoading && <ExploreLoader />}
          {galleryItems?.length === 0 && (
            <div className="state-center">
              <LibraryEmpty />
            </div>
          )}
          <div className="grid-4 gap-4">
            {galleryItems?.map((item: any) => (
              <div className="flex flex-col" key={item.id}>
                <Link href={`${API_URL}${item.imageUrl}`} className="relative group rounded-lg overflow-hidden hover:scale-102 magic-transition">
                  <PublicationImage
                    src={`${API_URL}${item.imageUrl}`}
                    alt={item.prompt}
                    className="object-cover w-full aspect-square"
                  />
                </Link>
                <Button className="btn-outline w-full mt-2" onClick={() => { handlePublishGallery(item.id) }}>
                  Upload to reel
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};
