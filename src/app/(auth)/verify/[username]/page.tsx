'use client';
import { useToast } from '@/hooks/use-toast';
import { verifySchema } from '@/schemas/verifySchema';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import * as z from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiResponse } from '@/types/apiResponse';
import axios, { AxiosError } from 'axios';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const VerifyAccount = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<apiResponse>(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      toast({
        title: 'Success',
        description: response.data.message,
      });

      router.replace('/sign-in');
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>;
      toast({
        title: 'Verification Failed',
        description:
          axiosError.response?.data.message ??
          'An error occurred. Please try again.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="shadow-input mx-auto w-full max-w-md rounded-2xl border border-neutral-800 bg-black p-4 md:p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600">
            <CheckCircle2 className="h-6 w-6 text-white" />
          </div>
        </div>
        
        <h2 className="text-center text-2xl font-bold text-white">
          Verify Your Account
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-400">
          Enter the verification code sent to your email
        </p>
        
        {params.username && (
          <div className="mt-4 text-center">
            <p className="text-xs text-neutral-500">
              Verifying account for:{" "}
              <span className="text-neutral-300 font-medium">{params.username}</span>
            </p>
          </div>
        )}

        <Form {...form}>
          <form className="my-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <LabelInputContainer className="mb-8">
                  <Label htmlFor="code">Verification Code</Label>
                  <Input
                    {...field}
                    id="code"
                    placeholder="123456"
                    type="text"
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                  />
                  <p className="text-xs text-neutral-500 mt-2">
                    Check your email for the 6-digit code
                  </p>
                  <FormMessage />
                </LabelInputContainer>
              )}
            />

            <button
              className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying...
                </span>
              ) : (
                <>
                  Verify Account &rarr;
                  <BottomGradient />
                </>
              )}
            </button>

            <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-700 to-transparent" />

            <div className="text-center space-y-2">
              <p className="text-sm text-neutral-400">
                Didn't receive the code?{" "}
                <button 
                  type="button"
                  className="text-white hover:text-neutral-300 transition-colors underline"
                  onClick={() => {
                    toast({
                      title: "Code Resent",
                      description: "A new verification code has been sent to your email.",
                    });
                  }}
                >
                  Resend
                </button>
              </p>
              <p className="text-sm text-neutral-400">
                <Link
                  href="/sign-in"
                  className="text-white hover:text-neutral-300 transition-colors"
                >
                  Back to Sign In
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

export default VerifyAccount;