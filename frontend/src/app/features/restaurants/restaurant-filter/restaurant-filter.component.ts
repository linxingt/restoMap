import { Component, computed, effect, EventEmitter, inject, Output, signal, input, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideEye, LucideEyeOff, LucideRotateCcw } from '@lucide/angular';
import { RestaurantFilter, RestaurantFilterService } from '../../../core/services/restaurant-filter-service';

@Component({
  selector: 'app-restaurant-filter',
  imports: [LucideEye, LucideEyeOff, FormsModule, LucideRotateCcw],
  templateUrl: './restaurant-filter.component.html',
  styleUrl: './restaurant-filter.component.scss',
})

export class RestaurantFilterComponent {
  filterService = inject(RestaurantFilterService);

  cuisineOptions = computed(() => {
    const defaultData = this.filterService.rawRestaurants();
    const types = defaultData.flatMap(resto => resto.cuisineTypes || []);
    return [...new Set(types)];
  });
  cuisineSearch = signal('');
  filteredCuisineOptions = computed(() => {
    const search = this.cuisineSearch().toLowerCase();
    return this.cuisineOptions().filter(c => c.toLowerCase().includes(search));
  });

  filter = this.filterService.filter;
  minPrice = computed(() => this.filterService.priceRange().min);
  maxPrice = computed(() => this.filterService.priceRange().max);

  showMoreFilters = signal(false);


  constructor() {
    effect(() => {
      const parentMin = this.minPrice();
      const parentMax = this.maxPrice();

      // isole la mise à jour pour éviter de figer le signal local lors de la saisie
      untracked(() => {
        this.filter.update(current => ({
          ...current,
          minPrice: parentMin,
          maxPrice: parentMax
        }));
      });
    });
  }

  resetFilters() {
    this.filterService.resetFilter();
    this.cuisineSearch.set('');
  }

  toggleCuisine(cuisine: string) {
    const current = this.filter().cuisineTypes;
    const updated = current.includes(cuisine)
      ? current.filter(c => c !== cuisine)
      : [...current, cuisine];

    this.filterService.updateFilter({
      cuisineTypes: updated
    });
  }

  toggleRating(rating: number) {
    const current = this.filter().ratings;
    const updated = current.includes(rating)
      ? current.filter(r => r !== rating)
      : [...current, rating];

    this.filterService.updateFilter({
      ratings: updated
    });
  }

  updateSort(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target && target.value)
      this.filterService.updateFilter(target.value === 'ASC' ? { sortByUpdatedAt: 'ASC' } : { sortByUpdatedAt: 'DESC' });
  }

  updateSearch(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target && target.value !== undefined)
      this.filterService.updateFilter({ name: target.value });
  }

  // Calcule la position en % du curseur
  getMinPercent(): number {
    const range = this.maxPrice() - this.minPrice();
    if (range === 0) return 0;
    return ((this.filter().minPrice - this.minPrice()) / range) * 100;
  }

  getMaxPercent(): number {
    const range = this.maxPrice() - this.minPrice();
    if (range === 0) return 100;
    return ((this.filter().maxPrice - this.minPrice()) / range) * 100;
  }

  // Sécurité : Empêche le Min de croiser ou dépasser le Max
  onMinPriceInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let newMin = parseInt(inputElement.value, 10);
    const currentMax = this.filter().maxPrice;
    if (newMin > currentMax) {
      newMin = currentMax;
      inputElement.value = newMin.toString();
    }
    this.filterService.updateFilter({ minPrice: newMin });

    console.log("min actuel :", newMin);
  }

  onMaxPriceInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let newMax = parseInt(inputElement.value, 10);
    const currentMin = this.filter().minPrice;

    if (newMax <= currentMin) {
      newMax = currentMin;
      inputElement.value = newMax.toString();
    }
    this.filterService.updateFilter({ maxPrice: newMax });

    console.log("max actuel :", newMax);
  }
}
