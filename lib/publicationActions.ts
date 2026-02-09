import { getTelegram } from '@/lib/utils';

export const universalShare = async (url: string) => {
  const tg = window?.Telegram?.WebApp;

  if (tg) {
    try {
      tg.showPopup(
        {
          title: 'Поделиться',
          message: 'Отправить ссылку?',
          buttons: [
            { id: 'copy', type: 'default', text: 'Скопировать' },
            { id: 'cancel', type: 'cancel' },
          ],
        },
        async (id: any) => {
          if (id === 'copy') {
            await navigator.clipboard.writeText(url);
          }
        },
      );

      return true;
    } catch {
      return false;
    }
  }

  if (navigator.share) {
    try {
      await navigator.share({ url });
      return true;
    } catch {}
  }

  await navigator.clipboard.writeText(url);
  return true;
};

export const universalDownload = async (fileUrl: string, filename?: string) => {
  const tg = window?.Telegram?.WebApp;

  if (tg) {
    try {
      const a = document.createElement('a');
      a.href = fileUrl;
      a.setAttribute('download', filename || 'file');
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      a.remove();

      tg.HapticFeedback?.impactOccurred('light');

      return true;
    } catch (e) {
      console.error('TG download fail', e);
      return false;
    }
  }

  try {
    const res = await fetch(fileUrl, { credentials: 'include' });
    if (!res.ok) throw new Error('Download failed');

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'file';
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);

    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};
