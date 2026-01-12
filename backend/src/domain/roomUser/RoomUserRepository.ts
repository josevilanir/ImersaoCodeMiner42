import { prisma } from '../../config/database';
import { UserRole } from '@prisma/client';
import { RoomUserEntity } from './RoomUserEntity';

export class RoomUserRepository {
  async create(data: {
    roomId: string;
    displayName: string;
    role: UserRole;
  }): Promise<RoomUserEntity> {
    return await prisma.roomUser.create({
      data,
    });
  }

  async findById(id: string) {
    return await prisma.roomUser.findUnique({
      where: { id },
    });
  }

  async updateRole(userId: string, newRole: UserRole) {
    return await prisma.roomUser.update({
      where: { id: userId },
      data: { role: newRole },
    });
  }

  async findByUsername(username: string) {
    return await prisma.roomUser.findUnique({
      where: { username }
    });
  }
  
}