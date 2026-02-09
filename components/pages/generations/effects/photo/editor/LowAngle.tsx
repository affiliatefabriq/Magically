'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { UploadImage } from '@/components/shared/create/UploadImage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useGenerateNanoImage } from '@/hooks/useNano';
import { LowAnglePrompt } from '@/lib/utils';
import { formSchema, FormValues } from '@/lib/validation';

export const LowAngle = () => {
  const t = useTranslations('Pages.Effects.PhotoGenerate');
  const router = useRouter();
  const generateNano = useGenerateNanoImage();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: LowAnglePrompt,
      aspect_ratio: '1:1',
      images: [],
      publish: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('prompt', values.prompt);
      formData.append('aspect_ratio', values.aspect_ratio);
      formData.append('publish', String(values.publish));

      if (values.images && values.images.length > 0) {
        values.images.forEach((file) => {
          formData.append('nanoImage', file);
        });
      }

      const response = await generateNano.mutateAsync(formData);
      if (response?.data?.historyId) {
        router.push(`/library`);
      }
    } catch (error: any) {
      console.error(error);
      <div className="text-red-500">{error}</div>;
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto">
      <div className="fixed md:hidden h-12 backdrop-blur-2xl w-full top-0 left-0 right-0 text-sm z-10">
        <Link
          href="/create/photo-effects"
          className="flex items-center justify-start h-full ml-4 link-text"
        >
          <ChevronLeft className="size-4" />
          <span>{t('PhotoEffects')}</span>
        </Link>
      </div>
      <Card className="bg-transparent shadow-none border-none mt-8 md:mt-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 title-text">
            {t('LowAngle')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('ReferenceImage')}</FormLabel>
                    <FormControl>
                      <UploadImage
                        imageAmount={1}
                        onChange={(files) => field.onChange(files)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="aspect_ratio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Aspect.title')}</FormLabel>
                    <ToggleGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      type="single"
                      className="flex flex-wrap items-center justify-center gap-2"
                    >
                      <ToggleGroupItem
                        value="1:1"
                        aria-label="Toggle bold"
                        className="size-28 border"
                      >
                        <div className="flex items-center justify-center text-xs">
                          {t('Aspect.1:1')}
                        </div>
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="16:9"
                        aria-label="Toggle italic"
                        className="size-28 border"
                      >
                        <div className="flex items-center justify-center text-xs">
                          {t('Aspect.16:9')}
                        </div>
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="9:16"
                        aria-label="Toggle strikethrough"
                        className="size-28 border"
                      >
                        <div className="flex items-center justify-center text-xs">
                          {t('Aspect.9:16')}
                        </div>
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="4:3"
                        aria-label="Toggle strikethrough"
                        className="size-28 border"
                      >
                        <div className="flex items-center justify-center text-xs">
                          {t('Aspect.4:3')}
                        </div>
                      </ToggleGroupItem>
                    </ToggleGroup>
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
                      <FormLabel>{t('Publish.title')}</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        {t('Publish.description')}
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full btn-solid"
                disabled={loading || generateNano.isPending}
              >
                {loading || generateNano.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('Generate.action')}
                  </>
                ) : (
                  t('Generate.title')
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
};
