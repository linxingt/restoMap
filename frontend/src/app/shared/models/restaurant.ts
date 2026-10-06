import { User } from "./user";
import { Comment } from "./comment";

export interface Restaurant {
    id?: string;
    name: string;
    slug?: string;
    latitudeEtlongitude?: [number, number] | null;
    address: string;
    photos?: string[];
    cuisineTypes: string[];
    pricePerPersonAvg?: number;
    ratingAvg?: number;
    approved?: boolean;
    updatedAt?: Date;
    lastCommentAt?: Date;
    visitorsCount?: number;
    favoritesCount?: number;
    isGoodRatio?: number;
    isFavorite?: boolean;
    isVisited?: boolean;
    comments?: Comment[];
}