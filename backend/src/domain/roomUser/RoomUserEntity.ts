import { UserRole } from '@prisma/client';

export interface RoomUserEntity {
  id: string;
  roomId: string;
  displayName: string;
  role: UserRole;
  createdAt: Date;
}