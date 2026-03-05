"use client";

import { useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import dayjs from "dayjs";
import { toPng } from "html-to-image";
import {
  X,
  Archive,
  RotateCcw,
  Circle,
  Reply,
  Download,
  Share2,
} from "lucide-react";
import { IMessage } from "@/model/Message";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiResponse } from "@/types/apiResponse";
import { ReplyModal } from "./ReplyModal";
import { StoryCard } from "./StoryCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect } from "react";
import { StoryCardTheme, getRandomTheme } from "@/config/storyCardThemes";

type MessageCardProps = {
  message: IMessage;
  onMessageDelete: (messageId: string) => void;
  onArchive?: (messageId: string) => void;
  onRestore?: (messageId: string) => void;
  onMarkAsRead?: (messageId: string) => void;
  onMessageUpdate?: (updatedMessage: IMessage) => void;
  showArchiveAction?: boolean;
  username?: string;
  profileUrl?: string;
};

export function MessageCard({
  message,
  onMessageDelete,
  onArchive,
  onRestore,
  onMarkAsRead,
  onMessageUpdate,
  showArchiveAction = true,
  username = "",
  profileUrl = "",
}: MessageCardProps) {
  const { toast } = useToast();
  const hasMarkedRead = useRef(false);
  const storyCardRef = useRef<HTMLDivElement>(null);
  const [replyOpen, setReplyOpen] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState<StoryCardTheme | undefined>();

  // Mark as read when the card becomes visible
  useEffect(() => {
    if (message.status === "unread" && onMarkAsRead && !hasMarkedRead.current) {
      hasMarkedRead.current = true;
      const timer = setTimeout(() => {
        onMarkAsRead(message._id);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [message.status, message._id, onMarkAsRead]);

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<apiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast({ title: response.data.message });
      onMessageDelete(message._id);
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to delete message",
        variant: "destructive",
      });
    }
  };

  const handleReplied = (updatedMessage: IMessage) => {
    if (onMessageUpdate) {
      onMessageUpdate(updatedMessage);
    }
  };

  const handleDownloadCard = async () => {
    if (!storyCardRef.current) return;
    try {
      const dataUrl = await toPng(storyCardRef.current, {
        pixelRatio: 2,
        backgroundColor: "#0a0a0a",
      });
      const link = document.createElement("a");
      link.download = `true-feedback-reply-${message._id}.png`;
      link.href = dataUrl;
      link.click();
      toast({ title: "Story card downloaded!" });
    } catch {
      toast({
        title: "Error",
        description: "Failed to generate image",
        variant: "destructive",
      });
    }
  };

  const handleShareCard = async () => {
    if (!storyCardRef.current) return;
    try {
      const dataUrl = await toPng(storyCardRef.current, {
        pixelRatio: 2,
        backgroundColor: "#0a0a0a",
      });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "true-feedback-story.png", {
        type: "image/png",
      });

      if (navigator.share) {
        await navigator.share({
          title: "My True Feedback Reply",
          text: `Send me anonymous messages at ${profileUrl}`,
          files: [file],
        });
      } else {
        // Fallback: download
        handleDownloadCard();
      }
    } catch {
      // User cancelled share or error
    }
  };

  const isUnread = message.status === "unread";
  const isReplied = message.status === "replied";

  return (
    <>
      <Card
        className={`border-neutral-800 bg-neutral-950/50 backdrop-blur-sm transition-all duration-200 hover:border-neutral-700 ${
          isUnread ? "border-l-2 border-l-cyan-500" : ""
        }`}
      >
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            {/* Status indicator */}
            <div className="mt-1.5 flex-shrink-0">
              {isUnread ? (
                <Circle className="h-2.5 w-2.5 fill-cyan-400 text-cyan-400" />
              ) : isReplied ? (
                <Circle className="h-2.5 w-2.5 fill-green-400 text-green-400" />
              ) : (
                <Circle className="h-2.5 w-2.5 text-neutral-700" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm leading-relaxed ${
                  isUnread ? "text-white font-medium" : "text-neutral-300"
                }`}
              >
                {message.content}
              </p>

              {/* Reply preview */}
              {message.reply && (
                <div className="mt-3 pl-3 border-l-2 border-cyan-500/30">
                  <p className="text-xs text-neutral-500 mb-1">Your reply</p>
                  <p className="text-sm text-neutral-400">{message.reply}</p>
                </div>
              )}

              <div className="flex items-center gap-3 mt-3">
                <span className="text-xs text-neutral-500">
                  {dayjs(message.createdAt).format("MMM D, YYYY h:mm A")}
                </span>
                {isUnread && (
                  <span className="text-xs text-cyan-400 font-medium">New</span>
                )}
                {isReplied && (
                  <span className="text-xs text-green-400 font-medium">
                    Replied
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Reply button */}
              {!message.reply && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyOpen(true)}
                  className="h-8 w-8 p-0 text-neutral-500 hover:text-cyan-400 hover:bg-neutral-800"
                  title="Reply"
                >
                  <Reply className="h-4 w-4" />
                </Button>
              )}

              {/* Share story card button (only for replied messages) */}
              {message.reply && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setActiveTheme(getRandomTheme());
                    setStoryOpen(true);
                  }}
                  className="h-8 w-8 p-0 text-neutral-500 hover:text-cyan-400 hover:bg-neutral-800"
                  title="Share as story card"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              )}

              {/* Archive or Restore */}
              {showArchiveAction && onArchive ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onArchive(message._id)}
                  className="h-8 w-8 p-0 text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800"
                  title="Archive"
                >
                  <Archive className="h-4 w-4" />
                </Button>
              ) : onRestore ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRestore(message._id)}
                  className="h-8 w-8 p-0 text-neutral-500 hover:text-cyan-400 hover:bg-neutral-800"
                  title="Restore"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              ) : null}

              {/* Delete */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-neutral-500 hover:text-red-400 hover:bg-neutral-800"
                    title="Delete"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      this message.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteConfirm}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reply Modal */}
      <ReplyModal
        message={message}
        open={replyOpen}
        onOpenChange={setReplyOpen}
        onReplied={handleReplied}
      />

      {/* Story Card Modal */}
      <Dialog open={storyOpen} onOpenChange={setStoryOpen}>
        <DialogContent className="sm:max-w-xl bg-neutral-950 border-neutral-800">
          <DialogHeader>
            <DialogTitle className="text-white">
              Share Your Reply
            </DialogTitle>
          </DialogHeader>

          <div className="flex justify-center py-4 overflow-auto">
            <StoryCard
              ref={storyCardRef}
              messageContent={message.content}
              replyContent={message.reply || ""}
              username={username}
              profileUrl={profileUrl}
              theme={activeTheme}
            />
          </div>

          <div className="flex justify-center gap-3">
            <Button
              onClick={handleDownloadCard}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Card
            </Button>
            <Button
              onClick={handleShareCard}
              variant="outline"
              className="border-neutral-700 text-white hover:bg-neutral-800"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
