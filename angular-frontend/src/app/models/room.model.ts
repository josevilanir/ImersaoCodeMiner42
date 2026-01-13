export interface User {
  id: string;
  username: string;
  displayName: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  data: {
    user: User;
    token: string;
  };
  error: string | null;
}

export interface Room {
  id: string;
  code: string;
  status: 'OPEN' | 'FINISHED';
  createdAt: string;
  finishedAt?: string;
  hostId?: string;
  winnerMovieId?: string;
}

export interface RoomUser {
  id: string;
  displayName: string;
  role: 'HOST' | 'GUEST';
}

export interface Movie {
  id: string;
  title: string;
  year?: number;
  suggestedBy: {
    id: string;
    displayName: string;
  };
}

export interface RoomDetails {
  room: Room & {
    winnerMovie?: Movie;
  };
  users: RoomUser[];
  movies: Movie[];
  currentUser: RoomUser;
}

export interface CreateRoomRequest {
  hostName: string;
}

export interface JoinRoomRequest {
  roomCode: string;
  displayName: string;
}

export interface AddMovieRequest {
  title: string;
  year?: number;
}