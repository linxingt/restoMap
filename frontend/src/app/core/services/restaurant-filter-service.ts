import { computed, Injectable, signal } from '@angular/core';
import { Restaurant } from '../../shared/models/restaurant';

export interface RestaurantFilter {
  name: string;
  cuisineTypes: string[];
  minPrice: number;
  maxPrice: number;
  ratings: number[];
  sortByUpdatedAt: 'DESC' | 'ASC';
}

@Injectable({
  providedIn: 'root',
})
export class RestaurantFilterService {
  rawRestaurants = signal<Restaurant[]>([]);

  filter = signal<RestaurantFilter>({
    name: '',
    cuisineTypes: [],
    minPrice: 0,
    maxPrice: 999,
    ratings: [],
    sortByUpdatedAt: 'DESC'
  });

  priceRange = computed(() => {
    const prices = this.rawRestaurants().map(r => r.pricePerPersonAvg ?? 0);
    if (prices.length === 0 || (Math.min(...prices) === 0 && Math.max(...prices) === 0)) {
      return { min: 0, max: 999 };
    }
    return { min: Math.min(...prices), max: Math.max(...prices) };
  });

  filteredRestaurants = computed(() => {
    const filter = this.filter();
    return this.rawRestaurants()
      .filter(r => {
        const matchesName = !filter.name || r.name.toLowerCase().includes(filter.name.toLowerCase());
        const matchesCuisine = filter.cuisineTypes.length === 0 || r.cuisineTypes.some(c => filter.cuisineTypes.includes(c)); //(OR)
        const price = r.pricePerPersonAvg ?? 0;
        const matchesPrice = (filter.minPrice === 0 && filter.maxPrice === 999) || (price >= filter.minPrice && price <= filter.maxPrice);
        const rating = r.ratingAvg ?? 0;
        const matchesRating = filter.ratings.length === 0 || filter.ratings.some(selected => Math.floor(rating) === selected);

        return matchesName && matchesCuisine && matchesPrice && matchesRating;
      })
      .sort((a, b) => {
        const dateA = new Date(a.updatedAt ?? 0).getTime();
        const dateB = new Date(b.updatedAt ?? 0).getTime();
        return filter.sortByUpdatedAt === 'ASC' // + ancien -> + récent
          ? dateA - dateB
          : dateB - dateA; // B>A -> B-A>0 -> + récent en haut
      });
  });

  setRestaurants(restaurants: Restaurant[]) {
    this.rawRestaurants.set(restaurants);
  }

  updateFilter(newFilter: Partial<RestaurantFilter>) {
    this.filter.update(current => ({ ...current, ...newFilter }));
  }

  resetFilter() {
    this.filter.set({
      name: '',
      cuisineTypes: [],
      minPrice: this.priceRange().min,
      maxPrice: this.priceRange().max,
      ratings: [],
      sortByUpdatedAt: 'DESC'
    });
  }
}
