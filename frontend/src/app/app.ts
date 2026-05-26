import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Restaurant } from './shared/models/restaurant';
import { RestaurantCard } from './features/home/restaurant-card/restaurant-card';
import { RestaurantDetail } from './features/restaurants/restaurant-detail/restaurant-detail';
import { Map } from './features/home/map/map';
import { Navbar } from './layout/navbar/navbar'; 
@Component({
  selector: 'app-root',
  imports: [RestaurantCard, RestaurantDetail,Map,RouterOutlet, RouterLink,Navbar],
  templateUrl: './app.html'
})
export class App {

  selectedRestaurant = signal<Restaurant | null>(null);

  onCardClick(resto: Restaurant) {
    console.log("Clic détecté !")
    this.selectedRestaurant.set(resto);
  }

  backToList() {
    this.selectedRestaurant.set(null);
  }
}
