export interface Comment {
  id?: string;
  authorName: string;
  rating: number; 
  isGood: boolean;
  content?: string;
  pricePerPerson?: number;
  createdAt?: Date;
}