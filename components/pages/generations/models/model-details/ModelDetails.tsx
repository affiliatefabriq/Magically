'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, ChevronLeft, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useAIModel } from '@/hooks/useAi';
import { API_URL } from '@/lib/api';
import { BackButton } from '@/components/shared/layout/BackButton';

export const ModelDetails = ({ modelId }: { modelId: string }) => {
  const router = useRouter();
  const t = useTranslations('Pages.Models');

  const { data: model, isLoading } = useAIModel(modelId);

  if (isLoading)
    return (
      <div className="section-padding container mx-auto max-w-4xl space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );

  if (!model)
    return (
      <div className="section-padding flex flex-col items-center gap-4 mt-20">
        <AlertCircle className="size-10 text-red-500" />
        <h2 className="text-xl font-bold">Model not found</h2>
        <BackButton />
      </div>
    );

  const handleGenerateClick = () => {
    router.push(`/create/magic-photo?modelId=${model.id}`);
  };

  return (
    <section className="section-padding container mx-auto max-w-5xl min-h-screen flex flex-col">
      <div className="mb-6 flex-1">
        <BackButton />

        <div className="flex flex-col gap-1 mt-12 md:mt-4">
          <h1 className="title-text text-3xl">{model.name}</h1>
          <p className="text-muted-foreground text-base">{model.description}</p>
          <span className="text-muted-foreground text-base">
            {new Date(model.createdAt).toLocaleDateString()}
          </span>
        </div>

        <Separator className="my-2" />

        <h3 className="text-lg font-semibold mb-4">{t('trainingData')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {model.imagePaths.map((path, idx) => (
            <div
              key={idx}
              className="relative aspect-square rounded-xl overflow-hidden border bg-muted group"
            >
              <Image
                src={`${API_URL}${path}`}
                alt={`${model.name} sample ${idx + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 mb-4 sticky bottom-4 z-10 w-full">
        <div className="flex items-center justify-center w-full">
          <Button
            onClick={handleGenerateClick}
            className="btn-solid w-full gap-2 py-3"
          >
            <Sparkles />
            {t('generate')}
          </Button>
        </div>
      </div>
    </section>
  );
};
