import { prisma } from '../../config/database';
import { MovieEntity } from './MovieEntity';

export class MovieRepository {
  async create(data: {
    roomId: string;
    suggestedById: string;
    title: string;
    year?: number;
  }): Promise<MovieEntity> {
    return await prisma.movie.create({
      data: {
        roomId: data.roomId,
        suggestedById: data.suggestedById,
        title: data.title,
        year: data.year || null,
      },
    });
  }

  async findAllByRoomId(roomId: string) {
    return await prisma.movie.findMany({
      where: { roomId },
      include: {
        suggestedBy: true,
      },
    });
  }

  async countByRoomId(roomId: string): Promise<number> {
    return await prisma.movie.count({
      where: { roomId },
    });
  }

  async findById(movieId: string) {
    return await prisma.movie.findUnique({
      where: { id: movieId },
      include: {
        suggestedBy: true,
        room: true,
      },
    });
  }

  async delete(movieId: string): Promise<void> {
    await prisma.movie.delete({
      where: { id: movieId },
    });
  }
}