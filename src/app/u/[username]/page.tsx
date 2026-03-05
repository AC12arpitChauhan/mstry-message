'use client';

import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, Send, Sparkles, MessageSquare, ArrowRight, User, Pin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import * as z from 'zod';
import { apiResponse } from '@/types/apiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';
import { motion } from 'motion/react';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  if (!messageString || messageString.trim() === '') {
    return [];
  }
  return messageString
    .split(specialChar)
    .map(msg => msg.trim())
    .filter(msg => msg.length > 0);
};

const initialSuggestions = [
  "What's a hobby you've recently started?",
  "If you could have dinner with any historical figure, who would it be?",
  "What's a simple thing that makes you happy?"
];

interface ProfileData {
  username: string;
  bio: string | null;
  profilePicture: string | null;
  themeColor: string;
  isAcceptingMessage: boolean;
  pinnedMessages: Array<{
    _id: string;
    content: string;
    reply: string;
    createdAt: string;
  }>;
}

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const [suggestions, setSuggestions] = useState<string[]>(initialSuggestions);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message.trim());
  };

  const [isLoading, setIsLoading] = useState(false);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `/api/get-public-profile?username=${username}`
        );
        setProfileData(response.data.data);
      } catch {
        // Profile fetch failed — use defaults
      } finally {
        setIsProfileLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  // Track profile view
  useEffect(() => {
    axios.post('/api/track-view', { username }).catch(() => {});
  }, [username]);

  const themeColor = profileData?.themeColor || '#06b6d4';

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<apiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast({
        title: response.data.message,
        variant: 'default',
      });
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true);
    setSuggestions([]);
    
    try {
      const response = await fetch('/api/suggest-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          fullText += chunk;
        }
      }

      const parsedSuggestions = parseStringMessages(fullText);
      setSuggestions(parsedSuggestions);
      
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate suggestions. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSuggestLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Hero Section with Profile Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          {/* Profile Picture */}
          {!isProfileLoading && profileData?.profilePicture && (
            <div className="mb-6">
              <div
                className="h-20 w-20 mx-auto rounded-full border-2 overflow-hidden"
                style={{ borderColor: themeColor }}
              >
                <img
                  src={profileData.profilePicture}
                  alt={`${username}'s avatar`}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}

          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6"
            style={{
              backgroundColor: `${themeColor}10`,
              borderColor: `${themeColor}33`,
            }}
          >
            <User className="h-4 w-4" style={{ color: themeColor }} />
            <span className="text-sm" style={{ color: themeColor }}>
              Anonymous Message
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Send a message to
          </h1>
          <div
            className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(to right, ${themeColor}, #3b82f6)`,
            }}
          >
            @{username}
          </div>

          {/* Bio */}
          {profileData?.bio && (
            <p className="text-neutral-400 mt-4 text-lg max-w-md mx-auto">
              {profileData.bio}
            </p>
          )}

          {!profileData?.bio && (
            <p className="text-neutral-400 mt-4 text-lg">
              Your identity will remain completely anonymous
            </p>
          )}
        </motion.div>

        {/* Pinned Messages */}
        {profileData?.pinnedMessages && profileData.pinnedMessages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Pin className="h-4 w-4" style={{ color: themeColor }} />
              <h2 className="text-lg font-semibold text-white">
                Pinned Replies
              </h2>
            </div>
            <div className="space-y-3">
              {profileData.pinnedMessages.map((msg) => (
                <Card
                  key={msg._id}
                  className="border-neutral-800 bg-neutral-950/50 backdrop-blur-sm"
                >
                  <CardContent className="p-5">
                    <div className="rounded-lg bg-neutral-900/50 p-3 mb-3">
                      <p className="text-xs text-neutral-500 mb-1">
                        Anonymous message
                      </p>
                      <p className="text-neutral-300 text-sm">
                        {msg.content}
                      </p>
                    </div>
                    <div
                      className="pl-3 border-l-2"
                      style={{ borderColor: `${themeColor}50` }}
                    >
                      <p
                        className="text-xs font-medium mb-1"
                        style={{ color: themeColor }}
                      >
                        @{username}&apos;s reply
                      </p>
                      <p className="text-neutral-200 text-sm">
                        {msg.reply}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Message Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-neutral-800 bg-neutral-950/50 backdrop-blur-sm">
            <CardContent className="p-6 md:p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-lg flex items-center gap-2">
                          <MessageSquare className="h-5 w-5" style={{ color: themeColor }} />
                          Your Anonymous Message
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write something thoughtful, funny, or interesting..."
                            className="resize-none min-h-[150px] bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-cyan-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !messageContent}
                    className="w-full h-12 text-white font-medium transition-all duration-300"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${themeColor}, #3b82f6)`,
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8"
        >
          <Card className="border-neutral-800 bg-neutral-950/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-400" />
                  Gemini-Powered AI Suggestions
                </h3>
                <Button
                  onClick={fetchSuggestedMessages}
                  disabled={isSuggestLoading}
                  variant="outline"
                  className="border-neutral-700 bg-neutral-900 text-white hover:bg-neutral-800"
                  size="sm"
                >
                  {isSuggestLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating, takes less than 10 seconds...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate New
                    </>
                  )}
                </Button>
              </div>
              <p className="text-sm text-neutral-400 mt-2">
                Click on any suggestion to use it as your message
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {isSuggestLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-cyan-400" />
                  <p className="text-neutral-400 mt-4">Generating creative questions under 10 seconds...</p>
                </div>
              ) : suggestions.length > 0 ? (
                <>
                  {suggestions.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="border border-neutral-800 rounded-xl bg-neutral-900/60 hover:border-cyan-500/40 transition-all duration-300 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold mb-2" style={{ color: themeColor }}>
                              Question {index + 1}
                            </h4>
                            <p className="text-neutral-200 leading-relaxed mb-4">{message}</p>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleMessageClick(message)}
                          size="sm"
                          className="text-white"
                          style={{
                            backgroundImage: `linear-gradient(to right, ${themeColor}, #3b82f6)`,
                          }}
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Use This Question
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-neutral-400">Click &quot;Generate New&quot; to get AI suggestions</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12"
        >
          <Card className="border-neutral-800 bg-gradient-to-br from-neutral-950 to-neutral-900 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                style={{
                  backgroundImage: `linear-gradient(to bottom right, ${themeColor}, #3b82f6)`,
                }}
              >
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Want Your Own Message Board?
              </h3>
              <p className="text-neutral-400 mb-6 max-w-md mx-auto">
                Create your account and start receiving anonymous messages from your friends, followers, and fans.
              </p>
              <Link href="/sign-up">
                <Button
                  className="text-white font-medium px-8 h-12"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${themeColor}, #3b82f6)`,
                  }}
                >
                  Create Your Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}