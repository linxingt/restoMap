import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { catchError } from 'rxjs';
import { AuthModalService } from '../services/auth-modal-service';

export const interceptor: HttpInterceptorFn = (req, next) => {
 const authService = inject(AuthService);
 const authModalService = inject(AuthModalService);
 const token = authService.getToken();

 let finalRequest = req;
  if (token) {
    finalRequest = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(finalRequest).pipe(
    catchError((error) => {
      if (error.status === 401&& !req.url.includes('/api/auth/login')) {
        authService.logout();
        authModalService.openLogin();
      }
      throw error;
    })
  );

};