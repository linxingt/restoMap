export interface Comment {
  id?: number;
  restaurant: string;
  user: string;
  rating: number; // 1 à 5
  isGood: boolean;
  content?: string;
  pricePerPerson?: number;
  createdAt?: Date;
}