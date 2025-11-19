export type RoomStatus = 'OPEN' | 'FINISHED';
export type UserRole = 'HOST' | 'GUEST';

export interface Room {
  id: string;
  code: string;
  status: RoomStatus;
  createdAt: string;
  finishedAt?: string;
  winnerMovie?: Movie;
}

export interface RoomUser {
  id: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
}

export interface Movie {
  id: string;
  title: string;
  year?: number;
  suggestedBy: {
    id: string;
    displayName: string;
    role: UserRole;
  };
  createdAt: string;
}

export interface RoomDetails {
  room: Room;
  currentUser: RoomUser;
  users: RoomUser[];
  movies: Movie[];
}

// ===================================
// RESPONSES DA API
// ===================================

export interface ApiResponse<T> {
  data: T;
  error: string | null;
}

export interface CreateRoomResponse {
  room: Room;
  hostUser: RoomUser;
  token: string;
}

export interface JoinRoomResponse {
  room: Room;
  user: RoomUser;
  token: string;
}

// ===================================
// CONTEXTOS
// ===================================

export interface AuthContextData {
  token: string | null;
  roomCode: string | null;
  userRole: UserRole | null;
  isAuthenticated: boolean;
  login: (token: string, roomCode: string, role: UserRole) => void;
  logout: () => void;
}