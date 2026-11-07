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

  isLoggedIn = signal<boolean>(this.checkInitialLoginState());

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          this.saveSession(response.token, response.username);
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  verifyCode(data: { email: string; code: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/verify-code`, data).pipe(
      tap(response => {
        if (response && response.token) {
          this.saveSession(response.token, response.username);
        }
      })
    );
  }

  initiateGoogleLogin(): void {
    window.location.href = `${environment.apiUrl.replace('/api', '')}/oauth2/authorization/google`;
  }

  saveSession(token: string, username: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    this.isLoggedIn.set(true);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUsername(): string {
    return localStorage.getItem('username') || '';
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.isLoggedIn.set(false);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(data: { token: string; password: string; confirmPassword: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reset-password`, data);
  }

  private checkInitialLoginState(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Un JWT est composé de 3 parties séparées par des points. 
      // La partie [1] contient les données (le payload).
      const payload = JSON.parse(atob(token.split('.')[1]));

      // 'exp' est en secondes, Date.now() est en millisecondes
      return payload.exp * 1000 > Date.now();
    } catch (e) {
      return false;
    }
  }
}
