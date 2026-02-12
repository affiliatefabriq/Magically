'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Share2, Download, Check, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { AuthRequiredPopover } from '@/components/shared/publication/AuthRequiredPopover';
import { CommentSection } from '@/components/shared/publication/CommentSection';
import { LikeButton } from '@/components/shared/publication/LikeButton';
import { PublicationActions } from '@/components/shared/publication/PublicationActions';
import {
  getImageUrl,
  PublicationImage,
} from '@/components/shared/publication/PublicationImage';
import { VideoRender } from '@/components/shared/publication/VideoRender';
import { UserProfile } from '@/components/shared/user/UserProfile';
import { ExploreError } from '@/components/states/error/Error';
import { PublicationLoader } from '@/components/states/loaders/Loaders';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/useAuth';
import { usePublication } from '@/hooks/usePublications';
import { API_URL } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { BackButton } from '@/components/shared/layout/BackButton';
import { FollowButton } from '@/components/shared/user/FollowButton';
import { FullscreenImageViewer } from '@/components/ui/fullscreen-image';

export const Publication = ({ publicationId }: { publicationId: string }) => {
  const t = useTranslations('Components.PublicationActions');

  const [expandedCommentsMap, setExpandedCommentsMap] = useState<
    Record<string, boolean>
  >({});
  const [isShared, setIsShared] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const { data: user } = useUser();
  const {
    data: publication,
    isLoading,
    isError,
  } = usePublication(publicationId);

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
      const fileUrl = getImageUrl(publication.imageUrl);
      const res = await fetch(fileUrl, { credentials: 'include' });

      if (!res.ok) throw new Error('Download failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `publication-${publicationId}.${publication.videoUrl ? 'mp4' : 'jpg'}`;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);

      setIsDownloaded(true);
      setTimeout(() => setIsDownloaded(false), 2000);
    } catch (e) {
      console.error('Download error', e);
    }
  };

  if (isError)
    return (
      <div className="state-center section-padding">
        <ExploreError />
      </div>
    );
  if (isLoading) return <PublicationLoader />;
  if (!publication) return null;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2 px-2">
      <BackButton />
      <div className="flex flex-col items-start justify-start gap-4 mt-12 md:mt-4">
        <div className="flex justify-between w-full">
          <UserProfile {...publication.author} />
          {user && user.id !== publication.author.id && (
            <FollowButton
              id={publication.author.id}
              isFollowing={publication.isFollowing ?? false}
            />
          )}
        </div>
        {publication.videoUrl && (
          <VideoRender
            src={`${API_URL}${publication.videoUrl}`}
            className="rounded-xl object-cover aspect-square w-full"
          />
        )}
        {publication.imageUrl && (
          <>
            <PublicationImage
              src={publication.imageUrl}
              alt="publication"
              onClick={() => setFullscreenImage(publication.imageUrl)}
              className="cursor-pointer object-contain"
            />

            <FullscreenImageViewer
              src={fullscreenImage}
              onClose={() => setFullscreenImage(null)}
            />
          </>
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
              {isShared ? (
                <Check className="size-5 stroke-1" />
              ) : (
                <Share2 className="size-5 stroke-1" />
              )}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center justify-center p-0 gap-1 hover:text-green-500 transition-colors"
            >
              {isDownloaded ? (
                <Check className="size-5 stroke-1" />
              ) : (
                <Download className="size-5 stroke-1" />
              )}
            </button>
            {publication.author.id === user?.id && (
              <PublicationActions
                publicationId={publication.id}
                initialContent={publication.content}
              />
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
                  {expandedCommentsMap[publication.id] ? null : t('readMore')}
                </Button>
              </>
            ) : (
              <span className="prompt-text text-tertiary-text">
                {publication.content}
              </span>
            )}
          </article>
          <div className="text-sm secondary-text mb-4">
            {formatDate(publication.createdAt)}
          </div>
        </div>
      </div>
      <CommentSection publicationId={publicationId} />
    </section>
  );
};
