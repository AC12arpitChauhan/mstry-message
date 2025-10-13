"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useDebounceCallback } from "usehooks-ts";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { apiResponse } from "@/types/apiResponse";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconBrandGoogle } from "@tabler/icons-react";
import { signIn } from "next-auth/react";
import Navbar from "@/components/Navbar";

export default function SignUpForm() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 300);

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get<apiResponse>(
            `/api/check-username-unique?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<apiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<apiResponse>("/api/sign-up", data);

      toast({
        title: "Success",
        description: response.data.message,
      });

      router.replace(`/verify/${username}`);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error during sign-up:", error);

      const axiosError = error as AxiosError<apiResponse>;
      const errorMessage =
        axiosError.response?.data.message ??
        "There was a problem with your sign-up. Please try again.";

      toast({
        title: "Sign Up Failed",
        description: errorMessage,
        variant: "destructive",
      });

      setIsSubmitting(false);
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
          Join True Feedback
        </h2>
        <p className="mt-2 max-w-sm text-sm text-neutral-400">
          Sign up to start your anonymous adventure
        </p>

        <Form {...form}>
          <form className="my-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    {...field}
                    id="username"
                    placeholder="johndoe"
                    type="text"
                    onChange={(e) => {
                      field.onChange(e);
                      debounced(e.target.value);
                    }}
                  />
                  {isCheckingUsername && (
                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Checking availability...</span>
                    </div>
                  )}
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage === "username is unique and available"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </LabelInputContainer>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    {...field}
                    id="email"
                    placeholder="you@example.com"
                    type="email"
                  />
                  <p className="text-xs text-neutral-500">
                    We will send you a verification code
                  </p>
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
                  Please wait
                </span>
              ) : (
                <>
                  Sign up &rarr;
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
                Already a member?{" "}
                <Link
                  href="/sign-in"
                  className="text-white hover:text-neutral-300 transition-colors"
                >
                  Sign in
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