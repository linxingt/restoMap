import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Restaurant } from '../../shared/models/restaurant';
import { RestaurantFilter } from './restaurant-filter-service';
import { createSlug } from '../../shared/utils/link.utils';

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface RestaurantFilterParams extends RestaurantFilter {
  page?: number;
  size?: number;
}

export interface VisitResponse {
  isVisited: boolean;
  visitorsCount: number;
}

export interface FavoriteResponse {
  isFavorite: boolean;
  favoritesCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/restaurants`;

  getApprovedRestaurants(filters: RestaurantFilterParams): Observable<PageResponse<Restaurant>> {
    let params = new HttpParams()
      .set('page', (filters.page ?? 0).toString())
      .set('size', (filters.size ?? 10).toString());
    if (filters.name) params = params.set('search', filters.name);
    if (filters.cuisineTypes && filters.cuisineTypes.length > 0) {
      params = params.set('cuisineTypes', filters.cuisineTypes.join(','));
    }
    if (filters.minPrice !== undefined) params = params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== undefined) params = params.set('maxPrice', filters.maxPrice.toString());
    if (filters.ratings && filters.ratings.length > 0) {
      params = params.set('ratings', filters.ratings.join(','));
    }
    if (filters.sortByUpdatedAt) params = params.set('sort', `updatedAt,${filters.sortByUpdatedAt.toLowerCase()}`);

    return this.http.get<PageResponse<Restaurant>>(this.apiUrl, { params }).pipe(
      map((response) => ({
        ...response,
        content: response.content.map((resto) => ({
          ...resto,
          slug: createSlug(resto.name),
        })),
      }))
    );;
  }

  getAllCuisineTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/cuisines`);
  }

  getRestaurantById(id: string): Observable<Restaurant> {
    return this.http.get<Restaurant>(`${this.apiUrl}/${id}`).pipe(
      map((resto) => ({
        ...resto,
        slug: createSlug(resto.name),
      }))
    );
  }

  toggleFavorite(id: string): Observable<FavoriteResponse> {
    return this.http.post<FavoriteResponse>(`${this.apiUrl}/${id}/favorite`, {});
  }

  toggleVisited(id: string): Observable<VisitResponse> {
    return this.http.post<VisitResponse>(`${this.apiUrl}/${id}/visited`, {});
  }

  createRestaurant(resto: Partial<Restaurant>): Observable<Restaurant> {
    return this.http.post<Restaurant>(this.apiUrl, resto);
  }

  createManyRestaurants(restos: Partial<Restaurant>[]): Observable<Restaurant[]> {
    return this.http.post<Restaurant[]>(`${this.apiUrl}/many`, restos);
  }

  updateRestaurant(id: string, resto: Partial<Restaurant>): Observable<Restaurant> {
    return this.http.put<Restaurant>(`${this.apiUrl}/${id}`, resto);
  }
}
