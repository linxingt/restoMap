import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Comment } from '../../shared/models/comment';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/comments/restaurants`;

  getCommentsByRestaurant(restaurantId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/${restaurantId}`);
  }

  addComment(restaurantId: string, comment: Partial<Comment>): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/${restaurantId}`, comment);
  }
}
