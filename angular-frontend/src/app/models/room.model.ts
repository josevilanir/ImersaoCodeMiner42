export interface Room {
  id: string;
  code: string;
  status: 'OPEN' | 'FINISHED';
  createdAt: string;
  finishedAt?: string;
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
  room: Room;
  users: Array<{
    id: string;
    displayName: string;
    role: string;
  }>;
  movies: Movie[];
}
