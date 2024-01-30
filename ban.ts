import {Complaint} from "./types"

export const complaintsByVoteMsgId: Map<number, Complaint> = new Map()

export function startTracking(complaint: Complaint): void {
    complaintsByVoteMsgId.set(complaint.voteMsgId, complaint)
}
