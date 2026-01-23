"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Send, Sparkles, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAIModels, useGenerateAI } from "@/hooks/useAi";
import { ModelsEmpty } from "@/components/states/empty/Empty";
import { useUser } from "@/hooks/useAuth";
import { NotAuthorized } from "@/components/states/error/Error";
import { API_URL } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const MagicPhoto = () => {
  const t = useTranslations("Pages.MagicPhoto");
  const { data: user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  const generateImage = useGenerateAI();
  const { data: models, isLoading: isModelsLoading } = useAIModels();

  const [prompt, setPrompt] = useState("");
  const [selectedModelId, setSelectedModelId] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [publish, setPublish] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasStartedGeneration, setHasStartedGeneration] = useState(false);

  const queryModelId = searchParams.get("modelId");

  useEffect(() => {
    if (!models?.length) return;

    if (queryModelId && models.some((m) => m.id === queryModelId)) {
      setSelectedModelId(queryModelId);
    } else {
      setSelectedModelId(models[0].id);
    }
  }, [models, queryModelId]);

  const selectedModel = models?.find((m) => m.id === selectedModelId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim() || !selectedModelId) return;

    setIsGenerating(true);
    setHasStartedGeneration(true);

    try {
      await generateImage.mutateAsync({
        prompt: prompt.trim(),
        modelId: selectedModelId,
        publish,
        aspect_ratio: aspectRatio,
      });

      setTimeout(() => {
        router.push("/library?tab=jobs");
      }, 1000);
    } catch (error) {
      console.error(error);
      setIsGenerating(false);
    }
  };

  if (!user) {
    return (
      <div className="state-center">
        <NotAuthorized />
      </div>
    );
  }

  if (user && isModelsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin size-8" />
      </div>
    );
  }

  if (user && (!models || models.length === 0)) {
    return <ModelsEmpty />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center section-padding">
      <div className="w-full max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="title-text text-3xl mb-2 flex items-center justify-center gap-2">
            <Sparkles className="size-8" />
            {t("title")}
          </h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>

        {/* Main Content Area */}
        <div
          className={`flex-1 flex flex-col ${hasStartedGeneration ? "justify-start" : "justify-center"
            } transition-all duration-500`}
        >
          {/* Preview Images - показываются когда модель выбрана */}
          {selectedModel && !hasStartedGeneration && (
            <Card className="mb-6 p-6 bg-muted/50 backdrop-blur-sm border-dashed">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary" className="text-sm">
                  {selectedModel.name}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {selectedModel.imagePaths.length} training images
                </span>
              </div>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                {selectedModel.imagePaths.slice(0, 6).map((path, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-lg overflow-hidden border bg-background group"
                  >
                    <Image
                      src={`${API_URL}${path}`}
                      alt={`Training ${idx + 1}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Generation Status */}
          {hasStartedGeneration && isGenerating && (
            <Card className="p-8 text-center bg-muted/50 backdrop-blur-sm mb-6">
              <Loader2 className="animate-spin size-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">
                {t("generatingBtn")}
              </h3>
              <p className="text-sm text-muted-foreground">
                Creating your magic photo...
              </p>
            </Card>
          )}
        </div>

        {/* Input Area - fixed at bottom */}
        <div className="w-full space-y-4 pb-4">
          {/* Options Row */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="publish"
                checked={publish}
                onCheckedChange={(checked) => setPublish(checked as boolean)}
              />
              <Label
                htmlFor="publish"
                className="text-sm font-medium leading-none cursor-pointer"
              >
                {t("publishLabel")}
              </Label>
            </div>

            <Select value={aspectRatio} onValueChange={setAspectRatio}>
              <SelectTrigger className="w-full sm:w-45">
                <SelectValue placeholder="Aspect Ratio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1:1">{t("Aspect.Square")}</SelectItem>
                <SelectItem value="16:9">{t("Aspect.Landscape")}</SelectItem>
                <SelectItem value="9:16">{t("Aspect.Portrait")}</SelectItem>
                <SelectItem value="4:3">{t("Aspect.Standard")}</SelectItem>
                <SelectItem value="3:4">{t("Aspect.Tall")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Main Input */}
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex gap-2 items-end">
              {/* Model Select */}
              <div className="shrink-0">
                <Select value={selectedModelId} onValueChange={setSelectedModelId}>
                  <SelectTrigger className="w-45 md:w-50">
                    <SelectValue placeholder={t("selectModel")} />
                  </SelectTrigger>
                  <SelectContent>
                    {models!.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Textarea */}
              <div className="flex-1 relative">
                <Textarea
                  placeholder={t("promptPlaceholder")}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-15 max-h-30 resize-none pr-12"
                  disabled={isGenerating}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                {prompt && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 bottom-2 size-8"
                    onClick={() => setPrompt("")}
                  >
                    <X className="size-4" />
                  </Button>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isGenerating || !prompt.trim() || !selectedModelId}
                className="btn-solid h-15 px-6"
              >
                {isGenerating ? (
                  <Loader2 className="animate-spin size-5" />
                ) : (
                  <Send className="size-5" />
                )}
              </Button>
            </div>
          </form>

          {/* Helper Text */}
          <p className="text-xs text-muted-foreground text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};