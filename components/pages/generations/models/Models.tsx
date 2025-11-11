"use client";

import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTrainModel } from "@/hooks/useReplicate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadImage } from "@/components/shared/create/UploadImage";
import {
    Card,
    CardHeader,
    CardContent
} from "@/components/ui/card";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const formSchema = z.object({
    modelName: z.string().min(2, "Model name is required"),
    triggerWord: z.string().min(1, "Trigger word required"),
    images: z.array(z.instanceof(File)).min(5, "At least 5 images required"),
});

export const Models = () => {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { modelName: "", triggerWord: "", images: [] as File[] },
    });
    const trainModel = useTrainModel();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const formData = new FormData();
        formData.append("modelName", values.modelName);
        formData.append("triggerWord", values.triggerWord);
        values.images.forEach((file) => formData.append("replicateImages", file));

        setLoading(true);
        await trainModel.mutateAsync(formData);
        setLoading(false);
    };

    return (
        <section className="max-w-3xl mx-auto">
            <div className="fixed md:hidden h-12 backdrop-blur-2xl w-full top-0 left-0 right-0 text-sm z-10">
                <Link href="/create/magic-photo" className="flex items-center justify-start h-full ml-2 link-text">
                    <ChevronLeft className="size-4 " />
                    <span>Magic photo</span>
                </Link>
            </div>
            <Card className="bg-transparent shadow-none border-none mt-8 md:mt-0">
                <CardHeader>
                    <h2 className="title-text">Create Your Model</h2>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="modelName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Model Name</FormLabel>
                                        <Input placeholder="e.g. MyDreamyFace" {...field} />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="triggerWord"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Trigger Word</FormLabel>
                                        <Input placeholder="@myface" {...field} />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="images"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Training Images (min 5)</FormLabel>
                                        <UploadImage
                                            imageAmount={15}
                                            onChange={(files) => field.onChange(files)}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                disabled={loading}
                                className="btn-solid w-full"
                            >
                                {loading ? "Training..." : "Start Training"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </section>
    );
};
