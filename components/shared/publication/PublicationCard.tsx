"use client";

import Link from "next/link";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Dot, Download, Heart, MessageCircle, Share2, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { API_URL } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Publication } from "@/types";
import { UserAvatar } from "../user/UserAvatar";
import { AuthRequiredPopover } from "./AuthRequiredPopover";
import { LikeButton } from "./LikeButton";
import { PublicationActions } from "./PublicationActions";
import { PublicationImage } from "./PublicationImage";
import { VideoRender } from "./VideoRender";
import { PublicationDialog } from "./PublicationDialog";

type PublicationCardProps = {
  publication: Publication;
  userId?: string;
  id?: any;
};

export const PublicationCard = ({ publication, userId }: PublicationCardProps) => {
  const t = useTranslations("Components.Publication");

  const [expandedCommentsMap, setExpandedCommentsMap] = useState<Record<string, boolean>>({});
  const [isShared, setIsShared] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/publications/${publication.id}`;

    if (navigator.share) {
      try {
        await navigator.share({ url: shareUrl });
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
      } catch (err) {
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
      a.download = `publication-${publication.id}.${publication.videoUrl ? "mp4" : "jpg"}`;
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
    const elem = document.querySelector(".publication-fullscreen-target-mobile") as HTMLElement;
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


  return (
    <div className="flex flex-col items-start justify-center gap-2">
      <div className="relative w-full group">
        <div className="flex flex-col md:hidden">
          <div className="flex items-start md:hidden flex-row gap-2">
            <Link href={`/profile/${publication.author.username}`} className="mt-2">
              <UserAvatar {...publication.author} size="sm" />
            </Link>
            <div key={publication.id}>
              <div className="flex justify-start items-center">
                <Link
                  href={`/profile/${publication.author.username}`}
                  className="text-base font-semibold"
                >
                  {publication.author.username}
                </Link>
                <Dot />
                <div className="text-sm secondary-text">{formatDate(publication.createdAt)}</div>
              </div>
              <article className="mb-2">
                {publication.content.length > 128 ? (
                  <>
                    <span className="prompt-text text-tertiary-text">
                      {expandedCommentsMap[publication.id]
                        ? publication.content
                        : `${publication.content.slice(0, 128)}...`}
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
                    className="publication-fullscreen-target-mobile object-contain! cursor-pointer"
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
              <div className="flex items-center justify-start gap-4 mt-2">
                {userId ? (
                  <LikeButton {...publication} />
                ) : (
                  <AuthRequiredPopover>
                    <button className="flex items-center justify-center bg-none p-0 magic-transition gap-1">
                      <Heart className="size-5 stroke-1" />
                      <span>{publication.likeCount}</span>
                    </button>
                  </AuthRequiredPopover>
                )}
                <motion.div whileTap={{ scale: 0.9 }}>
                  <Link
                    href={`/publications/${publication.id}`}
                    key={publication.id}
                    className="flex items-center justify-center p-0 gap-1 hover:text-lime-500 transition-colors"
                  >
                    <MessageCircle className="size-5 stroke-1" />
                    <span>{publication.commentCount}</span>
                  </Link>
                </motion.div>
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
                {userId === publication.author.id && (
                  <PublicationActions publicationId={publication.id} initialContent={publication.content} />
                )}
              </div>
            </div>
          </div>
          <Separator className="flex sm:hidden mt-4" />
        </div>
        <PublicationDialog publication={publication}>
          <div key={publication.id} className="hidden md:flex">
            {publication.videoUrl && (
              <VideoRender
                src={`${API_URL}${publication.videoUrl}`}
                className="rounded-xl object-cover aspect-square w-full"
              />
            )}
            {publication.imageUrl && <PublicationImage src={publication.imageUrl} alt="publication" />}
          </div>
        </PublicationDialog>
      </div>
    </div>
  );
};

export const PublicationCardSimplified = ({ publication, id }: PublicationCardProps) => {
  return (
    <div
      className={`border border-white dark:border-black row-span-1 ${id === 3 || id === 6 ? "col-span-2 row-span-2" : "col-span-1"}`}
    >
      <div className="relative group">
        <Link href={`/publications/${publication.id}`} key={publication.id}>
          {publication.videoUrl ? (
            <video
              src={`${API_URL}${publication.videoUrl}`}
              autoPlay
              loop
              muted
              playsInline
              className="object-cover aspect-square w-full"
            />
          ) : (
            <PublicationImage
              src={publication.imageUrl!}
              alt="publication"
              className="rounded-none!"
            />
          )}
        </Link>
      </div>
    </div>
  );
};