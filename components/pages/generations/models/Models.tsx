"use client";

import Link from "next/link";

import { useState } from "react";
import { Plus, MoreVertical, Trash, Sparkles } from "lucide-react";
import { API_URL } from "@/lib/api";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ModelsEmpty } from "@/components/states/empty/Empty";
import { ListLoader } from "@/components/states/loaders/Loaders";

import { useTtModels, useDeleteTtModel } from "@/hooks/useTtapi";
import { CreateModelDialog } from "@/components/shared/create/CreateModelDialog";
import { PublicationImage } from "@/components/shared/publication/PublicationImage";

export const Models = () => {
  const t = useTranslations("Pages.Models");
  const { data: models, isLoading } = useTtModels();
  const deleteModel = useDeleteTtModel();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreate = () => {
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this model?")) {
      deleteModel.mutate(id);
    }
  };

  if (isLoading) return <div className="section-padding"><ListLoader /></div>;

  return (
    <section className="section-padding container mx-auto max-w-6xl min-h-screen">
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 mb-6 gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <h1 className="title-text">{t("title")}</h1>
          {/* <span className="text-muted-foreground text-base">
            {models?.length || 0}
          </span> */}
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:gap-2 w-full sm:w-auto">
          <Button onClick={handleCreate} className="btn-outline flex-1 sm:flex-none gap-2">
            <Plus className="size-4" /> {t("create")}
          </Button>
          <Link href="/create/magic-photo" className="flex-1 sm:flex-none">
            <Button className="btn-solid w-full gap-2">
              <Sparkles className="size-4" /> {t("createMagic")}
            </Button>
          </Link>
        </div>
      </div>

      <Separator className="my-4" />

      {(!models || models.length === 0) ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Button onClick={handleCreate} className="mt-2 btn-solid">
            {t("createFirst")}
          </Button>
        </div>
      ) : (
        <div className="grid-3">
          {models.map((model) => (
            <Card className="group relative overflow-hidden theme shadow-none py-0" key={model.id}>
              {/* Image Preview */}
              <Link href={`/create/models/${model.id}`} className="block relative aspect-square bg-muted overflow-hidden">
                <PublicationImage
                  src={`${API_URL}${model.imagePaths[0]}`}
                  alt={model.name}
                  className="rounded-none!"
                />
              </Link>

              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <Link href={`/create/models/${model.id}`} className="hover:underline">
                    <CardTitle className="text-lg truncate pr-2">{model.name}</CardTitle>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2">
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDelete(model.id)} className="text-red-500 focus:text-red-500">
                        <Trash className="text-red-500" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {model.description || ""}
                </p>
              </CardContent>

              <CardFooter className="p-4 pt-0 text-xs text-muted-foreground flex justify-between">
                <span>{new Date(model.createdAt).toLocaleDateString()}</span>
                <span>Flux 2 Pro</span>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <CreateModelDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </section>
  );
};