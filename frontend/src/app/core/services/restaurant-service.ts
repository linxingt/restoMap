import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { createSlug } from '../../shared/utils/slug.utils';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Restaurant } from '../../shared/models/restaurant';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/restaurants`;

  getApprovedRestaurants(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(this.apiUrl).pipe(
      map(restaurants =>
        restaurants.map(resto => ({
          ...resto,
          slug: createSlug(resto.name) // On génère le slug ici pour chaque resto !
        }))
      ));
  }
}
