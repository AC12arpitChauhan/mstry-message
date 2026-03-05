export type StoryCardTheme = {
  id: string;
  name: string;
  background: string;
  border: string;
  headerIconBackground: string;
  headerIconText: string;
  headerText: string;
  messageBackground: string;
  messageBorder: string;
  messageLabel: string;
  messageText: string;
  replyBackground: string;
  replyBorder: string;
  replyLabel: string;
  replyText: string;
  footerText: string;
  footerUrlBackground: string;
  footerUrlBorder: string;
  footerUrlText: string;
};

export const storyCardThemes: StoryCardTheme[] = [
  {
    id: "theme-1-navy-cyan",
    name: "Deep Navy + Cyan",
    background: "linear-gradient(145deg, #0a0a0a 0%, #0d1117 50%, #0a0f1a 100%)",
    border: "1px solid rgba(6, 182, 212, 0.2)",
    headerIconBackground: "linear-gradient(135deg, #06b6d4, #3b82f6)",
    headerIconText: "#ffffff",
    headerText: "#9ca3af", // neutral-400
    messageBackground: "rgba(255, 255, 255, 0.03)",
    messageBorder: "1px solid rgba(255, 255, 255, 0.06)",
    messageLabel: "#737373", // neutral-500
    messageText: "#ffffff",
    replyBackground: "rgba(6, 182, 212, 0.05)",
    replyBorder: "1px solid rgba(6, 182, 212, 0.15)",
    replyLabel: "#06b6d4",
    replyText: "#e5e7eb", // neutral-200
    footerText: "#525252", // neutral-600
    footerUrlBackground: "rgba(6, 182, 212, 0.1)",
    footerUrlBorder: "1px solid rgba(6, 182, 212, 0.2)",
    footerUrlText: "#06b6d4",
  },
  {
    id: "theme-2-purple-pink",
    name: "Dark Purple + Pink",
    background: "linear-gradient(145deg, #180927 0%, #100619 50%, #0c0512 100%)",
    border: "1px solid rgba(236, 72, 153, 0.2)", // pink-500
    headerIconBackground: "linear-gradient(135deg, #ec4899, #a855f7)", // pink-500 to purple-500
    headerIconText: "#ffffff",
    headerText: "#a1a1aa", 
    messageBackground: "rgba(255, 255, 255, 0.03)",
    messageBorder: "1px solid rgba(255, 255, 255, 0.06)",
    messageLabel: "#71717a", 
    messageText: "#fdf2f8", // pink-50
    replyBackground: "rgba(236, 72, 153, 0.05)",
    replyBorder: "1px solid rgba(236, 72, 153, 0.15)",
    replyLabel: "#ec4899",
    replyText: "#fce7f3", // pink-100
    footerText: "#52525b",
    footerUrlBackground: "rgba(236, 72, 153, 0.1)",
    footerUrlBorder: "1px solid rgba(236, 72, 153, 0.2)",
    footerUrlText: "#ec4899",
  },
  {
    id: "theme-3-charcoal-electric",
    name: "Charcoal + Electric Blue",
    background: "linear-gradient(145deg, #171717 0%, #0a0a0a 50%, #000000 100%)",
    border: "1px solid rgba(59, 130, 246, 0.2)", // blue-500
    headerIconBackground: "linear-gradient(135deg, #3b82f6, #2563eb)", // blue-500 to blue-600
    headerIconText: "#ffffff",
    headerText: "#9ca3af",
    messageBackground: "rgba(0, 0, 0, 0.4)",
    messageBorder: "1px solid rgba(255, 255, 255, 0.05)",
    messageLabel: "#6b7280",
    messageText: "#f9fafb",
    replyBackground: "rgba(59, 130, 246, 0.05)",
    replyBorder: "1px solid rgba(59, 130, 246, 0.15)",
    replyLabel: "#3b82f6",
    replyText: "#eff6ff",
    footerText: "#4b5563",
    footerUrlBackground: "rgba(59, 130, 246, 0.1)",
    footerUrlBorder: "1px solid rgba(59, 130, 246, 0.2)",
    footerUrlText: "#3b82f6",
  },
  {
    id: "theme-4-teal-turquoise",
    name: "Dark Teal + Turquoise",
    background: "linear-gradient(145deg, #042f2e 0%, #022c22 50%, #064e3b 100%)", // teal-950 to emerald-950
    border: "1px solid rgba(20, 184, 166, 0.2)", // teal-500
    headerIconBackground: "linear-gradient(135deg, #14b8a6, #0d9488)", // teal-500 to teal-600
    headerIconText: "#ffffff",
    headerText: "#99f6e4", // teal-200
    messageBackground: "rgba(255, 255, 255, 0.03)",
    messageBorder: "1px solid rgba(255, 255, 255, 0.06)",
    messageLabel: "#5eead4", // teal-300
    messageText: "#f0fdfa", // teal-50
    replyBackground: "rgba(20, 184, 166, 0.05)",
    replyBorder: "1px solid rgba(20, 184, 166, 0.15)",
    replyLabel: "#14b8a6", // teal-500
    replyText: "#ccfbf1", // teal-100
    footerText: "#0d9488", // teal-600
    footerUrlBackground: "rgba(20, 184, 166, 0.1)",
    footerUrlBorder: "1px solid rgba(20, 184, 166, 0.2)",
    footerUrlText: "#14b8a6",
  },
  {
    id: "theme-5-black-neon",
    name: "Black + Neon Gradient",
    background: "#000000",
    border: "1px solid rgba(139, 92, 246, 0.3)", // violet-500
    headerIconBackground: "linear-gradient(135deg, #8b5cf6, #d946ef)", // violet to fuchsia
    headerIconText: "#ffffff",
    headerText: "#a1a1aa",
    messageBackground: "rgba(255, 255, 255, 0.02)",
    messageBorder: "1px solid rgba(255, 255, 255, 0.05)",
    messageLabel: "#71717a",
    messageText: "#ffffff",
    replyBackground: "rgba(139, 92, 246, 0.05)",
    replyBorder: "1px solid rgba(139, 92, 246, 0.2)",
    replyLabel: "#a78bfa", // violet-400
    replyText: "#ffffff",
    footerText: "#52525b",
    footerUrlBackground: "rgba(217, 70, 239, 0.1)", // fuchsia-500
    footerUrlBorder: "1px solid rgba(217, 70, 239, 0.2)",
    footerUrlText: "#e879f9", // fuchsia-400
  }
];

export function getRandomTheme(): StoryCardTheme {
  const randomIndex = Math.floor(Math.random() * storyCardThemes.length);
  return storyCardThemes[randomIndex];
}
