import { Component, input, output } from '@angular/core';
import { Restaurant } from '../../../shared/models/restaurant';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { PostalCodePipe } from '../../../shared/pipes/postal-code-pipe';
@Component({
  selector: 'app-restaurant-card',
  imports: [DatePipe, PostalCodePipe],
  templateUrl: './restaurant-card.html',
  styleUrl: './restaurant-card.scss',
})
export class RestaurantCard {
  restaurant = input.required<Restaurant>()
  cardClick = output<Restaurant>(); 

  onCardClick() {
    this.cardClick.emit(this.restaurant());
  }
}
