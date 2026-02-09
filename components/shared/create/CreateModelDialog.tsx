'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { useTranslations } from 'next-intl';

import { UploadImage } from '@/components/shared/create/UploadImage';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateAIModel, useUpdateAIModel } from '@/hooks/useAi';
import { API_URL } from '@/lib/api';
import { PublicationImage } from '../publication/PublicationImage';

const formSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  instruction: z.string().optional(),
  images: z.array(z.instanceof(File)).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateModelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modelToEdit?: any;
  redirectToGenerate?: boolean;
}

export const CreateModelDialog = ({
  open,
  onOpenChange,
  modelToEdit,
  redirectToGenerate = false,
}: CreateModelDialogProps) => {
  const t = useTranslations('Pages.Models.Dialog');
  const tAlerts = useTranslations('Pages.Models.Alerts');
  const router = useRouter();

  const createFluxModel = useCreateAIModel();
  const updateFluxModel = useUpdateAIModel();

  const isEditing = !!modelToEdit;

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      instruction: '',
      images: [],
    },
  });

  useEffect(() => {
    if (open) {
      setImagesToDelete([]);
      if (modelToEdit) {
        form.reset({
          name: modelToEdit.name,
          description: modelToEdit.description || '',
          instruction: modelToEdit.instruction || '',
          images: [],
        });
        setExistingImages(modelToEdit.imagePaths || []);
      } else {
        form.reset({
          name: '',
          description: '',
          instruction: '',
          images: [],
        });
        setExistingImages([]);
      }
    }
  }, [open, modelToEdit, form]);

  const handleDeleteExisting = (path: string) => {
    setExistingImages((prev) => prev.filter((p) => p !== path));
    setImagesToDelete((prev) => [...prev, path]);
  };

  const onSubmit = async (values: FormValues) => {
    const totalImages = existingImages.length + (values.images?.length || 0);

    if (totalImages === 0) {
      toast.error(tAlerts('minImage'));
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description || '');
      formData.append('instruction', values.instruction || '');

      // Новые файлы
      if (values.images && values.images.length > 0) {
        values.images.forEach((file) => {
          formData.append('modelImages', file);
        });
      }

      let createdModelId: string | undefined;

      if (isEditing && modelToEdit) {
        if (imagesToDelete.length > 0) {
          formData.append('imagesToDelete', JSON.stringify(imagesToDelete));
        }

        await updateFluxModel.mutateAsync({ id: modelToEdit.id, formData });
        toast.success(tAlerts('updated'));
        createdModelId = modelToEdit.id;
      } else {
        const response = await createFluxModel.mutateAsync(formData);
        toast.success(tAlerts('created'));
        createdModelId = response?.data?.id;
      }

      onOpenChange(false);

      if (redirectToGenerate && createdModelId) {
        router.push(`/create/magic-photo?modelId=${createdModelId}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const isLoading = createFluxModel.isPending || updateFluxModel.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t('editTitle') : t('createTitle')}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? t('editDesc') : t('createDesc')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('nameLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('namePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('descLabel')}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t('descPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instruction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('instrLabel')}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t('instrPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isEditing && existingImages.length > 0 && (
              <div className="space-y-2">
                <FormLabel>
                  {t('existing')} ({existingImages.length})
                </FormLabel>
                <div className="grid grid-cols-4 gap-2">
                  {existingImages.map((path, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-md overflow-hidden group"
                    >
                      <PublicationImage
                        src={`${API_URL}${path}`}
                        alt="existing"
                        className="object-cover "
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteExisting(path)}
                        className="absolute top-1 right-1 bg-red-500/80 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {isEditing ? t('addPhotosLabel') : t('photosLabel')}
                  </FormLabel>
                  <FormControl>
                    <UploadImage
                      imageAmount={8}
                      className="border-dashed"
                      onChange={(files) => field.onChange(files)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                {t('cancel')}
              </Button>
              <Button type="submit" className="btn-solid" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? t('saveBtn') : t('createBtn')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
