"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

import { useLikePublication, useUnlikePublication } from "@/hooks/usePublications";
import { Publication } from "@/types";

export const LikeButton = (publication: Publication) => {
  const likeMutation = useLikePublication();
  const unlikeMutation = useUnlikePublication();

  const [isLiked, setIsLiked] = useState(publication.isLiked);
  const [likeCount, setLikeCount] = useState(publication.likeCount);

  const loading = likeMutation.isPending || unlikeMutation.isPending;

  const handleToggle = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (loading) return;

    const nextLiked = !isLiked;

    // 🚀 мгновенный UI
    setIsLiked(nextLiked);
    setLikeCount((prev) => (nextLiked ? prev + 1 : prev - 1));

    try {
      if (nextLiked) {
        await likeMutation.mutateAsync(publication.id);
      } else {
        await unlikeMutation.mutateAsync(publication.id);
      }
    } catch (err) {
      // ❌ rollback если ошибка
      setIsLiked(!nextLiked);
      setLikeCount((prev) => (nextLiked ? prev - 1 : prev + 1));
      console.error("like error", err);
    }
  };

  return (
    <motion.div whileTap={{ scale: 0.9 }}>
      <button
        onClick={handleToggle}
        className="flex items-center gap-1 transition"
      >
        <Heart
          className={`size-5 stroke-1 transition
          ${isLiked ? "text-red-500 fill-red-500" : ""}
          dark:${isLiked ? "text-red-400 fill-red-400" : ""}`}
        />
        <span className={`font-light
          ${isLiked ? "text-red-500 fill-red-500" : ""}
          dark:${isLiked ? "text-red-400 fill-red-400" : ""}`}>{likeCount}</span>
      </button>
    </motion.div>
  );
};
