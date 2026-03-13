'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, ChevronDown, PlusCircle, Folder } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useAIModels, useGenerateAI } from '@/hooks/useAi';
import { ModelsEmpty } from '@/components/states/Empty';
import { useUser } from '@/hooks/useAuth';
import { NotAuthorized } from '@/components/states/Error';
import { BackButton } from '@/components/shared/layout/BackButton';
import { PublicationImage } from '@/components/shared/publication/PublicationImage';
import { ScrollArea } from '@/components/ui/scroll-area';

const ASPECT_RATIOS = [
  { value: '1:1', label: '1:1' },
  { value: '16:9', label: '16:9' },
  { value: '9:16', label: '9:16' },
  { value: '4:3', label: '4:3' },
  { value: '3:4', label: '3:4' },
];

const QUALITIES = [
  { value: '1K', label: '1K (1024px)' },
  { value: '2K', label: '2K (2048px)' },
];

export const MagicPhoto = () => {
  const t = useTranslations('Pages.MagicPhoto');
  const router = useRouter();
  const searchParams = useSearchParams();
  const generateImage = useGenerateAI();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: user } = useUser();
  const { data: models, isLoading: isModelsLoading } = useAIModels();

  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [selectedModelId, setSelectedModelId] = useState('');
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [quality, setQuality] = useState<'1K' | '2K'>('1K');
  const [publish, setPublish] = useState(false);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [aspectDropdownOpen, setAspectDropdownOpen] = useState(false);
  const [qualityDropdownOpen, setQualityDropdownOpen] = useState(false);

  const queryModelId = searchParams.get('modelId');
  const queryPrompt = searchParams.get('prompt');

  useEffect(() => {
    if (!models?.length) return;
    if (queryModelId && models.some((m) => m.id === queryModelId)) {
      setSelectedModelId(queryModelId);
    } else {
      setSelectedModelId(models[0].id);
    }
    if (queryPrompt) {
      setPrompt(decodeURIComponent(queryPrompt));
    }
  }, [models, queryModelId, queryPrompt]);

  const selectedModel = models?.find((m) => m.id === selectedModelId);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (
      !prompt.trim() ||
      prompt.trim().length < 3 ||
      !selectedModelId ||
      isGenerating
    )
      return;
    setIsGenerating(true);
    try {
      await generateImage.mutateAsync({
        prompt,
        modelId: selectedModelId,
        publish,
        aspect_ratio: aspectRatio,
        quality,
      });
      router.push('/library?tab=jobs');
    } catch (error: any) {
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const closeAllDropdowns = () => {
    setModelDropdownOpen(false);
    setAspectDropdownOpen(false);
    setQualityDropdownOpen(false);
  };

  if (!user) {
    return (
      <div className="state-center">
        <NotAuthorized />
      </div>
    );
  }

  if (isModelsLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="animate-spin size-8" />
      </div>
    );
  }

  if (!models || models.length === 0) {
    return (
      <div className="section-padding">
        <ModelsEmpty />
      </div>
    );
  }

  return (
    <section
      className="max-w-3xl mx-auto min-h-[90vh] section-padding flex flex-col"
      onClick={closeAllDropdowns}
    >
      {/* Back button */}
      <BackButton />

      <div className="flex flex-1 flex-col items-center gap-2 -mt-12 justify-center">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
          {t('title')}, {user.username}
        </h1>
        <p className="text-sm text-muted-foreground mb-12">
          {t('description')}
        </p>

        {/* Model photo grid — updates when model changes */}
        {selectedModel && selectedModel.imagePaths?.length > 0 && (
          <div className="w-full">
            <div className="grid grid-cols-4 gap-2">
              {selectedModel.imagePaths
                .slice(0, 4)
                .map((path: string, i: number) => (
                  <div
                    key={i}
                    className="relative rounded-xl overflow-hidden border border-white/10 bg-white/5"
                  >
                    <PublicationImage
                      src={path}
                      alt={`${selectedModel.name} preview ${i + 1}`}
                      className="object-cover aspect-square w-full h-full"
                    />
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Chat-style prompt input */}
        <div
          className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-4 pt-4 pb-2">
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                autoResize();
              }}
              onKeyDown={handleKeyDown}
              placeholder={t('promptPlaceholder')}
              className="w-full bg-transparent resize-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none min-h-12 max-h-50"
              rows={2}
            />
          </div>

          {/* Toolbar row */}
          <div className="flex items-center gap-2 px-3 pb-3 flex-wrap">
            {/* Model pill */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setModelDropdownOpen((v) => !v);
                  setAspectDropdownOpen(false);
                  setQualityDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 transition-colors text-foreground font-medium"
              >
                {selectedModel?.imagePaths?.[0] && (
                  <div className="w-4 h-4 rounded-full overflow-hidden shrink-0">
                    <PublicationImage
                      src={selectedModel.imagePaths[0]}
                      alt={selectedModel.name}
                      className="object-cover aspect-square w-full h-full"
                    />
                  </div>
                )}
                <span className="max-w-20 truncate">
                  {selectedModel?.name ?? t('selectPlaceholder')}
                </span>
                <ChevronDown className="size-3 opacity-60" />
              </button>

              {modelDropdownOpen && (
                <div className="absolute bottom-full mb-2 left-0 z-50 min-w-45 rounded-xl border border-white/10 bg-[#1a1a1a] shadow-2xl overflow-hidden">
                  <ScrollArea className="h-32">
                    {models.map((model) => (
                      <button
                        key={model.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedModelId(model.id);
                          setModelDropdownOpen(false);
                        }}
                        className={` cursor-pointer w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-white/10 transition-colors text-left ${model.id === selectedModelId
                          ? 'bg-white/5 text-fuchsia-400'
                          : 'text-foreground'
                          }`}
                      >
                        {model.imagePaths?.[0] && (
                          <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0">
                            <PublicationImage
                              src={model.imagePaths[0]}
                              alt={model.name}
                              className="object-cover aspect-square w-full h-full"
                            />
                          </div>
                        )}
                        <span className="truncate">{model.name}</span>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setModelDropdownOpen(false);
                        router.push('/models');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-left hover:bg-fuchsia-700/30 transition-colors text-fuchsia-400 font-semibold border-t border-white/10 cursor-pointer"
                    >
                      <Folder className='size-4' />
                      <span>{t("toModels")}</span>
                    </button>
                  </ScrollArea>
                </div>
              )}
            </div>

            {/* Aspect ratio pill */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setAspectDropdownOpen((v) => !v);
                  setModelDropdownOpen(false);
                  setQualityDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 transition-colors text-foreground font-medium"
              >
                <span>{aspectRatio}</span>
                <ChevronDown className="size-3 opacity-60" />
              </button>

              {aspectDropdownOpen && (
                <div className="absolute bottom-full mb-2 left-0 z-50 min-w-25 rounded-xl border border-white/10 bg-[#1a1a1a] shadow-2xl overflow-hidden">
                  {ASPECT_RATIOS.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAspectRatio(r.value);
                        setAspectDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-sm text-left hover:bg-white/10 transition-colors ${r.value === aspectRatio
                        ? 'text-fuchsia-400'
                        : 'text-foreground'
                        }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quality pill */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setQualityDropdownOpen((v) => !v);
                  setModelDropdownOpen(false);
                  setAspectDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 transition-colors text-foreground font-medium"
              >
                <span>{quality}</span>
                <ChevronDown className="size-3 opacity-60" />
              </button>

              {qualityDropdownOpen && (
                <div className="absolute bottom-full mb-2 left-0 z-50 min-w-32.5 rounded-xl border border-white/10 bg-[#1a1a1a] shadow-2xl overflow-hidden">
                  {QUALITIES.map((q) => (
                    <button
                      key={q.value}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuality(q.value as '1K' | '2K');
                        setQualityDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-sm text-left hover:bg-white/10 transition-colors ${q.value === quality
                        ? 'text-fuchsia-400'
                        : 'text-foreground'
                        }`}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Generate button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                isGenerating ||
                generateImage.isPending ||
                prompt.trim().length < 3 ||
                !selectedModelId
              }
              className={`
                flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed text-black
              ${isGenerating || generateImage.isPending ? 'bg-lime-400' : 'bg-lime-500'}
                `}
            >
              {isGenerating || generateImage.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>{t('generatingBtn')}</span>
                </>
              ) : (
                <>
                  <span>
                    {t('generateBtn')}
                    {quality === '2K' ? '(✦20)' : '(✦15)'}
                  </span>
                </>
              )}
            </button>
            {/* <div className="flex items-center gap-2 py-1 rounded-xl text-sm font-semibold transition-all duration-200">
              <button
                type="button"
                onClick={() => setPublish((v) => !v)}
                className={`relative inline-flex items-center h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${publish ? 'bg-fuchsia-600' : 'bg-white/20'
                  }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ${publish ? 'translate-x-4' : 'translate-x-0'
                    }`}
                />
              </button>
              <div>
                <p className="text-xs text-muted-foreground">
                  {t('publishLabel')}
                </p>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};
