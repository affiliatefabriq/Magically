'use client';

import Link from 'next/link';
import Image from 'next/image';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Plus, ChevronDown, Loader2, SendHorizonal, Folder } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useUser } from '@/hooks/useAuth';
import { useAIModels, useGenerateAI } from '@/hooks/useAi';
import { Button } from '@/components/ui/button';
import { PublicationImage } from '@/components/shared/publication/PublicationImage';
import { CreateModelDialog } from '@/components/shared/create/CreateModelDialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTranslations } from 'next-intl';
import { useTypewriter } from '@/hooks/useTypewritter';

const ASPECT_RATIOS = ['1:1', '16:9', '9:16', '4:3', '3:4'];
const QUALITIES = [
  { value: '1K', label: '1K (1024px)' },
  { value: '2K', label: '2K (2048px)' },
];

const InlineMagicPhotoForm = ({ models }: { models: any[] }) => {
  const t = useTranslations('Components.WelcomeHero');
  const router = useRouter();
  const generateImage = useGenerateAI();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [prompt, setPrompt] = useState('');
  const [selectedModelId, setSelectedModelId] = useState(models[0]?.id ?? '');
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [quality, setQuality] = useState<'1K' | '2K'>('1K');
  const [isGenerating, setIsGenerating] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [aspectOpen, setAspectOpen] = useState(false);
  const [qualityOpen, setQualityOpen] = useState(false);

  const selectedModel = models.find((m) => m.id === selectedModelId);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  };

  const closeAll = () => {
    setModelOpen(false);
    setAspectOpen(false);
    setQualityOpen(false);
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
        publish: false,
        aspect_ratio: aspectRatio,
        quality,
      });
      router.push('/library?tab=jobs');
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="max-w-3xl mx-auto flex flex-col"
      onClick={closeAll}
    >
      <div
        className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Model photo grid — updates when model changes */}
        {/* {selectedModel && selectedModel.imagePaths?.length > 0 && (
          <div className="w-full p-2">
            <div className="grid grid-cols-4 gap-1">
              {selectedModel.imagePaths
                .slice(0, 4)
                .map((path: string, i: number) => (
                  <div
                    key={i}
                    className="relative overflow-hidden"
                  >
                    <PublicationImage
                      src={path}
                      alt={`${selectedModel.name} preview ${i + 1}`}
                      className="rounded-lg! object-cover aspect-square w-full h-full"
                    />
                  </div>
                ))}
            </div>
          </div>
        )} */}

        {/* Textarea */}
        <div className="px-4 pt-4">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              autoResize();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder={`Опишите желаемое фото…${quality === '2K' ? '(✦20)' : '(✦15)'}`}
            className="w-full bg-transparent resize-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none min-h-10 max-h-40"
            rows={2}
          />
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 px-3 pb-3 flex-wrap">
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setModelOpen((v) => !v);
                setAspectOpen(false);
                setQualityOpen(false);
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

            {modelOpen && (
              <div className="absolute bottom-full mb-2 left-0 z-50 min-w-45 rounded-xl border border-white/10 bg-[#1a1a1a] shadow-2xl overflow-hidden">
                <ScrollArea className="h-32">
                  {models.map((model) => (
                    <button
                      key={model.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedModelId(model.id);
                        setModelOpen(false);
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
                      setModelOpen(false);
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
          {/* 
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setAspectOpen((v) => !v);
                setModelOpen(false);
                setQualityOpen(false);
              }}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 transition-colors font-medium"
            >
              <span>{aspectRatio}</span>
              <ChevronDown className="size-3 opacity-60" />
            </button>
            {aspectOpen && (
              <div className="absolute bottom-full mb-2 left-0 z-50 min-w-24 rounded-xl border border-white/10 bg-[#1a1a1a] shadow-2xl overflow-hidden">
                {ASPECT_RATIOS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAspectRatio(r);
                      setAspectOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-sm text-left hover:bg-white/10 transition-colors ${r === aspectRatio ? 'text-[#AAFF00]' : 'text-foreground'
                      }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>
         */}

          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setQualityOpen((v) => !v);
                setModelOpen(false);
                setAspectOpen(false);
              }}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 transition-colors font-medium"
            >
              <span>{quality}</span>
              <ChevronDown className="size-3 opacity-60" />
            </button>
            {qualityOpen && (
              <div className="absolute bottom-full mb-2 left-0 z-50 min-w-32 rounded-xl border border-white/10 bg-[#1a1a1a] shadow-2xl overflow-hidden">
                {QUALITIES.map((q) => (
                  <button
                    key={q.value}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuality(q.value as '1K' | '2K');
                      setQualityOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-sm text-left hover:bg-white/10 transition-colors ${q.value === quality ? 'text-fuchsia-500' : 'text-foreground'
                      }`}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            )}
          </div>


          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              isGenerating ||
              generateImage.isPending ||
              prompt.trim().length < 3
            }
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background:
                isGenerating || generateImage.isPending
                  ? 'rgba(170,255,0,0.4)'
                  : '#AAFF00',
              color: '#000',
            }}
          >
            {isGenerating || generateImage.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {/* <span>Генерируется</span> */}
              </>
            ) : (
              <>
                <div className='flex items-center justify-center'>
                  <SendHorizonal className='size-4' />
                </div>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const WelcomeHero = () => {
  const t = useTranslations('Components.WelcomeHero');
  const { data: user, isLoading: isUserLoading } = useUser();
  const { data: models, isLoading: isModelsLoading } = useAIModels();
  const [createModelOpen, setCreateModelOpen] = useState(false);

  const isLoading = isUserLoading || (!!user && isModelsLoading);
  const hasModels = !!models && models.length > 0;

  const state = !user
    ? 'guest'
    : !hasModels
      ? 'noModel'
      : 'hasModel';

  const titles = t.raw(`${state}.title`) as string[];
  const subtitle = t(`${state}.subtitle`, {
    username: user?.username!
  });

  const parsedTitles = titles.map((text) =>
    text.replace('{username}', user?.username ?? '')
  );

  const titleText = useTypewriter(parsedTitles, 40, 1800);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="flex flex-col items-center gap-5 py-10 px-4 text-center"
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.05 }}
          className="relative size-16 rounded-2xl overflow-hidden shadow-lg ring-1 ring-white/10"
        >
          <Image
            src="/assets/logo.jpg"
            alt="logo"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12 }}
          className="space-y-1.5"
        >
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            {titleText}&nbsp;
          </h1>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
            {subtitle}
          </p>
        </motion.div>

        {/* CTA */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-12 w-full max-w-sm rounded-2xl bg-muted/40 animate-pulse"
            />
          ) : !user ? (
            <motion.div
              key="not-authed"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex gap-2"
            >
              <Link href="/register">
                <Button
                  className="gap-2 rounded-2xl font-semibold"
                  style={{ background: '#AAFF00', color: '#000' }}
                >
                  <UserPlus className="size-4" />
                  {t("register")}
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="gap-2 rounded-2xl">
                  {t("login")}
                </Button>
              </Link>
            </motion.div>
          ) : !hasModels ? (
            <motion.div
              key="no-model"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                onClick={() => setCreateModelOpen(true)}
                className="gap-2 rounded-2xl font-semibold"
                style={{ background: '#AAFF00', color: '#000' }}
              >
                <Plus className="size-4" />
                {t("create")}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="has-model"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <InlineMagicPhotoForm models={models} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <CreateModelDialog
        open={createModelOpen}
        onOpenChange={setCreateModelOpen}
        redirectToGenerate
      />
    </>
  );
};
