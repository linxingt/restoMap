import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Restaurant } from './shared/models/restaurant';
import { Navbar } from './layout/navbar/navbar';
import { AuthModalComponent } from './features/auth/auth-modal/auth-modal.component';
import { AuthModalService } from './core/services/auth-modal-service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, AuthModalComponent],
  templateUrl: './app.html'
})
export class App implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  authModal = inject(AuthModalService);

  inviteCode: string | null = null;

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      if (params.get('action') === 'register') {
        this.authModal.isLoginMode.set(false);
        this.authModal.openLogin();

        if (params.get('invite')) {
          this.inviteCode = params.get('invite');
          // console.log("Code d'invitation reçu : ", this.inviteCode);
        }
        this.router.navigate([], { queryParams: { action: null, invite: null }, queryParamsHandling: 'merge' });
      }
      else if (params.get('action') === 'login') {
        this.authModal.isLoginMode.set(true);
        this.authModal.openLogin();
      }
    })
  };
}
