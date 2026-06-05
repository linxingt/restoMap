import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Restaurant } from './shared/models/restaurant';
import { Navbar } from './layout/navbar/navbar'; 
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Navbar],
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
