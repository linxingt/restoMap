import { User } from "./user";

export interface Restaurant {
    _id?: string;
    name: string;
    latitudeEtlongitude: [number, number];
    cuisineTypes: string[];
    address: string;
    link?: string;
    pricePerPersonAvg?: number;
    ratingAvg?: number;
    approved?: boolean;
    photos?: string[];
    visitors?: User[];
    updatedAt?: Date;
}