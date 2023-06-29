import { VoteType } from "@prisma/client"


export type CachedPost = {
  id: string,
  title: string,
  authorName: string,
  content: string,
  currentVote: VoteType | null,
  createdAt: Date
}