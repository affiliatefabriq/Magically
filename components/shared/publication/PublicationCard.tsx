"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { API_URL } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Publication } from "@/types";
import { UserProfile } from "../user/UserProfile";
import { LikeButton } from "./LikeButton";
import { PublicationActions } from "./PublicationActions";
import { SubscribeButton } from "./SubscribeButton";

type PublicationCardProps = {
  publication: Publication;
  userId?: string;
  id?: any;
};

export const PublicationCard = ({ publication, userId }: PublicationCardProps) => {
  return (
    <div className="flex flex-col items-start justify-center gap-2">
      <div className="flex justify-between md:hidden w-full">
        <UserProfile {...publication.author} />
      </div>
      <div className="relative w-full group">
        <Link href={`/publications/${publication.id}`} key={publication.id}>
          {publication.videoUrl && (
            <video
              src={`${API_URL}${publication.videoUrl}`}
              autoPlay
              loop
              muted
              playsInline
              className="rounded-xl object-cover aspect-square w-full"
            />
          )}
          {publication.imageUrl && (
            <Image
              src={`${API_URL}${publication.imageUrl}`}
              width={1024}
              height={1024}
              alt="publicationlication"
              className="rounded-xl object-cover aspect-square w-full"
            />
          )}
        </Link>
        <div
          className="absolute hidden md:flex bottom-0 left-0 right-0 bg-white/20 dark:bg-black/20 
             text-white p-4 text-xs rounded-b-lg rounded-t-3xl opacity-0 backdrop-blur-3xl 
             translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 transition duration-200 ease-in"
        >
          <div className="flex flex-col items-start justify-center gap-4 px-4">
            <UserProfile {...publication.author} />
            <div className="flex items-center justify-start gap-4 mt-2">
              <LikeButton {...publication} />
              <div className="flex items-center justify-center bg-none hover:bg-transparent p-0 transition-all gap-1">
                <MessageCircle className="size-5 stroke-1" />
                <span>{publication.commentCount}</span>
              </div>
              {publication.author.id === userId ? (
                <PublicationActions publicationId={publication.id} initialContent={publication.content} />
              ) : (
                ""
              )}
            </div>
          </div>
          <SubscribeButton
            publication={publication}
            style="glass"
            className={`${userId === publication.author.id ? 'hidden' : 'block'}`}
          />
        </div>
        <div className="flex md:hidden flex-col items-start justify-center gap-2 px-2">
          <div className="flex items-center justify-start gap-4 mt-2">
            <LikeButton {...publication} />
            <Link href={`/publications/${publication.id}`} key={publication.id} className="flex items-center justify-center bg-none p-0 magic-transition gap-1">
              <MessageCircle className="size-5 stroke-1" />
              <span>{publication.commentCount}</span>
            </Link>
            {publication.author.id === userId ? (
              <PublicationActions publicationId={publication.id} initialContent={publication.content} />
            ) : (
              ""
            )}
          </div>
          <div className="my-1">{publication.content}</div>
          <div className="text-sm secondary-text mb-4">{formatDate(publication.createdAt)}</div>
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