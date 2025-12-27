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

import { Badge } from "@/components/ui/badge";
import { JobEmpty, LibraryEmpty } from "@/components/states/empty/Empty";
import { ExploreLoader, LargeListLoader, SearchLoader } from "@/components/states/loaders/Loaders";
import {
  CheckCircle2,
  Loader2,
  XCircle,
  Clock,
  Verified,
  X
} from "lucide-react";
import {
  LibraryError,
  NotAuthorized
} from "@/components/states/error/Error";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

export const Library = () => {
  const t = useTranslations("Pages.Library");

  // User
  const { data: user } = useUser();

  // Gallery Query
  const [galleryFilters] = useState({ sortBy: "newest" });
  const { data: galleryItems, isLoading: isGalleryLoading } = useGallery(galleryFilters);

  // History (Jobs) Query
  const { data: jobs, isLoading: isJobsLoading } = useGenerationHistory();

  // Transactions Query
  const { data: transactionsData, isLoading: isTransLoading } = useTransactions(1, 20);

  if (!user) return <div className="state-center"><NotAuthorized /></div>


  return (
    <section className="container mx-auto section-padding">
      <h1 className="title-text mt-4 mb-6">{t("title")}</h1>

      <Tabs defaultValue="gallery" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-2">
          <TabsTrigger value="gallery">{t("Gallery")}</TabsTrigger>
          <TabsTrigger value="jobs">{t("Jobs")}</TabsTrigger>
          <TabsTrigger value="transactions">{t("Transactions")}</TabsTrigger>
        </TabsList>
        <TabsContent value="gallery">
          {isGalleryLoading && <ExploreLoader />}
          {galleryItems?.length === 0 && <div className="state-center"><LibraryEmpty /></div>}
          <div className="grid-4 gap-4">
            {galleryItems?.map((item: any) => (
              <div key={item.id} className="relative group rounded-lg overflow-hidden border">
                <Image src={`${API_URL}${item.imageUrl}`} alt={item.prompt} width={300} height={300} className="object-cover w-full aspect-square" />
                <div className="flex flex-col items-start justify-center p-4 text-sm gap-4">
                  <p>{item.prompt}</p>
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
                    {job.status === 'completed' && (
                      <Badge className="flex items-center justify-center btn-solid">
                        <Verified /> {job.status}
                      </Badge>
                    )}
                    {job.status === 'pending' && (
                      <Badge className="btn-magic-secondary">
                        <Clock /> {job.status}
                      </Badge>
                    )}
                    {job.status === 'failed' && (
                      <Badge variant="destructive">
                        <X /> {job.status}
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-sm w-fit">
                    {job.meta?.prompt || "No prompt"}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="transactions">
          {isTransLoading && <SearchLoader />}
          {transactionsData.length === 0 && <JobEmpty />}
          <div className="flex flex-col gap-2">
            {transactionsData?.rows?.map((tx: any) => (
              <div key={tx.id} className="flex justify-between items-center p-3 border rounded-xl theme">
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{tx.description}</span>
                  <span className="text-xs text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString()}</span>
                </div>
                <span className={`font-bold ${tx.type === 'credit' ? 'text-lime-400 dark:text-lime-500' : 'text-red-500'}`}>
                  {tx.type === 'credit' ? '+' : '-'}{tx.amount} ✦
                </span>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};