'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useActiveGeneration } from '@/hooks/useGenerations';

export const GenerationToaster = () => {
  const t = useTranslations('Components.Toaster');
  const { data: job } = useActiveGeneration();

  const [showFinal, setShowFinal] = useState<'success' | 'failed' | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hiddenByScroll, setHiddenByScroll] = useState(false);

  /* ---------------- SUCCESS / FAIL ---------------- */
  useEffect(() => {
    if (!job) return;

    if (job.status === 'completed') {
      setShowFinal('success');
      setIsMinimized(false);
      setTimeout(() => setShowFinal(null), 4500);
    }

    if (job.status === 'failed') {
      setShowFinal('failed');
      setIsMinimized(false);
      setTimeout(() => setShowFinal(null), 4500);
    }
  }, [job]);

  /* ---------------- AUTO MINIMIZE ---------------- */
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (job?.status === 'pending' || job?.status === 'processing') {
      timer = setTimeout(() => setIsMinimized(true), 8000);
    } else {
      setIsMinimized(false);
    }

    return () => clearTimeout(timer);
  }, [job?.status]);

  /* ---------------- SCROLL INTELLIGENCE ---------------- */
  useEffect(() => {
    let last = window.scrollY;

    const onScroll = () => {
      const current = window.scrollY;

      if (current > last && current > 120) {
        setHiddenByScroll(true);
      } else {
        setHiddenByScroll(false);
      }

      last = current;
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!job && !showFinal) return null;

  /* ---------------- ICON STATE ---------------- */
  let Icon = Loader2;
  let color = 'text-lime-500';
  let text = '';

  if (job?.status === 'pending') text = `${t('Pending')}...`;
  if (job?.status === 'processing') text = `${t('Processing')}...`;

  if (showFinal === 'success') {
    Icon = CheckCircle2;
    text = `${t('Success')}`;
  }

  if (showFinal === 'failed') {
    Icon = XCircle;
    color = 'text-red-500';
    text = `${t('Fail')}`;
  }

  /* ---------------- APPLE PHYSICS ---------------- */
  const spring = {
    type: 'spring' as const,
    stiffness: 420,
    damping: 32,
    mass: 0.9,
  };

  /* ---------------- GENIE ENTRY ---------------- */
  const genie = {
    hidden: {
      y: -140,
      scale: 0.7,
      skewX: 10,
      scaleY: 0.6,
    },
    visible: {
      y: 0,
      scale: 1,
      skewX: 0,
      scaleY: 1,
    },
    exit: {
      y: -160,
      scale: 0.65,
      skewX: -8,
      scaleY: 0.55,
    },
  };

  /* ---------------- LIQUID MORPH ---------------- */
  const morph = {
    full: {
      borderRadius: 18,
      paddingLeft: 14,
      paddingRight: 16,
      height: 42,
      transition: spring,
    },
    mini: {
      borderRadius: 999,
      paddingLeft: 0,
      paddingRight: 0,
      height: 42,
      width: 42,
      transition: spring,
    },
  };

  /* ---------------- TEXT ---------------- */
  const textAnim = {
    show: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.22 },
    },
    hide: {
      opacity: 0,
      x: -10,
      scale: 0.8,
      transition: { duration: 0.18 },
    },
  };

  /* ---------------- FLOAT HIDE ---------------- */
  const float = {
    show: { y: 0, scale: 1, transition: spring },
    hide: { y: -110, scale: 0.92, transition: spring },
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={genie}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={spring}
        className="fixed top-4 left-0 right-0 z-50 flex justify-center pointer-events-none"
      >
        {/* scroll aware */}
        <motion.div
          variants={float}
          animate={hiddenByScroll ? 'hide' : 'show'}
          className="pointer-events-none"
        >
          {/* capsule */}
          <motion.div
            layout
            variants={morph}
            animate={isMinimized && !showFinal ? 'mini' : 'full'}
            className="
            
              pointer-events-auto
              inline-flex items-center justify-center
              gap-2
              bg-background/70
              backdrop-blur-xl
              border border-white/10
              overflow-hidden
            "
          >
            {/* icon orb */}
            <motion.div
              layout
              className="flex items-center justify-center size-9"
              animate={{
                rotate:
                  job?.status === 'processing' || job?.status === 'pending'
                    ? 360
                    : 0,
              }}
              transition={{
                repeat:
                  job?.status === 'processing' || job?.status === 'pending'
                    ? Infinity
                    : 0,
                duration: 1.8,
                ease: 'linear',
              }}
            >
              <Icon className={`size-4.5 ${color}`} />
            </motion.div>

            {/* text */}
            <AnimatePresence>
              {!isMinimized || showFinal ? (
                <motion.span
                  variants={textAnim}
                  initial="hide"
                  animate="show"
                  exit="hide"
                  className="text-sm font-medium pr-1 whitespace-nowrap"
                >
                  {text}
                </motion.span>
              ) : null}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
