import { Component, effect, inject, input, signal } from '@angular/core';
import { CurrencyPipe, Location, DatePipe, DecimalPipe } from '@angular/common';
import { Restaurant } from '../../../shared/models/restaurant';
import { RestaurantService } from '../../../core/services/restaurant-service';
import { buildGoogleSearchUrl } from '../../../shared/utils/link.utils';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';
import { AuthModalService } from '../../../core/services/auth-modal-service';
import { RestaurantMapComponent } from '../restaurant-map/restaurant-map.component';
import { CuisineTagComponent } from '../../../shared/components/cuisine-tag/cuisine-tag.component';
import { RatingBadgeComponent } from '../../../shared/components/rating-badge/rating-badge.component';
import { CommentFormComponent } from '../comment-form/comment-form.component';
import { LucideMapPinCheckInside, LucideHeart, LucideHeartOff, LucideMapPinOff } from '@lucide/angular';
@Component({
  selector: 'app-restaurant-detail',
  imports: [DecimalPipe, DatePipe, LucideMapPinCheckInside, LucideHeart, LucideHeartOff, LucideMapPinOff, CurrencyPipe, RestaurantMapComponent, CuisineTagComponent, RatingBadgeComponent, CommentFormComponent],
  templateUrl: './restaurant-detail.html',
})
export class RestaurantDetail {
  private router = inject(Router);
  private location = inject(Location);
  private restaurantService = inject(RestaurantService);

  public authService = inject(AuthService);
  public authModal = inject(AuthModalService);

  id = input.required<string>();
  slug = input<string>();

  restaurant = signal<Restaurant | null>(null);
  isLoading = signal(true);
  selectedPhoto = signal<string | null>(null);

  googleSearchUrl(): string {
    return buildGoogleSearchUrl(this.restaurant()!.name, this.restaurant()!.address);
  }

  constructor() {
    effect(() => {
      const currentId = this.id();
      if (currentId) {
        this.fetchRestaurant(currentId);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  goToEdit(): void {
    const resto = this.restaurant();
    if (resto && resto.id) {
      this.router.navigate(['/restaurants/edit', resto.slug, resto.id]);
    }
  }

  private fetchRestaurant(id: string): void {
    this.isLoading.set(true);
    this.restaurantService.getRestaurantById(id).subscribe({
      next: (data) => {
        this.restaurant.set(data);
        if (data.photos && data.photos.length > 0) {
          this.selectedPhoto.set(data.photos[0]);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur', err);
        alert("Impossible de charger les détails du restaurant.");
        this.isLoading.set(false);
      }
    });
  }

  selectPhoto(photoUrl: string): void {
    this.selectedPhoto.set(photoUrl);
  }

  toggleFavorite(): void {
    if (!this.authService.isLoggedIn()) {
      alert("Veuillez vous connecter pour ajouter aux favoris.");
      this.authModal.openLogin();
      return;
    }
    const resto = this.restaurant();
    if (!resto || !resto.id) return;

    this.restaurantService.toggleFavorite(resto.id).subscribe({
      next: (res: { isFavorite: boolean; favoritesCount: number }) => {
        this.restaurant.update(r => r ? { ...r, isFavorite: res.isFavorite, favoritesCount: res.favoritesCount } : null);
      }
    });
  }

  toggleVisited(): void {
    if (!this.authService.isLoggedIn()) {
      alert("Veuillez vous connecter pour marquer comme visité.");
      this.authModal.openLogin();
      return;
    }
    const resto = this.restaurant();
    if (!resto || !resto.id) return;

    this.restaurantService.toggleVisited(resto.id).subscribe({
      next: (res: { isVisited: boolean; visitorsCount: number }) => {
        this.restaurant.update(r => r ? { ...r, isVisited: res.isVisited, visitorsCount: res.visitorsCount } : null);
      }
    });
  }

  onCommentAdded(): void {
    const resto = this.restaurant();
    if (resto?.id) {
      this.fetchRestaurant(resto.id);
    }
  }

}
