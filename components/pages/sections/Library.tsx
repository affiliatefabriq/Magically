"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { API_URL } from "@/lib/api";
import { useUser } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import { useGallery } from "@/hooks/useGallery";
import { useTransactions } from "@/hooks/useTransaction";
import { useGenerationHistory } from "@/hooks/useGenerations";
import { useTtModels } from "@/hooks/useTtapi"; // Import models hook

import { Badge } from "@/components/ui/badge";
import { JobEmpty, LibraryEmpty, ModelsEmpty } from "@/components/states/empty/Empty";
import { ExploreLoader, LargeListLoader, SearchLoader } from "@/components/states/loaders/Loaders";
import { Clock, Verified, X } from "lucide-react";
import { NotAuthorized } from "@/components/states/error/Error";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PublicationImage } from "@/components/shared/publication/PublicationImage";

export const Library = () => {
  const t = useTranslations("Pages.Library");
  const { data: user } = useUser();
  const [galleryFilters] = useState({ sortBy: "newest" });

  const { data: galleryItems, isLoading: isGalleryLoading } = useGallery(galleryFilters);
  const { data: jobs, isLoading: isJobsLoading } = useGenerationHistory();
  const { data: models, isLoading: isModelsLoading } = useTtModels();

  if (!user) return <div className="state-center"><NotAuthorized /></div>;

  return (
    <section className="container mx-auto section-padding">
      <h1 className="title-text mt-4 mb-6">{t("title")}</h1>

      <Tabs defaultValue="gallery" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-2">
          <TabsTrigger value="gallery">{t("Gallery")}</TabsTrigger>
          <TabsTrigger value="jobs">{t("Jobs")}</TabsTrigger>
          <TabsTrigger value="models">{t("Models")}</TabsTrigger>
        </TabsList>

        <TabsContent value="gallery">
          {isGalleryLoading && <ExploreLoader />}
          {galleryItems?.length === 0 && <div className="state-center"><LibraryEmpty /></div>}
          <div className="grid-4 gap-4">
            {galleryItems?.map((item: any) => (
              <div key={item.id} className="relative group rounded-lg overflow-hidden border">
                <Image src={`${API_URL}${item.imageUrl}`} alt={item.prompt} width={300} height={300} className="object-cover w-full aspect-square" />
                <div className="flex flex-col items-start justify-center p-4 text-sm gap-4">
                  <p className="prompt-text text-tertiary-text">{item.prompt}</p>
                  <time className="text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</time>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="jobs">
          {isJobsLoading && <LargeListLoader />}
          {jobs?.length === 0 && <div className="state-center"><JobEmpty /></div>}
          <div className="flex flex-col gap-3">
            {jobs?.map((job: any) => (
              <Link href={`/create/generation/${job.id}`} key={job.id}>
                <Card className="theme shadow-none rounded-xl">
                  <CardHeader className="p-4 flex flex-row items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm uppercase">{job.service}</span>
                      <span className="text-xs text-muted-foreground">{new Date(job.createdAt).toLocaleString()}</span>
                    </div>
                    {job.status === 'completed' && <Badge className="flex items-center justify-center btn-solid"><Verified /> {job.status}</Badge>}
                    {(job.status === 'pending' || job.status === 'processing') && <Badge className="btn-magic-secondary"><Clock /> {job.status}</Badge>}
                    {job.status === 'failed' && <Badge variant="destructive"><X /> {job.status}</Badge>}
                  </CardHeader>
                  <CardContent className="p-4 pt-0 w-fit prompt-text text-tertiary-text">
                    {job.meta?.prompt || "No prompt"}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        {/* Models Tab */}
        <TabsContent value="models">
          {isModelsLoading && <ExploreLoader />}
          {(!models || models.length === 0) && <div className="state-center"><ModelsEmpty /></div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {models?.map((model) => (
              // Redirect to main models page as requested
              <Link href="/create/models" key={model.id}>
                <Card className="group relative overflow-hidden theme shadow-none py-0">
                  <div className="relative aspect-square bg-muted overflow-hidden">
                    <PublicationImage
                      src={`${API_URL}${model.imagePaths[0]}`}
                      alt={model.name}
                      className="rounded-none!"
                    />
                  </div>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg truncate">{model.name}</CardTitle>
                  </CardHeader>
                  <CardFooter className="p-4 pt-0 text-xs text-muted-foreground flex justify-between">
                    <span>{new Date(model.createdAt).toLocaleDateString()}</span>
                    <span>{t("Flux")}</span>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};