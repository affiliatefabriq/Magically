"use client";

import Link from "next/link";

import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGenerateHiggsfieldVideo } from "@/hooks/useHiggsfield";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, Loader2 } from "lucide-react";
import { UploadImage } from "@/components/shared/create/UploadImage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";

const formSchema = z.object({
    prompt: z.string().min(10, "Prompt must be at least 10 characters"),
    model: z.enum(["turbo", "standard", "lite"]),
    enhance_prompt: z.boolean().default(false).optional(),
    seed: z.number().optional(),
    images: z.array(z.instanceof(File)).min(1, "At least 1 image required").max(2, "Maximum 2 images allowed"),
    publish: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export const GenerateVideo = ({ motionId }: { motionId: string }) => {
    const t = useTranslations("Pages.Effects.VideoEffects");
    const router = useRouter();
    const generateVideo = useGenerateHiggsfieldVideo();
    const [loading, setLoading] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
            model: "standard",
            enhance_prompt: false,
            images: [],
            publish: false,
        },
    });

    const onSubmit = async (values: FormValues) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("prompt", values.prompt);
            formData.append("motion_id", motionId);
            formData.append("model", values.model);
            formData.append("enhance_prompt", String(values.enhance_prompt));
            formData.append("publish", String(values.publish));
            if (values.seed) formData.append("seed", String(values.seed));

            values.images.forEach((file) => {
                formData.append("higgsfieldImage", file);
            });

            const response = await generateVideo.mutateAsync(formData);

            if (response) {
                 window.dispatchEvent(new Event("generation-started"));
                 router.push(`/library`); 
            };
        } catch (error: any) {
            console.error("Generation error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="max-w-3xl mx-auto">
            <div className="fixed md:hidden h-12 backdrop-blur-2xl w-full top-0 left-0 right-0 text-sm z-10">
                <Link href="/create/video-effects" className="flex items-center justify-start h-full ml-4 link-text">
                    <ChevronLeft className="size-4" />
                    <span>{t("title")}</span>
                </Link>
            </div>

            <Card className="bg-transparent shadow-none border-none mt-8 md:mt-0">
                <CardHeader>
                    <CardTitle className="title-text">{t("title")}</CardTitle>
                    <CardDescription>{t("description")}</CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="prompt"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("Prompt.title")}</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={t("Prompt.placeholder")}
                                                className="min-h-25"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            {t("Prompt.message")}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="model"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("Quality.title")}</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t("Quality.placeholder")} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="lite">{t("Quality.lite")}</SelectItem>
                                                <SelectItem value="standard">{t("Quality.standard")}</SelectItem>
                                                <SelectItem value="turbo">{t("Quality.turbo")}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="images"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("Image.title")}</FormLabel>
                                        <FormControl>
                                            <UploadImage
                                                imageAmount={2}
                                                onChange={(files) => field.onChange(files)}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            {t("Image.message")}
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
                                            <FormLabel>
                                                {t("Publish.title")}
                                            </FormLabel>
                                            <p className="text-sm text-muted-foreground">
                                                {t("Publish.description")}
                                            </p>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                disabled={loading || generateVideo.isPending}
                                className="w-full btn-solid"
                            >
                                {loading || generateVideo.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {t("Generate.action")}
                                    </>
                                ) : (
                                    t("Generate.title")
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </section>
    );
};