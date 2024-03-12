import {Complaint} from "./types"
import {ReactionContext, Context} from "grammy";

const ban_threshold = 3

export const complaintsByVoteMsgId: Map<number, Complaint> = new Map()

export function startTracking(complaint: Complaint): void {
    complaintsByVoteMsgId.set(complaint.voteMsgId, complaint)
    console.log(`Tracking ${complaint.banCandidate} for ${complaint.offendingMsgId} Votes: ${complaint.votesBy.size}`)
}

export async function track(ctx: ReactionContext<Context>, messageId: number, userId: number): Promise<void> {
    const complaint = complaintsByVoteMsgId.get(messageId)
    if (!complaint) {
        console.warn(`No complaint found for messageId: ${messageId}`)
        return
    }
    complaint.votesBy.add(userId)
    console.log(`Vote for ${complaint.banCandidate} by ${userId} Votes: ${complaint.votesBy.size}`)
    if (complaint.votesBy.size >= ban_threshold) {
        console.log(`Banning ${complaint.banCandidate} for ${complaint.offendingMsgId}`)
        await ctx.banChatMember(complaint.banCandidate).catch(console.error)
        complaintsByVoteMsgId.delete(messageId)
    }
}
