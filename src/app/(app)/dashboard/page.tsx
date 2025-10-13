"use client";

import { MessageCard } from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/User";
import { apiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw, Copy, Share2, Link as LinkIcon, MessageSquare, AlertCircle } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { useToast } from "@/hooks/use-toast";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<apiResponse>('/api/accept-messages');
      const fetchedValue = response.data.isAcceptingMessages;
      setValue('acceptMessages', fetchedValue);
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to fetch message settings',
        variant: 'destructive',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<apiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: "Refreshed Messages",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<apiResponse>;
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message ?? "Failed to fetch messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages, toast]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session, setValue, toast, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    const currentValue = watch('acceptMessages');
    const newValue = !currentValue;

    try {
      setValue('acceptMessages', newValue);

      const response = await axios.post<apiResponse>('/api/accept-messages', {
        acceptMessages: newValue,
      });

      toast({
        title: response.data.message,
        variant: 'default',
      });
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to update message settings',
        variant: 'destructive',
      });
    }
  };

  if (!session || !session.user) {
    return <div></div>;
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL Copied!",
      description: "Profile URL has been copied to clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Dashboard
          </h1>
          <p className="text-neutral-400 text-lg">
            Manage your anonymous messages and profile settings
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <Card className="border-neutral-800 bg-gradient-to-br from-cyan-500/10 to-blue-500/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-400 mb-1">Total Messages</p>
                  <p className="text-3xl font-bold text-white">{messages.length}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-cyan-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-neutral-800 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-400 mb-1">Profile Status</p>
                  <p className="text-3xl font-bold text-white">
                    {acceptMessages ? "Active" : "Inactive"}
                  </p>
                </div>
                <div className={`h-12 w-12 rounded-full ${acceptMessages ? 'bg-green-500/20' : 'bg-red-500/20'} flex items-center justify-center`}>
                  <AlertCircle className={`h-6 w-6 ${acceptMessages ? 'text-green-400' : 'text-red-400'}`} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-neutral-800 bg-gradient-to-br from-orange-500/10 to-yellow-500/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-400 mb-1">Profile Views</p>
                  <p className="text-3xl font-bold text-white">--</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <Share2 className="h-6 w-6 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Share Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="border-neutral-800 bg-neutral-950/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-cyan-400" />
                <h2 className="text-xl font-semibold text-white">Share Your Profile</h2>
              </div>
              <p className="text-sm text-neutral-400 mt-2">
                Share this link to receive anonymous messages
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={profileUrl}
                    disabled
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white pr-24 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded text-xs text-cyan-400">
                    @{username}
                  </div>
                </div>
                <Button
                  onClick={copyToClipboard}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Link
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Settings Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <Card className="border-neutral-800 bg-neutral-950/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Accept Messages
                  </h3>
                  <p className="text-sm text-neutral-400">
                    Allow others to send you anonymous messages
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {isSwitchLoading && <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />}
                  <div className="flex items-center gap-3">
                    <Switch
                      {...register("acceptMessages")}
                      checked={acceptMessages}
                      onCheckedChange={handleSwitchChange}
                      disabled={isSwitchLoading}
                      className="data-[state=checked]:bg-cyan-500"
                    />
                    <span className={`text-sm font-medium ${acceptMessages ? 'text-cyan-400' : 'text-neutral-500'}`}>
                      {acceptMessages ? "On" : "Off"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Messages Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Your Messages</h2>
              <p className="text-neutral-400 text-sm mt-1">
                {messages.length} {messages.length === 1 ? 'message' : 'messages'} received
              </p>
            </div>
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                fetchMessages(true);
              }}
              disabled={isLoading}
              className="border-neutral-800 bg-neutral-900 text-white hover:bg-neutral-800"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
              <span className="ml-2 hidden sm:inline">Refresh</span>
            </Button>
          </div>

          {messages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {messages.map((message, index) => (
                <motion.div
                  key={message._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <MessageCard
                    message={message}
                    onMessageDelete={handleDeleteMessage}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="border-neutral-800 bg-neutral-950/50 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="h-16 w-16 rounded-full bg-neutral-900 flex items-center justify-center mb-4">
                    <MessageSquare className="h-8 w-8 text-neutral-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No messages yet
                  </h3>
                  <p className="text-neutral-400 max-w-sm">
                    Share your profile link to start receiving anonymous messages from your friends and followers.
                  </p>
                  <Button
                    onClick={copyToClipboard}
                    className="mt-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Profile Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default UserDashboard;