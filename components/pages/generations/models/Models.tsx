'use client';

import Link from 'next/link';

import { useState } from 'react';
import {
  MoreVertical,
  Pencil,
  Plus,
  Sparkles,
  Trash,
  ImageIcon,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { CreateModelDialog } from '@/components/shared/create/CreateModelDialog';
import { PublicationImage } from '@/components/shared/publication/PublicationImage';
import { ListLoader } from '@/components/states/loaders/Loaders';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteAIModel, useAIModels } from '@/hooks/useAi';
import { ModelsEmpty } from '@/components/states/empty/Empty';
import { useUser } from '@/hooks/useAuth';
import { NotAuthorized } from '@/components/states/error/Error';
import { Badge } from '@/components/ui/badge';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';

export const Models = () => {
  const t = useTranslations('Pages.Models');
  const { data: user } = useUser();
  const { data: models, isLoading } = useAIModels();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [modelToEdit, setModelToEdit] = useState<any>(null);

  const deleteModel = useDeleteAIModel();

  const handleCreate = () => {
    setModelToEdit(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (model: any) => {
    setModelToEdit(model);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this model?')) {
      deleteModel.mutate(id);
    }
  };

  if (!user) {
    return (
      <div className="section-padding state-center">
        <NotAuthorized />
      </div>
    );
  }

  if (user && isLoading) {
    return (
      <div className="section-padding state-center">
        <ListLoader />
      </div>
    );
  }

  return (
    <section className="section-padding container mx-auto max-w-7xl min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 mt-4 mb-6">
        <div className="flex flex-row items-start justify-between gap-4">
          <div>
            <h1 className="title-text text-2xl sm:text-3xl">{t('title')}</h1>
          </div>
          <div className="flex sm:flex-row flex-col gap-2 w-auto">
            <Link
              href="/create/magic-photo"
              className="w-auto order-1 sm:order-2"
            >
              <Button className="w-full gap-2 btn-solid" size="sm">
                <Sparkles className="size-4" /> {t('createMagic')}
              </Button>
            </Link>
            <Button
              onClick={handleCreate}
              variant="outline"
              size="sm"
              className="w-auto gap-2 order-2 sm:order-1 btn-outline"
            >
              <Plus className="size-4" /> {t('create')}
            </Button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      {!models || models.length === 0 ? (
        <ModelsEmpty />
      ) : (
        <>
          {/* Models Grid */}
          <div className="grid-3">
            {models.map((model) => (
              <Card
                key={model.id}
                className="group relative overflow-hidden theme shadow-none border hover:shadow-md transition-all duration-200 flex flex-col h-full pt-0"
              >
                {/* Image Section */}
                <Link href={`/models/${model.id}`} className="block">
                  <div className="relative aspect-square bg-muted overflow-hidden">
                    <PublicationImage
                      src={model.imagePaths[0]}
                      alt={model.name}
                      className="rounded-none! object-cover w-full h-full group-hover:scale-102 magic-transition"
                    />

                    {/* Image Count Badge */}
                    {model.imagePaths.length > 1 && (
                      <div className="absolute bottom-2 right-2">
                        <Badge
                          variant="secondary"
                          className="text-xs backdrop-blur-sm bg-background/80"
                        >
                          <ImageIcon className="size-3 mr-1" />
                          {model.imagePaths.length}
                        </Badge>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Content Section */}
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-2">
                    <Link
                      href={`/models/${model.id}`}
                      className="flex-1 min-w-0"
                    >
                      <CardTitle className="text-base sm:text-lg truncate hover:text-primary transition-colors">
                        {model.name}
                      </CardTitle>
                    </Link>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 shrink-0 transition-opacity"
                        >
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.preventDefault();
                            handleEdit(model);
                          }}
                        >
                          <Pencil className="mr-2 size-4" /> {t('edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.preventDefault();
                            handleDelete(model.id);
                          }}
                          className="text-red-500 focus:text-red-500"
                        >
                          <Trash className="text-red-500 mr-2 size-4" />{' '}
                          {t('delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="flex-1">
                  {model.description && (
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-8">
                      {model.description}
                    </p>
                  )}
                  <Link
                    href={`/create/magic-photo?modelId=${model.id}`}
                    className="w-full items-end-safe"
                  >
                    <HoverBorderGradient
                      containerClassName="rounded-full"
                      as="button"
                      className="flex flex-1 items-center space-x-4 w-full!"
                    >
                      <Sparkles className="size-4" />
                      {t('createMagic')}
                    </HoverBorderGradient>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      <CreateModelDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        modelToEdit={modelToEdit}
      />
    </section>
  );
};
