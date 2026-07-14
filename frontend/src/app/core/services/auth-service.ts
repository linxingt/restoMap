import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        //intercepte la réponse pour sauvegarde ce token puis laisse la réponse continuer
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('username', response.username);
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUsername(): string {
    return localStorage.getItem('username') || '';
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Un JWT est composé de 3 parties séparées par des points. 
      // La partie [1] contient les données (le payload).
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // 'exp' est en secondes, Date.now() est en millisecondes
      const isExpired = payload.exp * 1000 < Date.now();
      
      return !isExpired; // Retourne true si le token n'est PAS expiré
    } catch (e) {
      return false;
    }
  }
}
