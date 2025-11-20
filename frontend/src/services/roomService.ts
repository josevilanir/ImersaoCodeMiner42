import { api } from './api';
import type { Room, RoomUser, Movie, UserRole } from '../@types';

// Interfaces
export interface CreateRoomData {
  room: Room;
  hostUser: RoomUser;
  token: string;
}

export interface CreateRoomResponse {
  data: CreateRoomData;
  error: string | null;
}

export interface JoinRoomData {
  room: Room;
  user: RoomUser;
  token: string;
}

export interface JoinRoomResponse {
  data: JoinRoomData;
  error: string | null;
}

export interface RoomDetails {
  room: Room & {
    winnerMovie?: Movie & {
      suggestedBy: RoomUser;
    };
  };
  users: RoomUser[];
  movies: (Movie & {
    suggestedBy: RoomUser;
  })[];
  currentUser: RoomUser;
}

export interface GetRoomResponse {
  data: RoomDetails;
  error: string | null;
}

export interface AddMovieData {
  movie: Movie;
}

export interface AddMovieResponse {
  data: AddMovieData;
  error: string | null;
}

export interface FinishRoomData {
  room: Room;
}

export interface FinishRoomResponse {
  data: FinishRoomData;
  error: string | null;
}

export interface DeleteMovieResponse {
  data: { message: string };
  error: string | null;
}

export interface TransferOwnershipData {
  message: string;
  newHostToken: string;
  oldHostToken: string;
}

export interface TransferOwnershipResponse {
  data: TransferOwnershipData;
  error: string | null;
}

export interface RefreshTokenData {
  token: string;
  role: UserRole;
}

export interface RefreshTokenResponse {
  data: RefreshTokenData;
  error: string | null;
}

export const roomService = {
  async createRoom(hostName: string): Promise<CreateRoomResponse> {
    const response = await api.post<CreateRoomResponse>('/rooms', { hostName });
    return response.data;
  },

  async joinRoom(
    roomCode: string,
    displayName: string
  ): Promise<JoinRoomResponse> {
    const response = await api.post<JoinRoomResponse>('/rooms/join', {
      roomCode,
      displayName,
    });
    return response.data;
  },

  async getRoom(code: string): Promise<GetRoomResponse> {
    const response = await api.get<GetRoomResponse>(`/rooms/${code}`);
    return response.data;
  },

  async addMovie(
    code: string,
    title: string,
    year?: number
  ): Promise<AddMovieResponse> {
    const response = await api.post<AddMovieResponse>(
      `/rooms/${code}/movies`,
      { title, year }
    );
    return response.data;
  },

  async deleteMovie(code: string, movieId: string): Promise<DeleteMovieResponse> {
    const response = await api.delete<DeleteMovieResponse>(
      `/rooms/${code}/movies/${movieId}`
    );
    return response.data;
  },

  async transferOwnership(code: string, newHostId: string): Promise<TransferOwnershipResponse> {
    const response = await api.post<TransferOwnershipResponse>(
      `/rooms/${code}/transfer`,
      { newHostId }
    );
    return response.data;
  },

  async refreshToken(): Promise<RefreshTokenResponse> {
    const response = await api.post<RefreshTokenResponse>('/refresh-token');
    return response.data;
  },

  async finishRoom(code: string): Promise<FinishRoomResponse> {
    const response = await api.post<FinishRoomResponse>(`/rooms/${code}/finish`);
    return response.data;
  },
};