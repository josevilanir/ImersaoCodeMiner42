import { Request, Response } from 'express';
import { RoomRepository } from '../../../domain/room/RoomRepository';
import { RoomUserRepository } from '../../../domain/roomUser/RoomUserRepository';
import { MovieRepository } from '../../../domain/movie/MovieRepository';
import { RoomService } from '../../../domain/room/RoomService';
import { MovieService } from '../../../domain/movie/MovieService';
import { CreateRoomUseCase } from '../useCases/CreateRoomUseCase';
import { JoinRoomUseCase } from '../useCases/JoinRoomUseCase';
import { GetRoomUseCase } from '../useCases/GetRoomUseCase';
import { AddMovieUseCase } from '../useCases/AddMovieUseCase';
import { FinishRoomUseCase } from '../useCases/FinishRoomUseCase';
import { DeleteMovieUseCase } from '../useCases/DeleteMovieUseCase';
import { createRoomSchema, joinRoomSchema, addMovieSchema } from './validators';

export class RoomsController {
  async createRoom(req: Request, res: Response) {
    const validatedData = createRoomSchema.parse(req.body);

    const roomRepository = new RoomRepository();
    const roomUserRepository = new RoomUserRepository();
    const roomService = new RoomService(roomRepository);

    const useCase = new CreateRoomUseCase(
      roomRepository,
      roomUserRepository,
      roomService
    );

    const result = await useCase.execute({
      hostName: validatedData.hostName,
    });

    return res.status(201).json({
      data: result,
      error: null,
    });
  }

  async joinRoom(req: Request, res: Response) {
    const validatedData = joinRoomSchema.parse(req.body);

    const roomRepository = new RoomRepository();
    const roomUserRepository = new RoomUserRepository();
    const roomService = new RoomService(roomRepository);

    const useCase = new JoinRoomUseCase(
      roomRepository,
      roomUserRepository,
      roomService
    );

    const result = await useCase.execute({
      roomCode: validatedData.roomCode,
      displayName: validatedData.displayName,
    });

    return res.status(200).json({
      data: result,
      error: null,
    });
  }

  async getRoom(req: Request, res: Response) {
    const { code } = req.params;
    const currentUserId = req.user!.sub;

    const roomRepository = new RoomRepository();

    const useCase = new GetRoomUseCase(roomRepository);

    const result = await useCase.execute({
      roomCode: code,
      currentUserId,
    });

    return res.status(200).json({
      data: result,
      error: null,
    });
  }

  async addMovie(req: Request, res: Response) {
    const { code } = req.params;
    const currentUserId = req.user!.sub;
    const validatedData = addMovieSchema.parse(req.body);

    const roomRepository = new RoomRepository();
    const movieRepository = new MovieRepository();
    const movieService = new MovieService(movieRepository);
    const roomService = new RoomService(roomRepository);

    const useCase = new AddMovieUseCase(
      roomRepository,
      movieRepository,
      movieService,
      roomService
    );

    const result = await useCase.execute({
      roomCode: code,
      currentUserId,
      title: validatedData.title,
      year: validatedData.year,
    });

    return res.status(201).json({
      data: result,
      error: null,
    });
  }

  async deleteMovie(req: Request, res: Response) {
    const { code, movieId } = req.params;
    const currentUserId = req.user!.sub;
    const currentUserRole = req.user!.role;

    const roomRepository = new RoomRepository();
    const movieRepository = new MovieRepository();

    const useCase = new DeleteMovieUseCase(roomRepository, movieRepository);

    await useCase.execute({
      roomCode: code,
      movieId,
      currentUserId,
      currentUserRole,
    });

    return res.status(200).json({
      data: { message: 'Movie deleted successfully' },
      error: null,
    });
  }

  async finishRoom(req: Request, res: Response) {
    const { code } = req.params;
    const hostId = req.user!.sub;

    const roomRepository = new RoomRepository();
    const movieRepository = new MovieRepository();
    const movieService = new MovieService(movieRepository);
    const roomService = new RoomService(roomRepository);

    const useCase = new FinishRoomUseCase(
      roomRepository,
      movieService,
      roomService
    );

    const result = await useCase.execute({
      roomCode: code,
      hostId,
    });

    return res.status(200).json({
      data: result,
      error: null,
    });
  }
}