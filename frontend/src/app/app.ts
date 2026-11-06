import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Navbar } from './layout/navbar/navbar';
import { AuthModalComponent } from './features/auth/auth-modal/auth-modal.component';
import { AuthModalService } from './core/services/auth-modal-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from './core/services/auth-service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, AuthModalComponent],
  templateUrl: './app.html'
})
export class App {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  authModal = inject(AuthModalService);

  inviteCode: string | null = null;

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe(params => {
      const token = params.get('token');
      const username = params.get('username');
      if (token && username) {
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        this.authService.isLoggedIn.set(true);

        this.router.navigate([], {
          queryParams: { token: null, username: null },
          queryParamsHandling: 'merge'
        });
      }

      if (params.get('action') === 'register') {
        this.authModal.isLoginMode.set(false);
        this.authModal.openLogin();

        if (params.get('invite')) {
          this.inviteCode = params.get('invite');
        }
        this.router.navigate([], { queryParams: { action: null, invite: null }, queryParamsHandling: 'merge' });
      }
      else if (params.get('action') === 'login') {
        this.authModal.isLoginMode.set(true);
        this.authModal.openLogin();
      }
    });
  }
}
