export interface Review {
  id?: string;
  restaurantId: string;
  userId: string;
  rating: number; // 1 à 5
  comment?: string;
  createdAt?: Date;
}