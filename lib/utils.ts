import { clsx, type ClassValue } from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { enUS, ru } from 'date-fns/locale';
import { twMerge } from 'tailwind-merge';

import { Publication } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (createdAt: string) => {
  const locale = localStorage.getItem('locale') || 'en';

  const formattedDate = formatDistanceToNow(createdAt, {
    addSuffix: true,
    locale: locale === 'ru' ? ru : enUS,
  });

  return formattedDate;
};

export const isTelegramWebApp = () => {
  if (typeof window === 'undefined') return false;
  return Boolean(window?.Telegram?.WebApp);
};

export const getTelegram = () => {
  if (!isTelegramWebApp()) return null;
  return window.Telegram?.WebApp;
};

export const LowAnglePrompt =
  'Ultra-realistic photography, extreme low camera angle looking strongly upward, subject sitting or standing in foreground and dominates the frame, dramatic worm’s-eye perspective, powerful and imposing look, natural lighting, maximum detail and sharpness, cinematic composition --ar 3:4 --stylize 250 --v 6';
export const LongShotPrompt =
  'Ultra-realistic environmental portrait, very long shot, subject is relatively small in the frame, vast landscape or location dominates, person clearly recognizable but not filling the image, epic wide composition, natural golden-hour or daylight, high detail throughout --ar 3:4 --stylize 200 --v 6';
export const FromAHeightPrompt =
  'High-angle shot from above, camera positioned significantly higher than the subject looking down, bird’s-eye or drone-like perspective, person appears smaller, full context of surroundings visible, clean cinematic look, sharp focus, natural light --ar 3:4 --stylize 250 --v 6';
export const FromBackPrompt =
  'Realistic rear view / back view only, person seen completely from behind, no face visible, natural pose, beautiful scenery or location in background, contemplative mood, warm natural lighting, highly detailed hair and clothing, cinematic --ar 3:4 --stylize 250 --v 6';
export const ProfilePrompt =
  'Classic three-quarter profile portrait, sharp side lighting highlighting jawline and facial contours, clean fashion-magazine style, soft bokeh background, maximum facial detail and skin texture, dramatic yet natural look --ar 3:4 --stylize 250 --v 6';
export const AntiBlurPrompt =
  'Maximum possible sharpness and clarity, zero blur, hyper-detailed skin, hair, clothing and background elements, enhanced local contrast and micro-details, 8K-level professional retouch, crisp and clean, natural colors preserved --ar 3:4 --stylize 100 --v 6';
