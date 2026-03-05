"use client";

import { MessageCard } from "@/components/MessageCard";
import { IMessage } from "@/model/Message";
import { apiResponse } from "@/types/apiResponse";
import axios, { AxiosError } from "axios";
import {
  Loader2,
  RefreshCcw,
  Inbox as InboxIcon,
  Mail,
  MailOpen,
  Archive,
  Search,
} from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type FilterTab = "all" | "unread" | "replied" | "archived";

const filterTabs: { key: FilterTab; label: string; icon: React.ReactNode }[] = [
  { key: "all", label: "All", icon: <InboxIcon className="h-4 w-4" /> },
  { key: "unread", label: "Unread", icon: <Mail className="h-4 w-4" /> },
  { key: "replied", label: "Replied", icon: <MailOpen className="h-4 w-4" /> },
  { key: "archived", label: "Archived", icon: <Archive className="h-4 w-4" /> },
];

export default function InboxPage() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();
  const { data: session } = useSession();

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((message) => message._id !== messageId));
  };

  const handleMessageUpdate = (updatedMessage: IMessage) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg._id === updatedMessage._id ? updatedMessage : msg
      )
    );
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await axios.patch(`/api/messages/${messageId}/status`, {
        status: "read",
      });
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? ({ ...msg, status: "read" } as IMessage) : msg
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // Silently fail
    }
  };

  const fetchMessages = useCallback(
    async (refresh: boolean = false, cursor?: string, searchOverride?: string) => {
      if (!cursor) setIsLoading(true);
      else setIsLoadingMore(true);

      try {
        const params = new URLSearchParams();
        params.set("filter", activeFilter);
        params.set("limit", "5");
        if (cursor) params.set("cursor", cursor);
        const currentSearch = searchOverride !== undefined ? searchOverride : debouncedSearch;
        if (currentSearch) params.set("search", currentSearch);

        const response = await axios.get<apiResponse & { searchMode?: boolean }>(
          `/api/messages?${params.toString()}`
        );

        const newMessages = response.data.messages || [];
        const newCursor = response.data.nextCursor || null;
        const searchMode = response.data.searchMode || false;
        
        console.log("Frontend: Fetch success", { resultCount: newMessages.length, nextCursor: newCursor, searchMode });

        setIsSearchMode(searchMode);

        if (cursor && !searchMode) {
          setMessages((prev) => [...prev, ...newMessages]);
        } else {
          setMessages(newMessages);
        }

        setNextCursor(newCursor);
        setHasMore(!searchMode && !!newCursor);
        console.log("Frontend: State updated", { hasMore: !searchMode && !!newCursor });

        if (refresh) {
          toast({ title: "Refreshed", description: "Showing latest messages" });
        }
      } catch (error) {
        const axiosError = error as AxiosError<apiResponse>;
        toast({
          title: "Error",
          description: axiosError.response?.data.message ?? "Failed to fetch messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [activeFilter, debouncedSearch, toast]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
  }, [session, fetchMessages]);

  useEffect(() => {
    if (!session || !session.user) return;
    setMessages([]);
    setNextCursor(null);
    setHasMore(true);
    fetchMessages(false, undefined, debouncedSearch);
  }, [debouncedSearch]);

  useEffect(() => {
    if (!session || !session.user) return;
    setMessages([]);
    setNextCursor(null);
    setHasMore(true);
    fetchMessages();
  }, [activeFilter]);

  // Infinite scroll observer
  useEffect(() => {
    console.log("Frontend: Observer Effect", { hasMore, isLoadingMore, isLoading, nextCursor });
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          console.log("Frontend: Element Intersecting", { hasMore, isLoadingMore, isLoading, nextCursor });
          if (hasMore && !isLoadingMore && !isLoading && nextCursor) {
            console.log("Frontend: Triggering fetchMore", { nextCursor });
            fetchMessages(false, nextCursor);
          }
        }
      },
      { threshold: 0.1 }
    );
    if (loadMoreRef.current) observerRef.current.observe(loadMoreRef.current);
    return () => { if (observerRef.current) observerRef.current.disconnect(); };
  }, [hasMore, isLoadingMore, isLoading, nextCursor, fetchMessages]);

  if (!session || !session.user) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 italic tracking-tighter">
          Inbox
        </h1>
        <p className="text-neutral-400 text-lg">
          Manage and reply to your anonymous messages
        </p>
      </motion.div>

      {/* Search UI */}
      <div className="relative group max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500 group-hover:text-cyan-400 transition-colors" />
        <input
          type="text"
          placeholder="Search in your inbox..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full bg-neutral-900/50 border border-neutral-800 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all backdrop-blur-sm"
        />
      </div>

      {/* Filter Tabs + Refresh */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-neutral-900 rounded-xl p-1 border border-neutral-800">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeFilter === tab.key
                  ? "bg-neutral-800 text-white shadow-lg"
                  : "text-neutral-400 hover:text-neutral-300"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        
        <Button
          variant="outline"
          onClick={() => fetchMessages(true)}
          disabled={isLoading}
          className="w-full sm:w-auto border-neutral-800 bg-neutral-900/50 text-white hover:bg-neutral-800 rounded-xl h-11"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCcw className="h-4 w-4 mr-2" />}
          Refresh
        </Button>
      </div>

      {/* Messages Feed */}
      <div className="space-y-4">
        {isLoading && messages.length === 0 ? (
          <div className="space-y-4 pt-10">
             {[1,2,3].map(i => (
               <div key={i} className="h-32 bg-neutral-900/50 rounded-2xl animate-pulse" />
             ))}
          </div>
        ) : messages.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {messages.map((message, index) => (
              <motion.div
                key={message._id as string}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <MessageCard
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                  onMessageUpdate={handleMessageUpdate}
                  onMarkAsRead={handleMarkAsRead}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="border-neutral-800 bg-neutral-950/50 border-dashed border-2 p-20 text-center">
            <InboxIcon className="h-12 w-12 text-neutral-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No messages found</h3>
            <p className="text-neutral-500 max-w-xs mx-auto">
              {searchInput ? "No messages matching your search." : "Your inbox is currently empty. Check back later!"}
            </p>
          </Card>
        )}

        {/* Load More Marker */}
        <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
          {isLoadingMore && <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />}
        </div>
      </div>
    </div>
  );
}
