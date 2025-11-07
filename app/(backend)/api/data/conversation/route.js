import wrapAsync from "@/utils/wrapAsync.util";
import {
    getConversation,
    setConversation
} from '@/controllers/data.controllers';

export const POST = wrapAsync(setConversation)
export const GET = wrapAsync(getConversation)