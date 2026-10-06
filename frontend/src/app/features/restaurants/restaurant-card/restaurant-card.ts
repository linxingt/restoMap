import { Component, inject, input, output } from '@angular/core';
import { Restaurant } from '../../../shared/models/restaurant';
import { DatePipe } from '@angular/common';
import { PostalCodePipe } from '../../../shared/pipes/postal-code-pipe';
import { Router } from '@angular/router';
import { buildGoogleSearchUrl } from '../../../shared/utils/link.utils';
import { RatingBadgeComponent } from '../../../shared/components/rating-badge/rating-badge.component';
import { CuisineTagComponent } from '../../../shared/components/cuisine-tag/cuisine-tag.component';
import { LucideMapPinCheckInside, LucideBanknoteCheck   } from '@lucide/angular';
@Component({
  selector: 'app-restaurant-card',
  imports: [DatePipe, LucideMapPinCheckInside, LucideBanknoteCheck , PostalCodePipe, RatingBadgeComponent, CuisineTagComponent],
  templateUrl: './restaurant-card.html',
})
export class RestaurantCard {
  restaurant = input.required<Restaurant>()
  hover = output<string | null>();

  private router = inject(Router);

  googleSearchUrl(): string {
    return buildGoogleSearchUrl(this.restaurant().name, this.restaurant().address);
  }

  goToRestaurant() {
    this.router.navigate([
      '/restaurants/detail',
      this.restaurant().slug,
      this.restaurant().id
    ]);
  }
}
