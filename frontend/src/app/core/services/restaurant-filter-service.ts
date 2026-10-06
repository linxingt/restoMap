import { Injectable, signal } from '@angular/core';
import { Restaurant } from '../../shared/models/restaurant';

export interface RestaurantFilter {
  name?: string;
  cuisineTypes?: string[];
  minPrice?: number;
  maxPrice?: number;
  ratings?: number[];
  sortByUpdatedAt?: 'DESC' | 'ASC';
}

const INITIAL_STATE: RestaurantFilter = {
  name: '',
  cuisineTypes: [],
  ratings: [],
  minPrice: undefined,
  maxPrice: undefined,
  sortByUpdatedAt: 'DESC'
};

@Injectable({
  providedIn: 'root',
})
export class RestaurantFilterService {
  rawRestaurants = signal<Restaurant[]>([]);

  filter = signal<RestaurantFilter>({...INITIAL_STATE});

  updateFilter(newFilter: Partial<RestaurantFilter>) {
    this.filter.update(current => ({ ...current, ...newFilter }));
  }

  resetFilter() : void {
    this.filter.set({ ...INITIAL_STATE });
  }
}
