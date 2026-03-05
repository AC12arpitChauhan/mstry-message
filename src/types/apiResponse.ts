import { IMessage } from "@/model/Message";

export interface apiResponse{
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages?: Array<IMessage>;
    nextCursor?: string | null;
}