"use client";

import { z } from "zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadImage } from "@/components/shared/create/UploadImage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useGenerateHiggsfieldVideo } from "@/hooks/useHiggsfield";

const formSchema = z.object({
    prompt: z.string().min(10, "Prompt must be at least 10 characters"),
    model: z.enum(["turbo", "standard", "lite"]),
    enhance_prompt: z.boolean().default(false).optional(),
    seed: z.number().optional(),
    images: z.array(z.instanceof(File)).min(1, "At least 1 image required").max(2, "Maximum 2 images allowed"),
});

type FormValues = z.infer<typeof formSchema>;

export const GenerateVideo = ({ motionId }: { motionId: string }) => {
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
            if (values.seed) formData.append("seed", String(values.seed));

            values.images.forEach((file) => {
                formData.append("higgsfieldImage", file);
            });

            const response = await generateVideo.mutateAsync(formData);

            if (response?.data?.historyId) {
                router.push(`/library?historyId=${response.data.historyId}`);
            }
        } catch (error: any) {
            console.error("Generation error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="section-padding max-w-3xl mx-auto">
            <div className="fixed md:hidden h-12 backdrop-blur-2xl w-full top-0 left-0 right-0 text-sm z-10">
                <Link href="/create/video-effects" className="flex items-center justify-start h-full ml-2 link-text">
                    <ChevronLeft className="size-4" />
                    <span>Video Effects</span>
                </Link>
            </div>

            <Card className="bg-transparent shadow-none border-none mt-8 md:mt-0">
                <CardHeader>
                    <CardTitle className="title-text">Generate Video with Higgsfield</CardTitle>
                    <CardDescription>Create AI-powered video from your images</CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="prompt"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Prompt</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe the video you want to generate..."
                                                className="min-h-[100px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Detailed description helps generate better results
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
                                        <FormLabel>Quality Model</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select model quality" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="lite">Lite (Faster, Lower Quality)</SelectItem>
                                                <SelectItem value="standard">Standard (Balanced)</SelectItem>
                                                <SelectItem value="turbo">Turbo (Slower, Higher Quality)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* <FormField
                                control={form.control}
                                name="seed"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Seed (Optional)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Random seed for reproducibility"
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Leave empty for random generation
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}

                            <FormField
                                control={form.control}
                                name="images"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Images (1-2 images)</FormLabel>
                                        <FormControl>
                                            <UploadImage
                                                imageAmount={2}
                                                onChange={(files) => field.onChange(files)}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Upload 1 start frame or 2 frames (start + end)
                                        </FormDescription>
                                        <FormMessage />
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
                                        Generating...
                                    </>
                                ) : (
                                    "Generate Video"
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </section>
    );
};