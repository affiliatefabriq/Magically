"use client";

import Link from "next/link";

import { z } from "zod";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useTtModels, useGenerateTtImage, useTtModel } from "@/hooks/useTtapi";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const formSchema = z.object({
    prompt: z.string().min(3, "Prompt is required"),
    modelId: z.string().min(1, "Please select a model"),
    publish: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export const MagicPhoto = () => {
    const t = useTranslations("Pages.MagicPhoto");
    const searchParams = useSearchParams();
    const router = useRouter();
    const preSelectedModelId = searchParams.get("modelId");

    const { data: models, isLoading: isModelsLoading } = useTtModels();

    const generateImage = useGenerateTtImage();
    const [isGenerating, setIsGenerating] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
            modelId: preSelectedModelId || "",
            publish: false,
        },
    });

    // Логика установки модели
    useEffect(() => {
        if (preSelectedModelId && models) {
            const exists = models.find(m => m.id === preSelectedModelId);
            if (exists) {
                form.setValue("modelId", preSelectedModelId);
            }
        } else if (models && models.length > 0 && !form.getValues("modelId")) {
            form.setValue("modelId", models[0].id);
        }
    }, [preSelectedModelId, models, form]);

    const onSubmit = async (values: FormValues) => {
        setIsGenerating(true);
        try {
            await generateImage.mutateAsync({
                prompt: values.prompt,
                modelId: values.modelId,
                publish: values.publish
            });
            router.push("/library?tab=jobs");
        } catch (error) {
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    if (isModelsLoading) {
        return <div className="flex items-center justify-center h-[50vh]"><Loader2 className="animate-spin size-8" /></div>;
    }

    if (!models || models.length === 0) {
        return (
            <div className="section-padding flex flex-col items-center justify-center gap-4 mt-10">
                <AlertCircle className="size-10 text-muted-foreground" />
                <h2 className="title-text">{t("noModelsTitle")}</h2>
                <p className="text-muted-foreground">{t("noModelsDesc")}</p>
                <Link href="/create/models">
                    <Button className="btn-solid">{t("createModelBtn")}</Button>
                </Link>
            </div>
        );
    }

    return (
        <section className="max-w-3xl mx-auto min-h-screen">
            <div className="fixed md:hidden h-12 backdrop-blur-2xl w-full top-0 left-0 right-0 text-sm z-10 flex items-center">
                <Link href="/create/models" className="flex items-center justify-start h-full ml-4 link-text gap-1">
                    <ChevronLeft className="size-4" />
                    <span>Back</span>
                </Link>
            </div>

            <Card className="bg-transparent shadow-none border-none mt-12 md:mt-4">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 title-text text-2xl">
                        {t("title")}
                    </CardTitle>
                    <CardDescription>
                        {t("description")}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            <FormField
                                control={form.control}
                                name="modelId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("selectModel")}</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t("selectPlaceholder")} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {models.map((model) => (
                                                    <SelectItem key={model.id} value={model.id}>
                                                        {model.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="prompt"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("promptLabel")}</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={t("promptPlaceholder")}
                                                className="min-h-30 resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            {t("promptDesc")}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="publish"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>{t("publishLabel")}</FormLabel>
                                            <p className="text-sm text-muted-foreground">
                                                {t("publishDesc")}
                                            </p>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full btn-solid py-2"
                                disabled={isGenerating || generateImage.isPending}
                            >
                                {isGenerating || generateImage.isPending ? (
                                    <>
                                        <Loader2 className="animate-spin" />
                                        {t("generatingBtn")}
                                    </>
                                ) : (
                                    <>
                                        <Sparkles /> {t("generateBtn")}
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </section>
    );
};