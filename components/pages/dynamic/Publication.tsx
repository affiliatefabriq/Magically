"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, MessageCircle } from "lucide-react";

import { CommentSection } from "@/components/shared/publication/CommentSection";
import { LikeButton } from "@/components/shared/publication/LikeButton";
import { PublicationActions } from "@/components/shared/publication/PublicationActions";
import { SubscribeButton } from "@/components/shared/publication/SubscribeButton";
import { UserProfile } from "@/components/shared/user/UserProfile";
import { ExploreError, NotAuthorized } from "@/components/states/error/Error";
import { ExploreLoader } from "@/components/states/loaders/Loaders";
import { useUser } from "@/hooks/useAuth";
import { usePublication } from "@/hooks/usePublications";
import { API_URL } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export const Publication = ({ publicationId }: { publicationId: string }) => {
  const { data: user } = useUser();
  const { data: publication, isLoading, isError } = usePublication(publicationId);

  // early returns to avoid accessing publication props when undefined
  if (!user)
    return (
      <div className="state-center">
        <NotAuthorized />
      </div>
    );
  if (isError)
    return (
      <div className="state-center">
        <ExploreError />
      </div>
    );
  if (isLoading) return <ExploreLoader />;
  if (!publication) return null;

  return (
    <section className="grid-2 section-padding">
      <div className="fixed md:hidden h-12 backdrop-blur-2xl w-full top-0 left-0 right-0 text-sm z-10">
        <Link href="/" className="flex items-center justify-start h-full ml-2 link-text">
          <ChevronLeft className="size-4 " />
          <span>Back to explore</span>
        </Link>
      </div>
      <div className="flex flex-col items-start justify-start gap-4 mt-12 md:mt-4">
        <div className="flex justify-between w-full">
          <UserProfile {...publication.author} />
          <SubscribeButton publication={publication} style="login" />
        </div>
        {publication.videoUrl ? (
          <video
            src={`${API_URL}${publication.videoUrl}`}
            autoPlay
            loop
            muted
            playsInline
            className="rounded-xl object-cover aspect-square w-full"
          />
        ) : (
          <Image
            src={`${API_URL}${publication.imageUrl}`}
            width={4096}
            height={4096}
            alt="publication"
            className="rounded-xl object-cover aspect-square w-full"
          />
        )}

        <div className="flex flex-col items-start justify-center gap-2 px-4">
          <div className="flex items-center justify-start gap-4">
            <LikeButton {...publication} />
            <button className="flex items-center justify-center bg-none hover:bg-transparent p-0 magic-transition gap-1">
              <MessageCircle className="size-5 hover:text-white hover:fill-white stroke-1" />
              <span>{publication.commentCount}</span>
            </button>
            {publication.author.id === user.id ? (
              <PublicationActions publicationId={publication.id} initialContent={publication.content} />
            ) : (
              ""
            )}
          </div>
          <div className="my-1">{publication.content}</div>
          <div className="text-sm secondary-text mb-4">{formatDate(publication.createdAt)}</div>
        </div>
      </div>
      {/* блок комментариев */}
      <CommentSection publicationId={publicationId} />
    </section>
  );
};
