import { Component, computed, inject, signal, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideEye, LucideEyeOff, LucideRotateCcw } from '@lucide/angular';
import { RestaurantFilterService } from '../../../core/services/restaurant-filter-service';

@Component({
  selector: 'app-restaurant-filter',
  imports: [LucideEye, LucideEyeOff, FormsModule, LucideRotateCcw],
  templateUrl: './restaurant-filter.component.html',
})

export class RestaurantFilterComponent {
  filterService = inject(RestaurantFilterService);

  cuisineOptions = input<string[]>([]);
  cuisineSearch = signal('');

  filter = this.filterService.filter;
  minPriceBounds = signal(0);
  maxPriceBounds = signal(999);

  showMoreFilters = signal(false);

  filteredCuisineOptions = computed(() => {
    const search = this.cuisineSearch().toLowerCase();
    return this.cuisineOptions().filter(c => c.toLowerCase().includes(search));
  });

  resetFilters() {
    this.filterService.resetFilter();
    this.cuisineSearch.set('');
  }

  toggleCuisine(cuisine: string): void {
    const current = this.filter().cuisineTypes;
    const updated = current!.includes(cuisine)
      ? current!.filter(c => c !== cuisine)
      : [...current!, cuisine];

    this.filterService.updateFilter({
      cuisineTypes: updated
    });
  }

  toggleRating(rating: number) {
    const current = this.filter().ratings;
    const updated = current!.includes(rating)
      ? current!.filter(r => r !== rating)
      : [...current!, rating];

    this.filterService.updateFilter({
      ratings: updated
    });
  }

  updateSort(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target?.value) {
      this.filterService.updateFilter({
        sortByUpdatedAt: target.value === 'ASC' ? 'ASC' : 'DESC'
      });
    }
  }

  updateSearch(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target && target.value !== undefined)
      this.filterService.updateFilter({ name: target.value });
  }

  getMinPercent(): number {
    const range = this.maxPriceBounds() - this.minPriceBounds();
    if (range === 0) return 0;
    const currentMin = this.filter().minPrice ?? this.minPriceBounds();
    return ((currentMin - this.minPriceBounds()) / range) * 100;
  }

  getMaxPercent(): number {
    const range = this.maxPriceBounds() - this.minPriceBounds();
    if (range === 0) return 100;
    const currentMax = this.filter().maxPrice ?? this.maxPriceBounds();
    return ((currentMax - this.minPriceBounds()) / range) * 100;
  }

  // Empêche le Min de croiser ou dépasser le Max
  onMinPriceInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let newMin = parseInt(inputElement.value, 10);
    const currentMax = this.filter().maxPrice ?? this.maxPriceBounds();
    if (newMin > currentMax!) {
      newMin = currentMax!;
      inputElement.value = newMin.toString();
    }
    this.filterService.updateFilter({ minPrice: newMin });
  }

  onMaxPriceInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let newMax = parseInt(inputElement.value, 10);
    const currentMin = this.filter().minPrice ?? this.minPriceBounds();
    if (newMax <= currentMin!) {
      newMax = currentMin!;
      inputElement.value = newMax.toString();
    }
    this.filterService.updateFilter({ maxPrice: newMax });
  }
}
