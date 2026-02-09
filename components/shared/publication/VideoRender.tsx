'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';

import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

/**
 * Robust VideoRender component
 * - autoplay when visible, pause when not
 * - resilient to aggressive clicking (handles rejected play() promises)
 * - desktop: controls on hover; mobile: tap to toggle overlay
 * - progress bar hidden on desktop while playing
 * - minimalistic glassmorphism overlays
 */
export const VideoRender = ({
  src,
  className,
}: {
  src: string;
  className?: string;
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const lastToggleRef = useRef<number>(0);
  const playPromiseRef = useRef<Promise<void> | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(
      typeof window !== 'undefined' &&
        ('ontouchstart' in window || navigator.maxTouchPoints > 0),
    );
  }, []);

  // Intersection Observer to detect visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.6 },
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Page visibility (tab hidden) -> pause
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) safePause();
      else {
        if (isVisible) safePlay();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [isVisible]);

  // Sync play/pause with intersection visibility
  useEffect(() => {
    if (isVisible) {
      safePlay();
    } else {
      safePause();
    }
  }, [isVisible]);

  // Track progress
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setProgress((v.currentTime / (v.duration || 1)) * 100);
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('ended', () => {
      // keep overlay visible when ended
      setIsPlaying(false);
      setShowOverlay(true);
    });
    return () => {
      v.removeEventListener('timeupdate', onTime);
    };
  }, []);

  // safe play: handle promise rejections gracefully
  const safePlay = async () => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) return; // already playing
    try {
      const p = v.play();
      playPromiseRef.current = p instanceof Promise ? p : null;
      if (p instanceof Promise) await p;
      setIsPlaying(true);
      setShowOverlay(false);
    } catch (err: any) {
      // ignore AbortError and other expected interruptions
      if (
        err &&
        (err.name === 'AbortError' || err.message?.includes('interrupted'))
      ) {
        // noop
      } else {
        // for debugging other errors, but don't crash UI
        console.error('Video play failed:', err);
      }
      setIsPlaying(false);
    } finally {
      playPromiseRef.current = null;
    }
  };

  const safePause = () => {
    const v = videoRef.current;
    if (!v) return;
    // cancel any pending play promise by pausing; play() may still reject with AbortError which we swallow
    try {
      v.pause();
    } catch (err) {
      // ignore
    }
    setIsPlaying(false);
    // show overlay when explicitly paused
    setShowOverlay(true);
  };

  // togglePlay with debounce to avoid rapid aggressive clicks
  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const now = Date.now();
    if (now - lastToggleRef.current < 120) return; // ignore very rapid toggles
    lastToggleRef.current = now;

    if (isPlaying) {
      safePause();
    } else {
      safePlay();
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMuted((m) => {
      const next = !m;
      if (videoRef.current) videoRef.current.muted = next;
      return next;
    });
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full rounded-xl overflow-hidden group',
        'cursor-pointer',
        className,
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => {
        // On mobile: single tap toggles overlay then play/pause
        if (isMobile) {
          // if overlay visible -> hide overlay and play
          if (showOverlay) {
            setShowOverlay(false);
            safePlay();
          } else {
            // show overlay (pause)
            safePause();
          }
        } else {
          // desktop: click toggles play/pause (but controls appear on hover)
          togglePlay();
        }
      }}
    >
      <video
        ref={videoRef}
        src={src}
        muted={muted}
        playsInline
        loop
        className="w-full h-full object-cover"
      />

      {/* Top-right mute button (glass) */}
      <motion.button
        onClick={toggleMute}
        className="absolute top-3 right-3 z-30 p-2 rounded-lg backdrop-blur-md bg-white/20 dark:bg-black/20 text-white hover:scale-105 transition-transform"
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered || showOverlay ? 1 : 0 }}
      >
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </motion.button>

      {/* Center small play/pause (glass, blurred) */}
      <motion.div
        className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: showOverlay ? 1 : 0 }}
      >
        <div
          className="pointer-events-auto p-3 rounded-full  bg-white dark:bg-black shadow-md"
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
        >
          {isPlaying ? (
            <Pause size={24} strokeWidth={2} />
          ) : (
            <Play size={24} strokeWidth={2} />
          )}
        </div>
      </motion.div>

      {/* Progress bar (hidden on desktop when playing) */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-20 px-2 md:px-8 pb-2"
        initial={{ opacity: 0 }}
        animate={{
          opacity:
            (isMobile || !isPlaying) && (hovered || showOverlay || isMobile)
              ? 1
              : 0,
        }}
      >
        <Progress value={progress} className="h-1 bg-white/30" />
      </motion.div>
    </div>
  );
};
