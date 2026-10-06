import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';
import { AuthModalService } from '../services/auth-modal-service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const authModalService = inject(AuthModalService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  } 

  authService.logout();
  authModalService.openLogin();
  return router.parseUrl('/');
};
