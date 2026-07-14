import { Component, input } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Restaurant } from '../../../shared/models/restaurant';

@Component({
  selector: 'app-restaurant-detail',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './restaurant-detail.html',
})
export class RestaurantDetail {
  restaurant=input.required<Restaurant>()
  
}
