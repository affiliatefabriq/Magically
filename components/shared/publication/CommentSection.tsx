"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useUser } from "@/hooks/useAuth";

import { Comment } from "@/types";
import { enUS, ru } from "date-fns/locale";
import { UserAvatar } from "../user/UserAvatar";
import { formatDistanceToNow } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";

import {
  Dot,
  Heart,
  MessageCircle,
  Send,
  Trash2,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useComments,
  useCreateComment,
  useDeleteComment,
  useLikeComment,
  useReplyToComment,
  useUnlikeComment,
} from "@/hooks/useComments";
import { Separator } from "@/components/ui/separator";

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

  const renderComment = (comment: Comment, depth = 0) => (
    <motion.div
      key={comment.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className={`w-full`}
    >
      <Card className={`group shadow-none duration-200 bg-transparent border-none ${depth > 0 ? "" : ""}`}>
        <CardContent className="px-2">
          <div className="flex items-start gap-4">
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex justify-start items-start gap-3 text-muted-foreground">
                <UserAvatar {...comment.author} size="sm" />
                <div className="flex flex-col justify-start items-start -mt-1.5">
                  <div className="min-w-0 flex-1 flex items-center">
                    <span className="font-semibold text-sm truncate">@{comment.author?.username}</span>
                    <Dot />
                    <span className="text-xs ">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                        locale: locale === "ru" ? ru : enUS,
                      })}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed break-words">{comment.text}</p>
                  <div className="flex items-center gap-3 flex-shrink-0 mt-1">
                    <motion.div whileTap={{ scale: 0.9 }}>
                      <button
                        onClick={() => handleLikeToggle(comment)}
                        className="h-8 w-8 rounded-full bg-none hover:bg-transparent"
                      >
                        <motion.div
                          animate={{
                            scale: comment.isLiked ? [1, 1.3, 1] : 1,
                          }}
                          transition={{ duration: 0.3 }}
                          className="flex items-center justify-center gap-1 secondary-text"
                        >
                          <Heart
                            className={`h-4 w-4 transition-colors ${comment.isLiked ? "text-red-500 fill-red-500" : "text-muted-foreground"
                              }`}
                          />
                          <span>{comment.likeCount}</span>
                        </motion.div>
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
                        className="flex items-center justify-center h-8 w-8 rounded-full bg-none hover:bg-transparent secondary-text gap-1"
                      >
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                        <span>{comment.replies?.length}</span>
                      </button>
                    </motion.div>
                    {user!.id === comment.author.id ? (
                      <motion.div whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(comment.id)}
                          className="h-8 w-8 rounded-full hover:bg-red-50 dark:hover:bg-red-950/20"
                        >
                          <Trash2 className="h-4 w-4 text-red-500 hover:text-red-500" />
                        </Button>
                      </motion.div>
                    ) : null}
                  </div>
                </div>
              </div>

              {comment.replies?.length! > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 space-y-2">
                  {comment.replies!.map((reply: any) => renderComment(reply, depth + 1))}
                </motion.div>
              )}

              <Separator className="w-screen" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

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
                <Card key={i}>
                  <CardContent className="py-4 px-2">
                    <div className="flex gap-3">
                      <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-12 w-full mt-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
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

      <div className="backdrop-blur-3xl bg-transparent py-4 px-2 sticky w-full bottom-0 z-50">
        <AnimatePresence>
          {replyTo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3 overflow-hidden"
            >
              <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg border">
                <MessageCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm text-muted-foreground flex-1 truncate">
                  {t("response.for")} <span className="font-medium">{replyTo.name}</span>
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setReplyTo(null)}
                  className="h-6 w-6 rounded-full flex-shrink-0"
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
            className="flex-1 h-11 "
          />
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleSubmit}
              disabled={createComment.isPending || replyToComment.isPending || !text.trim()}
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
