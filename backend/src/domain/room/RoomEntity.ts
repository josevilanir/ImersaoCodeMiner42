import { RoomStatus } from '@prisma/client';

export interface RoomEntity {
  id: string;
  code: string;
  status: RoomStatus;
  hostId: string;
  createdAt: Date;
  finishedAt: Date | null;
  winnerMovieId: string | null;
}