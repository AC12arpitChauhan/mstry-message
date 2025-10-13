'use client';

import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, Send, Sparkles, MessageSquare, ArrowRight, User } from 'lucide-react';
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
import { cn } from '@/lib/utils';

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

// Initial placeholder suggestions
const initialSuggestions = [
  "What's a hobby you've recently started?",
  "If you could have dinner with any historical figure, who would it be?",
  "What's a simple thing that makes you happy?"
];

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const [suggestions, setSuggestions] = useState<string[]>(initialSuggestions);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message.trim());
  };

  const [isLoading, setIsLoading] = useState(false);

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

      // Read the stream as text
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

      // Parse the complete response
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
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 mb-6">
            <User className="h-4 w-4 text-cyan-400" />
            <span className="text-sm text-cyan-400">Anonymous Message</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Send a message to
          </h1>
          <div className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            @{username}
          </div>
          <p className="text-neutral-400 mt-4 text-lg">
            Your identity will remain completely anonymous
          </p>
        </motion.div>

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
                          <MessageSquare className="h-5 w-5 text-cyan-400" />
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
                    className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium transition-all duration-300"
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
                            <h4 className="text-cyan-400 text-sm font-semibold mb-2">
                              Question {index + 1}
                            </h4>
                            <p className="text-neutral-200 leading-relaxed mb-4">{message}</p>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleMessageClick(message)}
                          size="sm"
                          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
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
                  <p className="text-neutral-400">Click "Generate New" to get AI suggestions</p>
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
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 mb-4">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Want Your Own Message Board?
              </h3>
              <p className="text-neutral-400 mb-6 max-w-md mx-auto">
                Create your account and start receiving anonymous messages from your friends, followers, and fans.
              </p>
              <Link href="/sign-up">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium px-8 h-12">
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