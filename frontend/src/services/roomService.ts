import { api } from './api';
import type { Room, RoomUser, Movie } from '../@types';

// ===================================
// INTERFACES
// ===================================

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

// ===================================
// SERVIÇO
// ===================================

export const roomService = {
  // Criar sala
  async createRoom(hostName: string): Promise<CreateRoomResponse> {
    console.log('📞 roomService.createRoom chamado:', { hostName });
    
    try {
      const response = await api.post<CreateRoomResponse>('/rooms', { hostName });
      console.log('✅ roomService.createRoom resposta:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ roomService.createRoom erro:', error);
      throw error;
    }
  },

  // Entrar na sala
  async joinRoom(
    roomCode: string,
    displayName: string
  ): Promise<JoinRoomResponse> {
    console.log('📞 roomService.joinRoom chamado:', { roomCode, displayName });
    
    try {
      const payload = { roomCode, displayName };
      console.log('📦 Payload:', payload);
      
      const response = await api.post<JoinRoomResponse>('/rooms/join', payload);
      
      console.log('✅ roomService.joinRoom resposta:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ roomService.joinRoom erro:', error);
      throw error;
    }
  },

  // Buscar sala
  async getRoom(code: string): Promise<GetRoomResponse> {
    const response = await api.get<GetRoomResponse>(`/rooms/${code}`);
    return response.data;
  },

  // Adicionar filme
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

  // Finalizar sala
  async finishRoom(code: string): Promise<FinishRoomResponse> {
    const response = await api.post<FinishRoomResponse>(`/rooms/${code}/finish`);
    return response.data;
  },
};