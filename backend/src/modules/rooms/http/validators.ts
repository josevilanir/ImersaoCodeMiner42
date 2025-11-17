import { z } from 'zod';

export const createRoomSchema = z.object({
  hostName: z.string().min(1, 'Host name is required').max(50),
});

export const joinRoomSchema = z.object({
  roomCode: z.string().length(5, 'Room code must be 5 characters'),
  displayName: z.string().min(1, 'Display name is required').max(50),
});

export const addMovieSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  year: z.number().int().min(1800).max(2100).optional(),
});