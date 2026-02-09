'use client';

import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '@/lib/api';

type Props = {
  src: string | null;
  onClose: () => void;
};

export const FullscreenImageViewer = ({ src, onClose }: Props) => {
  if (!src) return null;

  const fullSrc = src.startsWith('http') ? src : `${API_URL}${src}`;

  return (
    <AnimatePresence>
      {src && (
        <motion.div
          className="fixed inset-0 z-9999 flex items-center justify-center"
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* blurred bg */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* image */}
          <motion.img
            src={fullSrc}
            alt="fullscreen"
            className="relative z-10 max-h-[95vh] max-w-[95vw] object-contain rounded-xl"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.25 }}
          />

          {/* close btn */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full"
          >
            <X className="size-6" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
