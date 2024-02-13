import {Complaint} from "./types"

export const complaintsByVoteMsgId: Map<number, Complaint> = new Map()

export function startTracking(complaint: Complaint): void {
    complaintsByVoteMsgId.set(complaint.voteMsgId, complaint)
    console.log(`Tracking ${complaint.banCandidate} for ${complaint.offendingMsgId} Votes: ${complaint.votesBy.size}`)
}

export function track(messageId: number, userId: number): void {
    const complaint = complaintsByVoteMsgId.get(messageId)
    if (!complaint) {
        console.warn(`No complaint found for messageId: ${messageId}`)
        return
    }
    complaint.votesBy.add(userId)
    console.log(`Vote for ${complaint.banCandidate} by ${userId} Votes: ${complaint.votesBy.size}`)
}
