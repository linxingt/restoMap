import { Component } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Cuisine } from '../../../shared/models/cuisine.model';
import { Restaurant } from '../../../shared/models/restaurant.model';
import { CuisinePipe } from '../../../shared/pipes/letter-pipe';

@Component({
  selector: 'app-restaurant-detail',
  imports: [DatePipe, CurrencyPipe,CuisinePipe],
  templateUrl: './restaurant-detail.html',
  styleUrl: './restaurant-detail.scss',
})
export class RestaurantDetail {
  restaurant: Restaurant = {
    name: "Le Sichuan du 13e",
    address: "12 Rue de xxx",
    city: "Paris",
    postalCode: "75013",
    cuisines: ["SIC"],
    priceRange: [15, 30],
    description: "Authentique cuisine du Sichuan.",
    photos: ["..."],
    rating: 4.3,
    reviews: ["id1", "id2"],
    validatedBy: "adminUserId",
    updatedAt: new Date()
  }
}
