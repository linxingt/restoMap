import { Injectable,signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthModalService {
  isOpen = signal<boolean>(false);
  isLoginMode = signal<boolean>(true); 

  openLogin() {
    this.isLoginMode.set(true);
    this.isOpen.set(true);
  }

  openRegister() {
    this.isLoginMode.set(false);
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
  }
}
