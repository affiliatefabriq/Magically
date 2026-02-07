"use client";

import * as React from "react";
import Link from "next/link";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { enUS, ru } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Dot, Heart, MessageCircle, Send, Trash2, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/useAuth";
import {
  useComments,
  useCreateComment,
  useDeleteComment,
  useLikeComment,
  useReplyToComment,
  useUnlikeComment,
} from "@/hooks/useComments";
import { cn } from "@/lib/utils";
import { Comment } from "@/types";
import { UserAvatar } from "../user/UserAvatar";

const CommentCard = ({ className, ...props }: React.ComponentProps<"div">) => {
  return <div className={cn("bg-transparent flex flex-col", className)} {...props} />;
};

const CommentCardContent = ({ className, ...props }: React.ComponentProps<"div">) => {
  return <div className={cn("", className)} {...props} />;
};

export const CommentSection = ({ publicationId }: { publicationId: string }) => {
  const { data: user } = useUser();
  const { data: comments, isLoading } = useComments(publicationId);
  const t = useTranslations("Components.CommentSection");
  const createComment = useCreateComment();
  const replyToComment = useReplyToComment();
  const deleteComment = useDeleteComment();
  const likeComment = useLikeComment();
  const unlikeComment = useUnlikeComment();

  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);
  const [text, setText] = useState("");
  const [showRepliesMap, setShowRepliesMap] = useState<Record<string, boolean>>({});
  const [expandedCommentsMap, setExpandedCommentsMap] = useState<Record<string, boolean>>({});

  const locale = typeof window !== "undefined" ? localStorage.getItem("locale") || "en" : "en";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    if (replyTo) {
      replyToComment.mutate({ commentId: replyTo.id, text });
      setReplyTo(null);
    } else {
      createComment.mutate({ publicationId, text });
    }

    setText("");
  };

  const handleLikeToggle = (comment: Comment) => {
    if (comment.isLiked) unlikeComment.mutate(comment.id);
    else likeComment.mutate(comment.id);
  };

  const handleDelete = (commentId: string) => {
    deleteComment.mutate(commentId);
  };

  const toggleReplies = (commentId: string) => {
    setShowRepliesMap((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const flattenReplies = (replies: Comment[]): Comment[] => {
    const flattened: Comment[] = [];

    const flatten = (reply: Comment) => {
      flattened.push(reply);
      if (reply.replies && reply.replies.length > 0) {
        reply.replies.forEach((nestedReply) => flatten(nestedReply));
      }
    };

    replies.forEach((reply) => flatten(reply));
    return flattened;
  };

  const renderSingleComment = (comment: Comment, isReply: boolean = false, parentAuthor: string | null = null) => {
    return (
      <CommentCard key={comment.id} className={isReply ? "ml-12" : ""}>
        <CommentCardContent className="px-2 py-2">
          <div className="flex items-start gap-3">
            <Link
              href={`/profile/${comment.author.username}`}
              className="relative z-10 bg-background rounded-full mt-2"
            >
              <UserAvatar {...comment.author} size="sm" />
            </Link>
            <div className="flex flex-col justify-start items-start flex-1 min-w-0">
              <div className="flex items-center">
                <span className="font-semibold text-sm truncate">@{comment.author?.username}</span>
                <Dot className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground truncate">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                    locale: locale === "ru" ? ru : enUS,
                  })}
                </span>
              </div>
              <p className="text-sm leading-relaxed wrap-break-word">
                {parentAuthor && <span className="text-lime-500 font-medium mr-1">@{parentAuthor} </span>}
                {comment.text.length > 128 ? (
                  <>
                    <span>{expandedCommentsMap[comment.id] ? comment.text : `${comment.text.slice(0, 128)}...`}</span>
                    <Button
                      variant="link"
                      size="sm"
                      className="px-2 h-auto cursor-pointer text-muted-foreground"
                      onClick={() => {
                        setExpandedCommentsMap((prev) => ({
                          ...prev,
                          [comment.id]: !prev[comment.id],
                        }));
                      }}
                    >
                      {expandedCommentsMap[comment.id] ? t("readLess") : t("readMore")}
                    </Button>
                  </>
                ) : (
                  <span>{comment.text}</span>
                )}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <motion.div whileTap={{ scale: 0.9 }}>
                  <button
                    onClick={() => handleLikeToggle(comment)}
                    className="flex items-center gap-1 text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <Heart
                      className={`h-4 w-4 transition-colors 
                        ${comment.isLiked ? "text-red-500 fill-red-500" : ""}`}
                    />
                    <span className={`text-xs ${comment.isLiked ? "text-red-500 fill-red-500" : ""}`}>
                      {comment.likeCount}
                    </span>
                  </button>
                </motion.div>

                <motion.div whileTap={{ scale: 0.9 }}>
                  <button
                    onClick={() =>
                      setReplyTo({
                        id: comment.id,
                        name: comment.author?.fullname,
                      })
                    }
                    className="flex items-center gap-1 text-muted-foreground hover:text-lime-500 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-xs">{comment.replies?.length || 0}</span>
                  </button>
                </motion.div>

                {user?.id === comment.author.id ? (
                  <motion.div whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(comment.id)}
                      className="h-8 w-8 rounded-full hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </motion.div>
                ) : null}
              </div>
            </div>
          </div>
        </CommentCardContent>
      </CommentCard>
    );
  };

  const renderComment = (comment: Comment) => {
    const hasReplies = comment.replies && comment.replies.length > 0;
    const showReplies = showRepliesMap[comment.id] || false;
    const allReplies = hasReplies ? flattenReplies(comment.replies!) : [];

    return (
      <motion.div
        key={comment.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        {renderSingleComment(comment, false)}

        {hasReplies && (
          <div className="mt-2">
            {!showReplies ? (
              <button
                onClick={() => toggleReplies(comment.id)}
                className="ml-12 flex items-center gap-2 text-sm text-lime-600 dark:text-lime-400 hover:underline font-medium py-1"
              >
                <ChevronDown className="h-4 w-4" />
                {t("showReplies")} ({allReplies.length})
              </button>
            ) : (
              <>
                <button
                  onClick={() => toggleReplies(comment.id)}
                  className="ml-12 flex items-center gap-2 text-sm text-lime-600 dark:text-lime-400 hover:underline font-medium mb-2 py-1"
                >
                  <ChevronDown className="h-4 w-4 rotate-180" />
                  {t("hideReplies")}
                </button>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1">
                  {allReplies.map((reply, index) => {
                    let parentAuthor = comment.author.username;
                    if (index > 0) {
                      parentAuthor = allReplies[index - 1].author.username;
                    }
                    return renderSingleComment(reply, true, parentAuthor);
                  })}
                </motion.div>
              </>
            )}
          </div>
        )}

        <Separator className="my-4" />
      </motion.div>
    );
  };

  return (
    <section className="flex flex-col h-full w-full">
      <div className="py-4 px-2 border-b">
        <h3 className="text-lg font-semibold">{t("title")}</h3>
        <p className="text-sm text-muted-foreground">
          {comments?.length || 0} {comments?.length === 1 ? t("commentary") : t("commentaries")}
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <CommentCard key={i}>
                  <CommentCardContent className="py-4 px-2">
                    <div className="flex gap-3">
                      <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-12 w-full mt-2" />
                      </div>
                    </div>
                  </CommentCardContent>
                </CommentCard>
              ))}
            </div>
          ) : comments?.length ? (
            <AnimatePresence>{comments.map((c: any) => renderComment(c))}</AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <MessageCircle className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground text-center"></p>
            </motion.div>
          )}
        </div>
        <div className="h-24" />
      </ScrollArea>

      <div className="theme py-4 px-2 sticky w-full bottom-0 z-50">
        <AnimatePresence>
          {replyTo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3 overflow-hidden"
            >
              <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg border">
                <MessageCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground flex-1 truncate">
                  {t("response.for")} <span className="font-medium">{replyTo.name}</span>
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setReplyTo(null)}
                  className="h-6 w-6 rounded-full shrink-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-row items-center gap-2">
          <Input
            placeholder={replyTo ? t("response.write") : t("comment")}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            disabled={!user}
            className="flex-1 h-11"
          />
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleSubmit}
              disabled={!user || createComment.isPending || replyToComment.isPending || !text.trim()}
              className="h-11 btn-login"
            >
              <Send className="size-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
