"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useTranslations } from "next-intl";

import { UploadImage } from "@/components/shared/create/UploadImage";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateFluxModel, useUpdateFluxModel } from "@/hooks/useFlux";
// ttapi хуки пока убрал, если мы работаем только с Flux как основным, либо добавить по аналогии

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
  type: "ttapi" | "flux";
}

export const CreateModelDialog = ({ open, onOpenChange, modelToEdit, type }: CreateModelDialogProps) => {
  const t = useTranslations("Pages.Models.Dialog");
  const tAlerts = useTranslations("Pages.Models.Alerts");

  const createFluxModel = useCreateFluxModel();
  const updateFluxModel = useUpdateFluxModel();

  const isEditing = !!modelToEdit;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      instruction: "",
      images: [],
    },
  });

  useEffect(() => {
    if (open) {
      if (modelToEdit) {
        form.reset({
          name: modelToEdit.name,
          description: modelToEdit.description || "",
          instruction: modelToEdit.instruction || "",
          images: [],
        });
      } else {
        form.reset({
          name: "",
          description: "",
          instruction: "",
          images: [],
        });
      }
    }
  }, [open, modelToEdit, form]);

  const onSubmit = async (values: FormValues) => {
    if (!isEditing && (!values.images || values.images.length === 0)) {
      toast.error(tAlerts("minImage"));
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description || "");
      formData.append("instruction", values.instruction || "");

      if (values.images && values.images.length > 0) {
        values.images.forEach((file) => {
          formData.append("modelImages", file);
        });
      }

      // Используем Flux хуки
      if (isEditing && modelToEdit) {
        await updateFluxModel.mutateAsync({ id: modelToEdit.id, formData });
        toast.success(tAlerts("updated"));
      } else {
        await createFluxModel.mutateAsync(formData);
        toast.success(tAlerts("created"));
      }

      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  const isLoading = createFluxModel.isPending || updateFluxModel.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t("editTitle") : t("createTitle")}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? t("editDesc") : t("createDesc")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("nameLabel")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("namePlaceholder")} {...field} />
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
                  <FormLabel>{t("descLabel")}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t("descPlaceholder")} {...field} />
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
                  <FormLabel>{t("instrLabel")}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t("instrPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("photosLabel")}</FormLabel>
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
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                {t("cancel")}
              </Button>
              <Button type="submit" className="btn-solid" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? t("saveBtn") : t("createBtn")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};