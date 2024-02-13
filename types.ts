export type Complaint = {
    offendingMsgId: number
    banCandidate: number
    voteMsgId: number
    votesBy: Set<number>
}
