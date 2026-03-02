import { z } from 'zod';

export const createBookmarkSchema = z.object({
  url: z.string().url('Invalid URL format'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  folderId: z.string().min(1, 'Folder is required'),
  tags: z.array(z.string()).default([]),
});

export const updateBookmarkSchema = z.object({
  url: z.string().url('Invalid URL format').optional(),
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  folderId: z.string().min(1, 'Folder is required').optional(),
  tags: z.array(z.string()).optional(),
});

export const createFolderSchema = z.object({
  name: z.string().min(1, 'Folder name is required'),
  icon: z.string().optional(),
});

export type CreateBookmarkInput = z.infer<typeof createBookmarkSchema>;
export type UpdateBookmarkInput = z.infer<typeof updateBookmarkSchema>;
export type CreateFolderInput = z.infer<typeof createFolderSchema>;