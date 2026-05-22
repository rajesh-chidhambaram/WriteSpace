import { z } from 'zod';

/**
 * Blog Validation Schemas
 */
export const createBlogSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title cannot exceed 200 characters'),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  markdown: z.string().optional(),
  category: z.string().regex(/^[0-9a-f]{24}$/, 'Invalid category ID'),
  tags: z
    .array(z.string().regex(/^[0-9a-f]{24}$/, 'Invalid tag ID'))
    .optional()
    .default([]),
  status: z.enum(['draft', 'published']).default('draft'),
  metaTitle: z.string().max(160).optional(),
  metaDescription: z.string().max(160).optional(),
  metaKeywords: z.array(z.string()).optional(),
  commentsEnabled: z.boolean().default(true),
  featuredImage: z.string().url('Invalid image URL').optional(),
});

export const updateBlogSchema = createBlogSchema.partial();

export const publishBlogSchema = z.object({
  status: z.enum(['published', 'archived']),
});

export const searchBlogSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  category: z.string().optional(),
  tags: z.string().optional(),
  sort: z.enum(['latest', 'popular', 'trending']).default('latest'),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});
