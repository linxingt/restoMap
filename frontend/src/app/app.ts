import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RestaurantDetail } from './features/restaurants/restaurant-detail/restaurant-detail';

@Component({
  selector: 'app-root',
  imports: [RestaurantDetail],
  template: `<app-restaurant-detail />`,
})
export class App {
  
}
