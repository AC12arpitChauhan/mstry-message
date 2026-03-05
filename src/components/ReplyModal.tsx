"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import { IMessage } from "@/model/Message";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiResponse } from "@/types/apiResponse";
import { Loader2, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ReplyModalProps = {
  message: IMessage;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReplied: (updatedMessage: IMessage) => void;
};

export function ReplyModal({
  message,
  open,
  onOpenChange,
  onReplied,
}: ReplyModalProps) {
  const [reply, setReply] = useState(message.reply || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!reply.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `/api/messages/${message._id}/reply`,
        { reply: reply.trim() }
      );

      toast({ title: "Reply saved!" });
      onReplied(response.data.data as IMessage);
      onOpenChange(false);
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to save reply",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-neutral-950 border-neutral-800">
        <DialogHeader>
          <DialogTitle className="text-white">Reply to Message</DialogTitle>
          <DialogDescription className="text-neutral-400">
            Your reply will be visible to you and can be shared as a story card.
          </DialogDescription>
        </DialogHeader>

        {/* Original message */}
        <div className="rounded-lg bg-neutral-900 border border-neutral-800 p-4 mt-2">
          <p className="text-xs text-neutral-500 mb-2">Anonymous message</p>
          <p className="text-neutral-200 text-sm leading-relaxed">
            {message.content}
          </p>
        </div>

        {/* Reply input */}
        <div className="mt-4">
          <Textarea
            placeholder="Write your reply..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            className="min-h-[100px] bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-cyan-500 resize-none"
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-neutral-500">
              {reply.length}/500 characters
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-neutral-800 text-neutral-300 hover:bg-neutral-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !reply.trim()}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Reply
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
