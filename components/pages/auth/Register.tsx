'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Separator } from '@/components/ui/separator';
import {
  useCompleteRegistration,
  useRequestOtp,
  useVerifyOtp,
} from '@/hooks/useAuth';
import {
  EmailFormValues,
  emailSchema,
  OtpFormValues,
  otpSchema,
  RegisterDetailsFormValues,
  registerDetailsSchema,
} from '@/lib/validation';

export const Register = () => {
  const router = useRouter();
  const t = useTranslations('Auth.Register');
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  // Mutations for each step
  const requestOtpMutation = useRequestOtp();
  const verifyOtpMutation = useVerifyOtp();
  const completeRegistrationMutation = useCompleteRegistration();

  // Forms with proper default values to prevent uncontrolled input error
  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });
  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });
  const detailsForm = useForm<RegisterDetailsFormValues>({
    resolver: zodResolver(registerDetailsSchema),
    defaultValues: {
      fullname: '',
      username: '',
      password: '',
    },
  });

  const handleStep1 = (values: EmailFormValues) => {
    setError('');
    requestOtpMutation.mutate(values, {
      onSuccess: () => {
        setEmail(values.email);
        setStep(2);
      },
      onError: (err: any) =>
        setError(err.response?.data?.message || 'Failed to send OTP.'),
    });
  };

  const handleStep2 = (values: OtpFormValues) => {
    setError('');
    verifyOtpMutation.mutate(
      { email, otp: values.otp },
      {
        onSuccess: () => setStep(3),
        onError: (err: any) =>
          setError(err.response?.data?.message || 'Invalid OTP.'),
      },
    );
  };

  const handleStep3 = (values: RegisterDetailsFormValues) => {
    setError('');
    completeRegistrationMutation.mutate(
      { ...values, email },
      {
        onSuccess: () => {
          // On success, redirect to login or directly to the app
          router.push('/');
          router.refresh();
        },
        onError: (error: any) => setError(error),
      },
    );
  };

  return (
    <div className="w-full max-w-sm z-20">
      <Link
        href="/"
        className="flex items-center gap-2 w-full max-w-sm mb-2 link-text text-sm"
      >
        <ChevronLeft className="size-4" />
        {t('BackToHomePage')}
      </Link>
      <div className="relative overflow-hidden w-full space-y-4 border p-6 rounded-xl theme">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ x: 0, opacity: 1 }}
              exit={{ x: -600, opacity: 1 }}
              className="w-full"
            >
              <Form {...emailForm}>
                <form
                  onSubmit={emailForm.handleSubmit(handleStep1)}
                  className="space-y-6"
                >
                  <h1 className="title-text">
                    {t('Title')} - {t('Steps.1')}
                  </h1>
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Email')}</FormLabel>
                        <FormControl>
                          <Input placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={requestOtpMutation.isPending}
                    className="w-full btn-login"
                  >
                    {requestOtpMutation.isPending
                      ? t('Button.Sending')
                      : t('Button.SendOTP')}
                  </Button>
                </form>
              </Form>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ x: 0, opacity: 1 }}
              exit={{ x: -600, opacity: 1 }}
              className="w-full"
            >
              <Form {...otpForm}>
                <form
                  onSubmit={otpForm.handleSubmit(handleStep2)}
                  className="space-y-6"
                >
                  <h1 className="title-text">
                    {t('Title')} - {t('Steps.2')}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {t('EnterOTP')} {email}
                  </p>
                  <FormField
                    control={otpForm.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem className="w-full flex-between flex-column">
                        <FormLabel>{t('OTP')}</FormLabel>
                        <FormControl>
                          <InputOTP maxLength={6} {...field}>
                            <InputOTPGroup>
                              {[...Array(6)].map((_, i) => (
                                <InputOTPSlot key={i} index={i} />
                              ))}
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={verifyOtpMutation.isPending}
                    className="w-full btn-login"
                  >
                    {verifyOtpMutation.isPending
                      ? t('Button.Verifying')
                      : t('Button.Verify')}
                  </Button>
                </form>
              </Form>
            </motion.div>
          )}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ x: 0, opacity: 1 }}
              exit={{ x: -600, opacity: 1 }}
              className="w-full"
            >
              <Form {...detailsForm}>
                <form
                  onSubmit={detailsForm.handleSubmit(handleStep3)}
                  className="space-y-4"
                >
                  <h1 className="title-text">
                    {t('Title')} - {t('Steps.3')}
                  </h1>
                  <FormField
                    control={detailsForm.control}
                    name="fullname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Fullname')}</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={detailsForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Username')}</FormLabel>
                        <FormControl>
                          <Input placeholder="johndoe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={detailsForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('Password')}</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={completeRegistrationMutation.isPending}
                    className="w-full btn-login"
                  >
                    {completeRegistrationMutation.isPending
                      ? t('Button.Sending')
                      : t('Button.Send')}
                  </Button>
                </form>
              </Form>
            </motion.div>
          )}
        </AnimatePresence>
        {error && (
          <p className="text-center text-red-500 text-sm pt-4">{error}</p>
        )}
        <Separator orientation="horizontal" className="bg-secondary my-4" />
        <div className="flex justify-between items-center">
          <Link className="link-text text-sm" href="/login/">
            {t('Login')}
          </Link>
        </div>
      </div>
    </div>
  );
};
