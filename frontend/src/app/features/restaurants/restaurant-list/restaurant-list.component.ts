import { Component, computed, inject, signal } from '@angular/core';
import { Restaurant } from '../../../shared/models/restaurant';
import { RestaurantFilterComponent } from '../restaurant-filter/restaurant-filter.component';
import { Map } from '../map/map';
import { RestaurantCard } from '../restaurant-card/restaurant-card';
import { RestaurantService } from '../../../core/services/restaurant-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { RestaurantFilterService } from '../../../core/services/restaurant-filter-service';

@Component({
  selector: 'app-restaurant-list',
  imports: [RestaurantFilterComponent, Map, RestaurantCard],
  templateUrl: './restaurant-list.component.html',
})

export class RestaurantListComponent {
  private restaurantService = inject(RestaurantService);
  // public ici pour que le HTML puisse lire "filteredRestaurants"
  public filterService = inject(RestaurantFilterService);

 constructor() {
    this.restaurantService.getApprovedRestaurants().subscribe(restos => {
      this.filterService.setRestaurants(restos);
    });
  }
}
