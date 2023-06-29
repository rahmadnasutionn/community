import { z } from 'zod';

export const VoteValidator = z.object({
  postId: z.string(),
  voteType: z.enum(['UP', 'DOWN'])
});

export type PostVoteRequest = z.infer<typeof VoteValidator>;

export const CommentVoteValidator = z.object({
  commentId: z.string(),
  voteType: z.enum(['UP', 'DOWN']),
});

export type CommentVoteRequest = z.infer<typeof CommentVoteValidator>;
