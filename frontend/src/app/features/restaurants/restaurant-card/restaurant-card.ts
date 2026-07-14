import { Component, inject, input, output } from '@angular/core';
import { Restaurant } from '../../../shared/models/restaurant';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { PostalCodePipe } from '../../../shared/pipes/postal-code-pipe';
import { Router } from '@angular/router';
@Component({
  selector: 'app-restaurant-card',
  imports: [DatePipe, PostalCodePipe],
  templateUrl: './restaurant-card.html',
})
export class RestaurantCard {
  restaurant = input.required<Restaurant>()

  private router = inject(Router);

  goToRestaurant() {
    this.router.navigate([
      '/restaurants',
      this.restaurant().slug
    ]);
  }
}
