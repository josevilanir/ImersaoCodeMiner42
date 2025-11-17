export interface MovieEntity {
  id: string;
  roomId: string;
  suggestedById: string;
  title: string;
  year: number | null;
  createdAt: Date;
}