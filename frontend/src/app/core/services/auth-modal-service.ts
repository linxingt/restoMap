import { Injectable,signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthModalService {
  isOpen = signal<boolean>(false);
  isLoginMode = signal<boolean>(true); 

  isVerificationMode = signal<boolean>(false);
  verificationEmail = signal<string>('');

  openLogin() {
    this.isLoginMode.set(true);
    this.isVerificationMode.set(false);
    this.isOpen.set(true);
  }

  openRegister() {
    this.isLoginMode.set(false);
    this.isVerificationMode.set(false);
    this.isOpen.set(true);
  }

  openVerification(email: string) {
    this.verificationEmail.set(email);
    this.isVerificationMode.set(true);
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
    this.isVerificationMode.set(false);
  }
}
