"use client";

import Link from "next/link";
import Image from "next/image";

import { API_URL } from "@/lib/api";
import { motion } from "framer-motion";
import { Publication } from "@/types";
import { formatDate } from "@/lib/utils";
import { LikeButton } from "./LikeButton";
import { VideoRender } from "./VideoRender";
import { Button } from "@/components/ui/button";
import { UserProfile } from "../user/UserProfile";
import { SubscribeButton } from "./SubscribeButton";
import { Dot, Heart, MessageCircle } from "lucide-react";
import { PublicationActions } from "./PublicationActions";
import { AuthRequiredPopover } from "./AuthRequiredPopover";
import { UserAvatar } from "../user/UserAvatar";
import { Separator } from "@/components/ui/separator";

type PublicationCardProps = {
  publication: Publication;
  userId?: string;
  id?: any;
};

export const PublicationCard = ({ publication, userId }: PublicationCardProps) => {
  return (
    <div className="flex flex-col items-start justify-center gap-2">
      <div className="relative w-full group">
        <div className="flex flex-col md:hidden">
          <div className="flex md:hidden flex-row gap-2">
            <UserAvatar {...publication.author} size="sm" />
            {/* {publication.author.id === userId ? (
              <PublicationActions publicationId={publication.id} initialContent={publication.content} />
              ) : (
                ""
                )} */}
            <div key={publication.id}>
              <div className="flex justify-start items-center">
                <p className="text-base font-semibold">{publication.author.username}</p>
                <Dot />
                <div className="text-sm secondary-text">{formatDate(publication.createdAt)}</div>
              </div>
              <div className="text-sm mb-1">{publication.content}</div>
              {publication.videoUrl && (
                <VideoRender
                  src={`${API_URL}${publication.videoUrl}`}
                  className="rounded-xl object-cover aspect-square w-full"
                />
              )}
              {publication.imageUrl && (
                <Image
                  src={`${API_URL}${publication.imageUrl}`}
                  width={1024}
                  height={1024}
                  alt="publication"
                  className="rounded-xl object-cover aspect-square w-full"
                />
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
              </div>
            </div>
          </div>
          <Separator className="mt-4" />
        </div>
        <div className="hidden md:flex">
          {publication.videoUrl && (
            <VideoRender
              src={`${API_URL}${publication.videoUrl}`}
              className="rounded-xl object-cover aspect-square w-full"
            />
          )}
          {publication.imageUrl && (
            <Image
              src={`${API_URL}${publication.imageUrl}`}
              width={1024}
              height={1024}
              alt="publication"
              className="rounded-xl object-cover aspect-square w-full"
            />
          )}
        </div>
        <div
          className="absolute hidden md:flex bottom-0 left-0 right-0 bg-white/20 dark:bg-black/20 
             text-white px-4 py-6 text-xs rounded-b-lg rounded-t-3xl opacity-0 backdrop-blur-3xl 
             translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 transition duration-200 ease-in"
        >
          <div className="flex flex-col items-start justify-center gap-4 px-4">
            <UserProfile {...publication.author} />
            <div className="flex items-center justify-start gap-4 mt-2">
              {userId ? (
                <LikeButton {...publication} />
              ) : (
                <AuthRequiredPopover>
                  <button className="flex items-center justify-center bg-none hover:bg-transparent p-0 magic-transition gap-1">
                    <Heart className="size-5 stroke-1" />
                    <span>{publication.likeCount}</span>
                  </button>
                </AuthRequiredPopover>
              )}
              <motion.div whileTap={{ scale: 0.9 }}>
                <Link href={`/publications/${publication.id}`} key={publication.id} className="flex items-center justify-center p-0 gap-1 hover:text-lime-500 transition-colors">
                  <MessageCircle className="size-5 stroke-1" />
                  <span>{publication.commentCount}</span>
                </Link>
              </motion.div>
              {publication.author.id === userId ? (
                <PublicationActions publicationId={publication.id} initialContent={publication.content} />
              ) : (
                ""
              )}
            </div>
          </div>
          {userId !== publication.author.id && (
            userId ? (
              <SubscribeButton
                publication={publication}
                style="glass"
              />
            ) : (
              <AuthRequiredPopover>
                <Button className="btn-glass">Subscribe</Button>
              </AuthRequiredPopover>
            )
          )}
        </div>
        <div className="flex md:hidden flex-col items-start justify-center gap-2 px-2">

        </div>
      </div>
    </div>
  );
};

export const PublicationCardSimplified = ({ publication, id }: PublicationCardProps) => {
  return (
    <div className={`border border-white dark:border-black row-span-1 ${id === 3 || id === 6 ? "col-span-2 row-span-2" : "col-span-1"}`}>
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
            <Image
              src={`${API_URL}${publication.imageUrl}`}
              width={1024}
              height={1024}
              alt="publication"
              className="object-cover aspect-square w-full"
            />
          )}
        </Link>
      </div>
    </div>
  );
};