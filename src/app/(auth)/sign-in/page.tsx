"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signIn } from "next-auth/react";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signInSchema";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { IconBrandGoogle } from "@tabler/icons-react";
import Navbar from "@/components/Navbar";

export default function SignInForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        toast({
          title: "Login Failed",
          description: "Incorrect username or password",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
      setIsSubmitting(false);
    }

    if (result?.url) {
      router.replace("/dashboard");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast({
        title: "Error",
        description: "Failed to sign in with Google",
        variant: "destructive",
      });
    }
  };

  return (
    
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <Navbar/>
      <div className="shadow-input mx-auto w-full max-w-md rounded-2xl border border-neutral-800 bg-black p-4 md:p-8">
        <h2 className="text-2xl font-bold text-white">
          Welcome Back to True Feedback
        </h2>
        <p className="mt-2 max-w-sm text-sm text-neutral-400">
          Sign in to continue your secret conversations
        </p>

        <Form {...form}>
          <form className="my-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="identifier">Email/Username</Label>
                  <Input
                    {...field}
                    id="identifier"
                    placeholder="you@example.com or username"
                    type="text"
                  />
                  <FormMessage />
                </LabelInputContainer>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <LabelInputContainer className="mb-8">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    {...field}
                    id="password"
                    placeholder="••••••••"
                    type="password"
                  />
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
                  Signing in...
                </span>
              ) : (
                <>
                  Sign in &rarr;
                  <BottomGradient />
                </>
              )}
            </button>

            <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-700 to-transparent" />

            <button
              className="group/btn shadow-input relative flex h-10 w-full items-center justify-center space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626] dark:text-neutral-300"
              type="button"
              onClick={handleGoogleSignIn}
            >
              <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                Continue with Google
              </span>
              <BottomGradient />
            </button>

            <div className="mt-8 text-center">
              <p className="text-sm text-neutral-400">
                Not a member yet?{" "}
                <Link
                  href="/sign-up"
                  className="text-white hover:text-neutral-300 transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

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