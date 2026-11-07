import { Injectable,signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthModalService {
  isOpen = signal<boolean>(false);
  isLoginMode = signal<boolean>(true); 

  isVerificationMode = signal<boolean>(false);
  verificationEmail = signal<string>('');

  isResetPasswordMode = signal<boolean>(false);
  resetToken = signal<string>('');

  openLogin() {
    this.isLoginMode.set(true);
    this.isVerificationMode.set(false);
    this.isResetPasswordMode.set(false);
    this.isOpen.set(true);
  }

  openRegister() {
    this.isLoginMode.set(false);
    this.isVerificationMode.set(false);
    this.isResetPasswordMode.set(false);
    this.isOpen.set(true);
  }

  openVerification(email: string) {
    this.verificationEmail.set(email);
    this.isVerificationMode.set(true);
    this.isResetPasswordMode.set(false);
    this.isOpen.set(true);
  }

  openResetPassword(token: string) {
    this.resetToken.set(token);
    this.isResetPasswordMode.set(true);
    this.isVerificationMode.set(false);
    this.isOpen.set(true);
  }

  close() {
    if (this.isResetPasswordMode()) return;
    this.isOpen.set(false);
    this.isVerificationMode.set(false);
  }
}
