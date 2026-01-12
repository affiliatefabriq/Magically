"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadImage } from "@/components/shared/create/UploadImage";
import { useCreateTtModel, useUpdateTtModel, TtModel } from "@/hooks/useTtapi";

const formSchema = z.object({
    name: z.string().min(2, "Name is required"),
    description: z.string().optional(),
    images: z.array(z.instanceof(File)).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateModelDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    modelToEdit?: TtModel;
}

export const CreateModelDialog = ({
    open,
    onOpenChange,
    modelToEdit,
}: CreateModelDialogProps) => {
    const createModel = useCreateTtModel();
    const updateModel = useUpdateTtModel();
    const isEditing = !!modelToEdit;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            images: [],
        },
    });

    useEffect(() => {
        if (open) {
            if (modelToEdit) {
                form.reset({
                    name: modelToEdit.name,
                    description: modelToEdit.description || "",
                    images: [],
                });
            } else {
                form.reset({
                    name: "",
                    description: "",
                    images: [],
                });
            }
        }
    }, [open, modelToEdit, form]);

    const onSubmit = async (values: FormValues) => {
        if (!isEditing && (!values.images || values.images.length !== 4)) {
            toast.error("Please upload exactly 4 images for the model.");
            return;
        }
        if (isEditing && values.images && values.images.length > 0 && values.images.length !== 4) {
            toast.error("Please upload exactly 4 images if you want to replace them.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("description", values.description || "");

            if (values.images && values.images.length === 4) {
                values.images.forEach((file) => {
                    formData.append("modelImages", file);
                });
            }

            if (isEditing && modelToEdit) {
                await updateModel.mutateAsync({ id: modelToEdit.id, formData });
            } else {
                await createModel.mutateAsync(formData);
            }

            onOpenChange(false);
        } catch (error) {
            console.error(error);
        }
    };

    const isLoading = createModel.isPending || updateModel.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-125">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Model" : "Create Model"}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Update your model details. Uploading new photos will replace existing ones."
                            : "Upload exactly 4 photos to define your style or character."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Model Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Cyberpunk Style" {...field} />
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
                                    <FormLabel>Description (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Short description..." {...field} />
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
                                    <FormLabel>Photos (4 required)</FormLabel>
                                    <FormControl>
                                        <UploadImage
                                            imageAmount={4}
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
                                Cancel
                            </Button>
                            <Button type="submit" className="btn-solid" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEditing ? "Save Changes" : "Create Model"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};