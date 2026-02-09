'use client';

import Link from 'next/link';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Publication } from '@/types';
import { PublicationImage } from './PublicationImage';
import { UserAvatar } from '../user/UserAvatar';
import { CommentSection } from './CommentSection';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  X,
  Maximize2,
  Share2,
  Download,
  Heart,
  MessageCircle,
  Check,
  Dot,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { LikeButton } from './LikeButton';
import { PublicationActions } from './PublicationActions';
import { API_URL } from '@/lib/api';
import { useUser } from '@/hooks/useAuth';
import { AuthRequiredPopover } from './AuthRequiredPopover';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export const PublicationDialog = ({
  publication,
  children,
}: {
  publication: Publication;
  children: React.ReactNode;
}) => {
  const t = useTranslations('Components.Publication');
  const { data: user } = useUser();

  const [expandedCommentsMap, setExpandedCommentsMap] = useState<
    Record<string, boolean>
  >({});
  const [isOpen, setIsOpen] = useState(false);
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
      const fileUrl = `${API_URL}${publication.imageUrl || publication.videoUrl}`;
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

  const goFullScreen = () => {
    const elem = document.querySelector(
      '.publication-fullscreen-target',
    ) as HTMLElement;
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
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer">{children}</div>
      </DialogTrigger>
      <DialogContent className="flex theme w-full h-full max-w-7xl max-h-[90vh] p-0 m-0 overflow-hidden ">
        <DialogTitle className="sr-only">
          Publication by {publication.author.username}
        </DialogTitle>

        {/* Image Section */}
        <div className="relative w-full h-full flex-1 publication-fullscreen-target">
          <PublicationImage
            src={publication.imageUrl!}
            className={`
                            w-full h-full transition-all duration-300 ease-in-out
                            object-contain bg-black
                            ${isNativeFullscreen ? 'object-contain!' : ''}
                            `}
            alt=""
          />
          <button
            onClick={isNativeFullscreen ? exitFullScreen : goFullScreen}
            className="absolute bottom-4 right-4 z-100 text-white bg-black/60 hover:bg-black/80 p-3 rounded-full"
          >
            {isNativeFullscreen ? (
              <X className="size-6" />
            ) : (
              <Maximize2 className="size-6" />
            )}
          </button>
        </div>

        {/* Comments Section */}
        <div className="relative w-full flex flex-1 flex-col h-screen md:h-full border-t md:border-t-0 md:border-l overflow-hidden">
          <div className="flex flex-col items-start justify-center p-4 border-b gap-3 shrink-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <Link
              href={`/profile/${publication.author.username}`}
              className="flex items-center gap-2"
            >
              <UserAvatar {...publication.author} size="sm" />
              <span className="font-semibold text-sm truncate">
                {publication.author.username}
              </span>
              <Dot />
              <div className="text-sm secondary-text">
                {formatDate(publication.createdAt)}
              </div>
            </Link>
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
          </div>
          <div className="flex-1 overflow-hidden w-full">
            <ScrollArea className="h-full w-full">
              <div className="p-4">
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
                <CommentSection publicationId={publication.id} />
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
