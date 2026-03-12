'use client';

import Link from 'next/link';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Dot,
  Download,
  Heart,
  MessageCircle,
  Share2,
  Sparkle,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { API_URL } from '@/lib/api';
import { cn, formatDate } from '@/lib/utils';
import { Publication } from '@/types';
import { UserAvatar } from '../user/UserAvatar';
import { AuthRequiredPopover } from './AuthRequiredPopover';
import { LikeButton } from './LikeButton';
import { PublicationActions } from './PublicationActions';
import { getImageUrl, PublicationImage } from './PublicationImage';
import { VideoRender } from './VideoRender';
import { PublicationDialog } from './PublicationDialog';
import { FullscreenImageViewer } from '@/components/ui/fullscreen-image';
import { useRouter } from 'next/navigation';
import { UserProfile } from '../user/UserProfile';

type PublicationCardProps = {
  publication: Publication;
  userId?: string;
  id?: any;
  isFirst?: boolean;
  isLast?: boolean;
  displayMode?: 'default' | 'grid';
};

export const PublicationGridCard = ({
  publication,
  userId,
}: {
  publication: Publication;
  userId?: string;
}) => {
  const t = useTranslations('Components.Publication');
  const router = useRouter();
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const handleRemix = () => {
    if (!publication.content) return;
    router.push(
      `/create/magic-photo?prompt=${encodeURIComponent(publication.content)}`,
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative flex flex-col transition-colors"
      key={publication.id}
    >
      {/* Image */}
      <div
        className="relative w-full cursor-pointer"
        onClick={() => {
          if (publication.imageUrl) setFullscreenImage(publication.imageUrl);
          else router.push(`/publications/${publication.id}`);
        }}
      >
        {publication.videoUrl ? (
          <VideoRender
            src={`${API_URL}${publication.videoUrl}`}
            className="object-cover w-full"
          />
        ) : publication.imageUrl ? (
          <PublicationImage
            src={publication.imageUrl}
            alt="publication"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
      </div>

      {/* Footer: avatar + like */}
      <div className="flex flex-row items-center justify-start p-1">
        {/* <Link
          href={`/profile/${publication.author.username}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1.5 min-w-0"
        >
          <UserAvatar
            avatar={publication.author.avatar}
            username={publication.author.username}
            fullname={publication.author.fullname}
            className="size-5 shrink-0"
          />
          <span className="text-xs text-muted-foreground truncate max-w-16">
            {publication.author.username}
          </span>
        </Link> */}

        {/* Like */}
        <div className="shrink-0">
          {userId ? (
            <LikeButton {...publication} />
          ) : (
            <AuthRequiredPopover>
              <button className="flex items-center gap-0.5 text-xs text-muted-foreground hover:text-rose-400 transition-colors">
                <Heart className="size-5 stroke-1" />
                <span>{publication.likeCount}</span>
              </button>
            </AuthRequiredPopover>
          )}
        </div>
        <Button
          onClick={handleRemix}
          size="sm"
          variant="ghost"
          className="p-0 text-lime-500"
        >
          <Sparkle className='size-4.5 fill-lime-500' />
          {t('alsoWant')}
        </Button>

      </div>
      <FullscreenImageViewer
        src={fullscreenImage}
        onClose={() => setFullscreenImage(null)}
      />
    </motion.div>
  );
};

export const PublicationCard = ({
  publication,
  userId,
  isFirst,
  isLast,
  displayMode,
}: PublicationCardProps) => {
  const t = useTranslations('Components.Publication');
  const router = useRouter();

  const [expandedCommentsMap, setExpandedCommentsMap] = useState<
    Record<string, boolean>
  >({});
  const [isShared, setIsShared] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/publications/${publication.id}`;

    if (navigator.share) {
      try {
        await navigator.share({ url: shareUrl });
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
      } catch (err) { }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000);
    }
  };

  const handleDownload = async () => {
    if (!publication) return;

    try {
      const fileUrl = getImageUrl(publication.imageUrl!);
      const res = await fetch(fileUrl, { credentials: 'include' });

      if (!res.ok) throw new Error('Download failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `publication-${publication.id}.${publication.videoUrl ? 'mp4' : 'jpg'}`;
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

  const handleRemix = () => {
    if (!publication.content) return;
    router.push(
      `/create/magic-photo?prompt=${encodeURIComponent(publication.content)}`,
    );
  };

  if (displayMode !== 'grid')
    return (
      <div className="w-full break-inside-avoid mb-4">
        <div className="relative w-full group">
          <div className="flex flex-col justify-center md:hidden">
            <div
              className="flex items-start md:hidden flex-col gap-2"
              key={publication.id}
            >
              <div className="flex items-center justify-between w-full gap-2">
                <UserProfile {...publication.author} />
                {userId === publication.author.id && (
                  <PublicationActions
                    publicationId={publication.id}
                    initialContent={publication.content}
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
                    onClick={() => setFullscreenImage(publication.imageUrl!)}
                    className="cursor-pointer object-cover duration-500"
                  />

                  <FullscreenImageViewer
                    src={fullscreenImage}
                    onClose={() => setFullscreenImage(null)}
                  />
                </>
              )}
              <div className="flex flex-wrap items-center justify-start gap-4 mt-2 px-1">
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
                <Button
                  onClick={handleRemix}
                  size="sm"
                  variant="ghost"
                  className="p-0 text-lime-500"
                >
                  ✦ {t('alsoWant')}
                </Button>
              </div>
              <article className="mb-2 px-1">
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
                      {expandedCommentsMap[publication.id]
                        ? null
                        : t('readMore')}
                    </Button>
                  </>
                ) : (
                  <span className="prompt-text text-tertiary-text">
                    {publication.content}
                  </span>
                )}
                <div className="text-sm secondary-text">
                  {formatDate(publication.createdAt)}
                </div>
              </article>
            </div>
          </div>
          <PublicationDialog publication={publication}>
            <div key={publication.id} className="hidden md:flex">
              {publication.videoUrl && (
                <VideoRender
                  src={`${API_URL}${publication.videoUrl}`}
                  className="rounded-xl object-cover aspect-square w-full"
                />
              )}
              {publication.imageUrl && (
                <PublicationImage
                  src={publication.imageUrl}
                  alt="publication"
                />
              )}
            </div>
          </PublicationDialog>
        </div>
      </div>
    );

  return <PublicationGridCard publication={publication} userId={userId} />;
};

export const PublicationCardSimplified = ({
  publication,
}: PublicationCardProps) => {
  return (
    <div className="break-inside-avoid mb-4">
      <Link href={`/publications/${publication.id}`}>
        {publication.videoUrl ? (
          <video
            src={`${API_URL}${publication.videoUrl}`}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto rounded-xl"
          />
        ) : (
          <PublicationImage src={publication.imageUrl!} alt="publication" />
        )}
      </Link>
    </div>
  );
};
