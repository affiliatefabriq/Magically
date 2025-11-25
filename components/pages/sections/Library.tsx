"use client";

import Image from "next/image";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { API_URL } from "@/lib/api";
import { useUser } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import { useGallery } from "@/hooks/useGallery";
import { useHistory, HistoryItem } from "@/hooks/useHistory";
import { useProcessGptImage } from "@/hooks/useGpt";
import { useProcessNanoImage } from "@/hooks/useNano";
import { useProcessHiggsfieldVideo } from "@/hooks/useHiggsfield";
import { useProcessKlingVideo } from "@/hooks/useKling";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExploreLoader } from "@/components/states/loaders/Loaders";
import { LibraryError, NotAuthorized } from "@/components/states/error/Error";
import { LibraryEmpty } from "@/components/states/empty/Empty";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Loader2, XCircle, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export const Library = () => {
  const t = useTranslations("Pages.Library");
  const { data: user } = useUser();
  const searchParams = useSearchParams();
  const highlightHistoryId = searchParams.get("historyId");

  const [filters, setFilters] = useState({ sortBy: "newest", searchQuery: "", date: "" });
  const { data: galleryItems, isLoading, isError } = useGallery(filters);
  const { data: historyData } = useHistory(1, 20);

  const [processDialog, setProcessDialog] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<HistoryItem | null>(null);
  const [publish, setPublish] = useState(false);
  const [promptText, setPromptText] = useState("");

  const processGpt = useProcessGptImage();
  const processNano = useProcessNanoImage();
  const processKling = useProcessKlingVideo();
  const processHiggsfield = useProcessHiggsfieldVideo();

  const handleCompleteGeneration = (item: HistoryItem) => {
    setSelectedHistory(item);
    setPromptText(item.prompt || "");
    setProcessDialog(true);
  };

  const handleProcess = async () => {
    if (!selectedHistory) return;

    const payload = {
      publish,
      historyId: selectedHistory.id,
    };

    try {
      switch (selectedHistory.service) {
        case "gpt":
          await processGpt.mutateAsync(payload);
          break;
        case "nano":
          await processNano.mutateAsync(payload);
          break;
        case "kling":
          await processKling.mutateAsync(payload);
          break;
        case "higgsfield":
          await processHiggsfield.mutateAsync(payload);
          break;
        default:
          break;
      }
      setProcessDialog(false);
      setSelectedHistory(null);
    } catch (error) {
      console.error("Process error:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="text-green-500" />;
      case "failed":
        return <XCircle className="text-red-500" />;
      case "processing":
        return <Loader2 className="animate-spin text-blue-500" />;
      default:
        return <Clock className="text-gray-500" />;
    }
  };

  if (!user) {
    return (
      <div className="state-center">
        <NotAuthorized />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="state-center">
        <LibraryError />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="section-padding">
        <ExploreLoader />
      </div>
    );
  }

  return (
    <section className="container mx-auto section-padding">
      <h1 className="title-text mt-4 my-2">{t("title")}</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          placeholder={t("search")}
          className="w-full"
          value={filters.searchQuery}
          onChange={(e) => setFilters((p) => ({ ...p, searchQuery: e.target.value }))}
        />
        <div className="flex gap-2">
          <Select value={filters.sortBy} onValueChange={(v) => setFilters((p) => ({ ...p, sortBy: v }))}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t("newest")}</SelectItem>
              <SelectItem value="oldest">{t("oldest")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {!isLoading && !isError && galleryItems?.length === 0 && <LibraryEmpty />}

      <div className="grid-4 gap-4">
        {galleryItems?.map((item) => {
          const isVideo = item.imageUrl.endsWith(".mp4");
          return (
            <div key={item.id} className="relative group">
              {isVideo ? (
                <video
                  src={`${API_URL}${item.imageUrl}`}
                  loop
                  muted
                  autoPlay
                  playsInline
                  className="w-full h-auto rounded-lg object-cover aspect-square"
                />
              ) : (
                <Image
                  src={`${API_URL}${item.imageUrl}`}
                  alt={item.prompt}
                  width={500}
                  height={500}
                  className="w-full h-auto rounded-lg object-cover aspect-square"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 backdrop-blur-3xl text-white p-2 text-xs rounded-b-lg transition-opacity">
                {item.prompt}
              </div>
            </div>
          );
        })}
      </div>

      <Separator className="my-8" />

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Generation History</h2>
        <div className="space-y-4">
          {historyData?.history?.map((item: HistoryItem) => (
            <Card
              key={item.id}
              className={`${highlightHistoryId === item.id ? "border-blue-500 border-2" : ""
                }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(item.status)}
                    <div>
                      <p className="font-medium">{item.service.toUpperCase()}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {item.prompt || "No prompt"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Status: {item.status}</span>
                    {item.status === "completed" && !item.resultUrl && (
                      <Button
                        size="sm"
                        onClick={() => handleCompleteGeneration(item)}
                        className="btn-solid"
                      >
                        Complete
                      </Button>
                    )}
                    {item.status === "failed" && (
                      <span className="text-xs text-red-500">{item.errorMessage}</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={processDialog} onOpenChange={setProcessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Generation</DialogTitle>
            <DialogDescription>
              Choose where to save your generated content
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Prompt</label>
              <Textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Add a description..."
                className="mt-2"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="publish"
                checked={publish}
                onCheckedChange={(checked) => setPublish(checked as boolean)}
              />
              <label htmlFor="publish" className="text-sm cursor-pointer">
                Publish to feed (otherwise save to library)
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setProcessDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleProcess}
              disabled={
                processGpt.isPending ||
                processNano.isPending ||
                processKling.isPending ||
                processHiggsfield.isPending
              }
              className="btn-solid"
            >
              {processGpt.isPending || processNano.isPending || processKling.isPending || processHiggsfield.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};