"use client";

import { Heart } from "lucide-react";

import { Publication } from "@/types";
import { motion } from "framer-motion";
import {
  useLikePublication,
  useUnlikePublication
} from "@/hooks/usePublications";

export const LikeButton = (publication: Publication) => {
  const likePublication = useLikePublication();
  const unLikePublication = useUnlikePublication();

  const handleLike = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (likePublication?.mutate) {
      likePublication.mutate(publication.id);
      return;
    }

    if (likePublication?.mutateAsync) {
      likePublication.mutateAsync(publication.id).catch(() => { });
      return;
    }
  };

  const handleUnlike = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (unLikePublication?.mutate) {
      unLikePublication.mutate(publication.id);
      return;
    }

    if (unLikePublication?.mutateAsync) {
      unLikePublication.mutateAsync(publication.id).catch(() => { });
      return;
    }
  };

  return (
    <motion.div whileTap={{ scale: 0.9 }}>
      <button
        className="flex items-center justify-center bg-none hover:bg-transparent p-0 magic-transition gap-1 hover:text-red-500 hover:dark:text-red-400 transition-colors"
        onClick={publication.isLiked ? handleUnlike : handleLike}
      >
        <Heart
          className={`size-5 
          ${publication.isLiked ? "text-red-500 fill-red-500" : ""} 
          dark:${publication.isLiked ? "text-red-400 fill-red-400" : ""} stroke-1`}
        />
        <span
          className={`${publication.isLiked ? "text-red-500 fill-red-500" : ""} 
          dark:${publication.isLiked ? "text-red-400 fill-red-400" : ""} stroke-1`}
        >
          {publication.likeCount}</span>
      </button>
    </motion.div>
  );
};
