"use client";

import { z } from "zod";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTtModels, useGenerateTtImage } from "@/hooks/useTtapi";
import { TtModelsEmpty } from "@/components/states/empty/Empty";
import { NotAuthorized } from "@/components/states/error/Error";
import { useUser } from "@/hooks/useAuth";

const formSchema = z.object({
    prompt: z.string().min(3),
    modelId: z.string().min(1),
    publish: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export const TtMagicPhoto = () => {
    const t = useTranslations("Pages.MagicPhoto");
    const { data: user } = useUser();
    const router = useRouter();
    const searchParams = useSearchParams();

    const generateImage = useGenerateTtImage();
    const { data: models, isLoading: isModelsLoading } = useTtModels();
    const [isGenerating, setIsGenerating] = useState(false);

    const queryModelId = searchParams.get("modelId");

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
            modelId: "",
            publish: false,
        },
    });

    useEffect(() => {
        if (!models?.length) return;

        if (queryModelId && models.some(m => m.id === queryModelId)) {
            form.setValue("modelId", queryModelId, { shouldValidate: true });
        } else {
            form.setValue("modelId", models[0].id, { shouldValidate: true });
        }
    }, [models, queryModelId]);

    const onSubmit = async (values: FormValues) => {
        setIsGenerating(true);
        try {
            await generateImage.mutateAsync({
                prompt: values.prompt,
                modelId: values.modelId,
                publish: values.publish,
            });
            router.push("/library?tab=jobs");
        } catch (error) {
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    if (!user) {
        return (
            <div className="state-center">
                <NotAuthorized />
            </div>
        );
    }

    if (user && isModelsLoading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="animate-spin size-8" />
            </div>
        );
    }

    if (user && !models || models!.length === 0) {
        return (
            <div className="state-center">
                <TtModelsEmpty />
            </div>
        );
    }

    return (
        <section className="max-w-3xl mx-auto min-h-screen section-padding">
            <Card className="bg-transparent shadow-none border-none">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 title-text text-2xl">{t("title")}</CardTitle>
                    <CardDescription>{t("description")}</CardDescription>
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
                                        <Select
                                            key={field.value}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t("selectPlaceholder")} />
                                                </SelectTrigger>
                                            </FormControl>

                                            <SelectContent>
                                                {models!.map((model) => (
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
                                            <Textarea placeholder={t("promptPlaceholder")} className="min-h-30 resize-none" {...field} />
                                        </FormControl>
                                        <FormDescription>{t("promptDesc")}</FormDescription>
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
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>{t("publishLabel")}</FormLabel>
                                            <p className="text-sm text-muted-foreground">{t("publishDesc")}</p>
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
                                        <Loader2 className="animate-spin mr-2" />
                                        {t("generatingBtn")}
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2" /> {t("generateBtn")}
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