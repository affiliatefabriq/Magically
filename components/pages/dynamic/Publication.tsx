"use client";

import { useEffect, useState } from "react";
import { Heart, MessageCircle, Share2, Download, Check, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { AuthRequiredPopover } from "@/components/shared/publication/AuthRequiredPopover";
import { CommentSection } from "@/components/shared/publication/CommentSection";
import { LikeButton } from "@/components/shared/publication/LikeButton";
import { PublicationActions } from "@/components/shared/publication/PublicationActions";
import { PublicationImage } from "@/components/shared/publication/PublicationImage";
import { VideoRender } from "@/components/shared/publication/VideoRender";
import { UserProfile } from "@/components/shared/user/UserProfile";
import { ExploreError } from "@/components/states/error/Error";
import { PublicationLoader } from "@/components/states/loaders/Loaders";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useAuth";
import { usePublication } from "@/hooks/usePublications";
import { API_URL } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { BackButton } from "@/components/shared/layout/BackButton";
import { FollowButton } from "@/components/shared/user/FollowButton";

export const Publication = ({ publicationId }: { publicationId: string }) => {
  const t = useTranslations("Components.PublicationActions");

  const [expandedCommentsMap, setExpandedCommentsMap] = useState<Record<string, boolean>>({});
  const [isShared, setIsShared] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);

  const { data: user } = useUser();
  const { data: publication, isLoading, isError } = usePublication(publicationId);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/publications/${publicationId}`;

    if (navigator.share) {
      try {
        await navigator.share({ url: shareUrl });
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
      } catch (err) {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000);
    }
  };

  const handleDownload = async () => {
    if (!publication) return;

    try {
      const fileUrl = `${API_URL}${publication.imageUrl || publication.videoUrl}`;
      const res = await fetch(fileUrl, { credentials: "include" });

      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `publication-${publicationId}.${publication.videoUrl ? "mp4" : "jpg"}`;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);

      setIsDownloaded(true);
      setTimeout(() => setIsDownloaded(false), 2000);
    } catch (e) {
      console.error("Download error", e);
    }
  };

  const goFullScreen = () => {
    const elem = document.querySelector(".publication-dynamic-fullscreen-target") as HTMLElement;
    if (!elem) return;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if ((elem as any).webkitRequestFullscreen) {
      (elem as any).webkitRequestFullscreen();
    } else if ((elem as any).msRequestFullscreen) {
      (elem as any).msRequestFullscreen();
    }
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
    }
  };

  useEffect(() => {
    const onChange = () => {
      setIsNativeFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  if (isError)
    return (
      <div className="state-center section-padding">
        <ExploreError />
      </div>
    );
  if (isLoading) return <PublicationLoader />;
  if (!publication) return null;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 section-padding">
      <BackButton />
      <div className="flex flex-col items-start justify-start gap-4 mt-12 md:mt-4">
        <div className="flex justify-between w-full">
          <UserProfile {...publication.author} />
          {user && user.id !== publication.author.id && (
            <FollowButton id={publication.author.id} isFollowing={publication.isFollowing ?? false} />
          )}
        </div>
        {publication.videoUrl && (
          <VideoRender
            src={`${API_URL}${publication.videoUrl}`}
            className="rounded-xl object-cover aspect-square w-full"
          />
        )}
        {publication.imageUrl && (
          <div className="relative group">
            <PublicationImage
              src={publication.imageUrl}
              alt="publication"
              onClick={goFullScreen}
              className="publication-dynamic-fullscreen-target object-contain! cursor-pointer"
            />
            {isNativeFullscreen && (
              <button
                onClick={exitFullScreen}
                className="top-6 right-6 z-10000 text-white bg-black/60 hover:bg-black/80 p-2 rounded-full"
              >
                <X className="size-6" />
              </button>
            )}
          </div>
        )}

        <div className="flex flex-col items-start justify-center gap-2 px-2 w-full">
          <div className="flex items-center justify-start gap-4 w-full">
            {user ? (
              <LikeButton {...publication} />
            ) : (
              <AuthRequiredPopover>
                <button className="flex items-center justify-center bg-none hover:bg-transparent p-0 magic-transition gap-1 hover:text-red-500 hover:dark:text-red-400 transition-colors">
                  <Heart className="size-5 stroke-1" />
                  <span>{publication.likeCount}</span>
                </button>
              </AuthRequiredPopover>
            )}
            <button className="flex items-center justify-center p-0 gap-1 hover:text-lime-500 transition-colors">
              <MessageCircle className="size-5 stroke-1" />
              <span>{publication.commentCount}</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center justify-center p-0 gap-1 hover:text-blue-500 transition-colors"
            >
              {isShared ? <Check className="size-5 stroke-1" /> : <Share2 className="size-5 stroke-1" />}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center justify-center p-0 gap-1 hover:text-green-500 transition-colors"
            >
              {isDownloaded ? <Check className="size-5 stroke-1" /> : <Download className="size-5 stroke-1" />}
            </button>
            {publication.author.id === user?.id && (
              <PublicationActions publicationId={publication.id} initialContent={publication.content} />
            )}
          </div>
          <article className="mb-2 w-full">
            {publication.content.length > 256 ? (
              <>
                <span className="text-base prompt-text text-tertiary-text">
                  {expandedCommentsMap[publication.id]
                    ? publication.content
                    : `${publication.content.slice(0, 256)}...`}
                </span>
                <Button
                  variant="link"
                  size="sm"
                  className="px-0 h-auto cursor-pointer text-muted-foreground font-normal"
                  onClick={() => {
                    setExpandedCommentsMap((prev) => ({
                      ...prev,
                      [publication.id]: !prev[publication.id],
                    }));
                  }}
                >
                  {expandedCommentsMap[publication.id] ? null : t("readMore")}
                </Button>
              </>
            ) : (
              <span className="prompt-text text-tertiary-text">{publication.content}</span>
            )}
          </article>
          <div className="text-sm secondary-text mb-4">{formatDate(publication.createdAt)}</div>
        </div>
      </div>
      <CommentSection publicationId={publicationId} />
    </section>
  );
};