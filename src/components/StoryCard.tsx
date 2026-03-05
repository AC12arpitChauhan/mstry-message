"use client";

import { forwardRef } from "react";
import { StoryCardTheme, storyCardThemes } from "@/config/storyCardThemes";

type StoryCardProps = {
  messageContent: string;
  replyContent: string;
  username: string;
  profileUrl: string;
  theme?: StoryCardTheme;
};

export const StoryCard = forwardRef<HTMLDivElement, StoryCardProps>(
  function StoryCardInner({ messageContent, replyContent, username, profileUrl, theme }, ref) {
    const activeTheme = theme || storyCardThemes[0]; // fallback to first theme
    
    return (
      <div
        ref={ref}
        className="w-[440px] p-8 rounded-2xl"
        style={{
          background: activeTheme.background,
          border: activeTheme.border,
          fontFamily: "'Inter', 'Segoe UI', sans-serif",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div
            className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ 
              background: activeTheme.headerIconBackground, 
              color: activeTheme.headerIconText 
            }}
          >
            TF
          </div>
          <span 
            className="text-sm font-medium" 
            style={{ color: activeTheme.headerText }}
          >
            True Feedback
          </span>
        </div>

        {/* Anonymous Message */}
        <div
          className="rounded-xl p-5 mb-4"
          style={{
            background: activeTheme.messageBackground,
            border: activeTheme.messageBorder,
          }}
        >
          <p 
            className="text-xs font-medium mb-2 uppercase tracking-wider"
            style={{ color: activeTheme.messageLabel }}
          >
            Anonymous Message
          </p>
          <p 
            className="text-base leading-relaxed"
            style={{ color: activeTheme.messageText }}
          >
            {messageContent}
          </p>
        </div>

        {/* Reply */}
        <div
          className="rounded-xl p-5 mb-6"
          style={{
            background: activeTheme.replyBackground,
            border: activeTheme.replyBorder,
          }}
        >
          <p
            className="text-xs font-medium mb-2 uppercase tracking-wider"
            style={{ color: activeTheme.replyLabel }}
          >
            @{username}&apos;s Reply
          </p>
          <p 
            className="text-base leading-relaxed"
            style={{ color: activeTheme.replyText }}
          >
            {replyContent}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <p 
            className="text-xs"
            style={{ color: activeTheme.footerText }}
          >
            Send me anonymous messages
          </p>
          <div
            className="px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              background: activeTheme.footerUrlBackground,
              border: activeTheme.footerUrlBorder,
              color: activeTheme.footerUrlText,
            }}
          >
            {profileUrl.replace(/^https?:\/\//, "")}
          </div>
        </div>
      </div>
    );
  }
);
