export interface Comment {
  id?: string;
  restaurant: string;
  user: string;
  rating: number; // 1 à 5
  isGood: boolean;
  content?: string;
  pricePerPerson?: number;
  createdAt?: Date;
}