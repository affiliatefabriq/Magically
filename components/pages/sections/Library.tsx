"use client";

import { useTranslations } from "next-intl";
import { useGenerationHistory, usePublishJob } from "@/hooks/useGenerations";
import { JobImage } from "@/components/shared/create/JobImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DownloadCloud, Loader2, Share2, UploadCloud } from "lucide-react";
import { JobEmpty } from "@/components/states/empty/Empty";
import { LargeListLoader } from "@/components/states/loaders/Loaders";
import { API_URL } from "@/lib/api";

export const Library = () => {
  const t = useTranslations("Pages.Library");
  const { data: jobs, isLoading } = useGenerationHistory();

  const publishJob = usePublishJob();

  return (
    <section className="container mx-auto section-padding pb-24">
      <h1 className="title-text mt-4 mb-6">{t("title")}</h1>

      {isLoading && <LargeListLoader />}
      {!isLoading && jobs?.length === 0 && <JobEmpty />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs?.map((job: any) => (
          <Card key={job.id} className="theme shadow-none border overflow-hidden p-0">
            <div className="relative aspect-square">
              <JobImage
                status={job.status}
                imageUrl={job.resultUrl}
                alt={job.meta?.prompt}
                error={job.errorMessage}
              />
            </div>
            <CardContent className="p-4 space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2 min-h-10">
                {job.meta?.prompt || "No prompt"}
              </p>

              <div className="flex flex-wrap gap-2">
                {job.status === 'completed' && (
                  <Button variant="outline" className="flex-1" onClick={() => {
                    if (navigator.share) navigator.share({ url: job.resultUrl });
                  }}>
                    <Share2 className="mr-2 size-4" /> Поделиться
                  </Button>
                )}

                {job.status === 'completed' && !job.isPublished && (
                  <Button
                    className="flex-1 btn-solid"
                    onClick={() => publishJob.mutate(job.id)}
                    disabled={publishJob.isPending}
                  >
                    {publishJob.isPending ? <Loader2 className="animate-spin" /> : <UploadCloud className="mr-2 size-4" />}
                    В ленту!
                  </Button>
                )}

                {job.isPublished && (
                  <Button variant="ghost" disabled className="flex-1 btn-outline">
                    Опубликовано
                  </Button>
                )}

                {/* Download Button */}
                {job.status === 'completed' && (
                  <Button
                    variant="outline"
                    className="flex-1 btn-solid"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = API_URL + job.resultUrl;
                      link.download = `image-${job.id}.png`;
                      link.click();
                    }}
                  >
                    <DownloadCloud className="mr-2 size-4" />
                    Скачать
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};