import { z } from 'zod';

/**
 * Comment Validation Schemas
 */
export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(2000, 'Comment cannot exceed 2000 characters'),
  parentComment: z.string().regex(/^[0-9a-f]{24}$/).optional(),
});

export const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(2000, 'Comment cannot exceed 2000 characters'),
});

export const reportCommentSchema = z.object({
  reason: z.string().min(10, 'Reason must be at least 10 characters').max(500),
});
