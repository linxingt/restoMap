import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { Restaurant } from '../../../shared/models/restaurant';
import { RestaurantFilterComponent } from '../restaurant-filter/restaurant-filter.component';
import { RestaurantMapComponent } from '../restaurant-map/restaurant-map.component';
import { RestaurantCard } from '../restaurant-card/restaurant-card';
import { RestaurantFilterParams, RestaurantService } from '../../../core/services/restaurant-service';
import { RestaurantFilterService } from '../../../core/services/restaurant-filter-service';

@Component({
  selector: 'app-restaurant-list',
  imports: [RestaurantFilterComponent, RestaurantMapComponent, RestaurantCard],
  templateUrl: './restaurant-list.component.html',
})

export class RestaurantListComponent implements OnInit{
  private restaurantService = inject(RestaurantService);
  public filterService = inject(RestaurantFilterService);

  restaurants = signal<Restaurant[]>([]);
  availableCuisines = signal<string[]>([]);
  currentPage = signal(0);
  totalPages = signal(1);
  isLoading = signal(false);
  hoveredRestaurantId = signal<string | null>(null);

  private currentFilters: RestaurantFilterParams = {};

 constructor() {
  effect(() => {
      this.currentFilters = this.filterService.filter();
      this.loadRestaurants(0);
    });
  }

  ngOnInit(): void {
    this.loadCuisines();
  }

  private loadCuisines(): void {
    this.restaurantService.getAllCuisineTypes().subscribe({
      next: (cuisines) => this.availableCuisines.set(cuisines),
      error: () => this.availableCuisines.set([])
    });
  }

  loadRestaurants(page = 0): void {
    this.isLoading.set(true);
    this.currentPage.set(page);

    this.restaurantService.getApprovedRestaurants({
      ...this.currentFilters,
      page,
      size: 10,
    }).subscribe({
      next: (res) => {
        this.restaurants.set(res.content);
        this.totalPages.set(res.totalPages);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages()) {
      this.loadRestaurants(page);
    }
  }

}
