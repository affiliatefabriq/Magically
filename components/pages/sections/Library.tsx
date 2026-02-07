"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useGenerationHistory, usePublishJob } from "@/hooks/useGenerations";
import { JobImage } from "@/components/shared/create/JobImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DownloadCloud, Loader2, Share2, UploadCloud, MoreVertical, Check, X } from "lucide-react";
import { JobEmpty } from "@/components/states/empty/Empty";
import { LargeListLoader } from "@/components/states/loaders/Loaders";
import { API_URL } from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/utils";
import { FullscreenImageViewer } from "@/components/ui/fullscreen-image";

export const Library = () => {
  const t = useTranslations("Pages.Library");
  const { data: jobs, isLoading } = useGenerationHistory();
  const publishJob = usePublishJob();

  const [expandedPromptsMap, setExpandedPromptsMap] = useState<Record<string, boolean>>({});
  const [downloadedMap, setDownloadedMap] = useState<Record<string, boolean>>({});
  const [sharedMap, setSharedMap] = useState<Record<string, boolean>>({});
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const handleShare = async (jobId: string, resultUrl: string) => {
    const shareUrl = `${API_URL}${resultUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({ url: shareUrl });
      } catch (err) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
    }

    setSharedMap(prev => ({ ...prev, [jobId]: true }));
    setTimeout(() => {
      setSharedMap(prev => ({ ...prev, [jobId]: false }));
    }, 2000);
  };

  const handleDownload = async (jobId: string, resultUrl: string) => {
    try {
      const fileUrl = `${API_URL}${resultUrl}`;
      const res = await fetch(fileUrl, { credentials: "include" });

      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `publication-${jobId}.${resultUrl?.endsWith("mp4") ? "mp4" : "jpg"}`;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);

      setDownloadedMap(prev => ({ ...prev, [jobId]: true }));
      setTimeout(() => {
        setDownloadedMap(prev => ({ ...prev, [jobId]: false }));
      }, 2000);
    } catch (e) {
      console.error("Download error", e);
    }
  };

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
                onClick={() => setFullscreenImage(job.resultUrl)}
                className="object-contain! cursor-pointer"
              />
              <FullscreenImageViewer
                src={fullscreenImage}
                onClose={() => setFullscreenImage(null)}
              />
            </div>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  {job.meta?.prompt ? (
                    job.meta.prompt.length > 128 ? (
                      <>
                        <p className="text-sm text-muted-foreground wrap-break-word">
                          {expandedPromptsMap[job.id]
                            ? job.meta.prompt
                            : `${job.meta.prompt.slice(0, 128)}...`}
                        </p>
                        <Button
                          variant="link"
                          size="sm"
                          className="px-0 h-auto cursor-pointer text-muted-foreground font-normal"
                          onClick={() => {
                            setExpandedPromptsMap((prev) => ({
                              ...prev,
                              [job.id]: !prev[job.id],
                            }));
                          }}
                        >
                          {expandedPromptsMap[job.id] ? null : t("expand")}
                        </Button>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground wrap-break-word">{job.meta.prompt}</p>
                    )
                  ) : (
                    <p className="text-sm text-muted-foreground">{t("noPrompt")}</p>
                  )}
                </div>

                {job.status === 'completed' && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="shrink-0">
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleShare(job.id, job.resultUrl)}>
                        {sharedMap[job.id] ? (
                          <><Check className="mr-2 size-4" /> {t("copied")}</>
                        ) : (
                          <><Share2 className="mr-2 size-4" /> {t("share")}</>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload(job.id, job.resultUrl)}>
                        {downloadedMap[job.id] ? (
                          <><Check className="mr-2 size-4" /> {t("downloaded")}</>
                        ) : (
                          <><DownloadCloud className="mr-2 size-4" /> {t("download")}</>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              <div className="text-xs text-muted-foreground">
                {formatDate(job.createdAt)}
              </div>

              {job.status === 'completed' && !job.isPublished && (
                <Button
                  className="w-full btn-solid"
                  onClick={() => publishJob.mutate(job.id)}
                  disabled={publishJob.isPending}
                >
                  {publishJob.isPending ? (
                    <Loader2 className="animate-spin mr-2 size-4" />
                  ) : (
                    <UploadCloud className="mr-2 size-4" />
                  )}
                  {t("toReel")}
                </Button>
              )}

              {job.isPublished && (
                <Button variant="ghost" disabled className="w-full btn-outline">
                  {t("published")}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};