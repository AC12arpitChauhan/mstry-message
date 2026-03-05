import { z } from "zod";

export const messageStatusSchema = z.object({
  status: z.enum(["read", "unread", "archived"]),
});
