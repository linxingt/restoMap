import { Cuisine } from "./cuisine.model";

export interface Restaurant {
    id?: string;
    name: string;
    address: string;
    city: string;
    postalCode: string;
    cuisines: Cuisine[];
    priceRange: [number, number];
    description: string;
    photos: [string];
    rating?: number;
    reviews?: string[];
    validatedBy: string;
    updatedAt: Date;
    createdAt?: Date;
}