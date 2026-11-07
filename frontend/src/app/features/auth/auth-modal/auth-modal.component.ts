import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthModalService } from '../../../core/services/auth-modal-service';
import { AuthService } from '../../../core/services/auth-service';
import { environment } from '../../../../environments/environment';
import { VerificationModalComponent } from '../verification-modal/verification-modal.component';

@Component({
  selector: 'app-auth-modal',
  imports: [ReactiveFormsModule, VerificationModalComponent],
  templateUrl: './auth-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthModalComponent {
  authModal = inject(AuthModalService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  form = this.fb.group({
    username: [''],
    email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  resetForm = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit() {
    this.updateUsernameValidation();
  }

  toggleMode() {
    this.authModal.isLoginMode.update(mode => !mode);
    this.updateUsernameValidation();
  }

  private updateUsernameValidation() {
    const usernameControl = this.form.get('username');
    if (this.authModal.isLoginMode()) {
      usernameControl?.clearValidators();
    } else {
      usernameControl?.setValidators([Validators.required]);
    }
    usernameControl?.updateValueAndValidity();
  }

  onForgotPassword() {
    const email = this.form.get('email')?.value;
    if (!email || this.form.get('email')?.invalid) {
      alert("Veuillez entrer une adresse email valide dans le champ email avant de cliquer sur 'Mot de passe oublié ?'.");
      return;
    }

    this.authService.forgotPassword(email).subscribe({
      next: () => {
        alert("Un e-mail de réinitialisation a été envoyé à " + email + ". Veuillez vérifier votre boîte de réception.");
      },
      error: (err) => alert("Erreur : " + (err.error?.detail || err.error?.message || "Impossible d'envoyer l'e-mail de réinitialisation."))
    });
  }

  onResetPasswordSubmit() {
    if (this.resetForm.valid) {
      const { password, confirmPassword } = this.resetForm.value;
      if (password !== confirmPassword) {
        alert("Les deux mots de passe ne correspondent pas !");
        return;
      }

      this.authService.resetPassword({
        token: this.authModal.resetToken(),
        password: password!,
        confirmPassword: confirmPassword!
      }).subscribe({
        next: () => {
          alert("Votre mot de passe a été modifié avec succès ! Un e-mail de confirmation vous a été envoyé.");
          this.authModal.isResetPasswordMode.set(false);
          this.authModal.openLogin();
        },
        error: (err) => alert("Erreur lors de la réinitialisation : " + (err.error?.detail || err.error?.message || "Lien invalide ou expiré."))
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value;

      if (this.authModal.isLoginMode()) {
        this.authService.login(formData).subscribe({
          next: (response) => {
            if (response && response.message === 'CODE_REQUIRED') {
              this.authModal.openVerification(formData.email!);
            } else {
              alert('Connexion réussie !');
              this.authModal.close();
            }
          },
          error: (err) => alert("Erreur de connexion : " + (typeof err.error === 'string' 
              ? err.error 
              : (err.error?.detail || err.error?.message || err.error?.error || "Une erreur est survenue lors de l'envoi de l'e-mail.")))
        });
      } else {
        this.authService.register(formData).subscribe({
          next: () => {
            alert("Inscription réussie ! Vous pouvez vous connecter.");
            this.authModal.isLoginMode.set(true);
            this.updateUsernameValidation();
          },
          error: (err) => alert("Erreur d'inscription : " + (typeof err.error === 'string' 
              ? err.error 
             : (err.error?.detail || err.error?.message || err.error?.error|| "Une erreur est survenue lors de l'inscription.")))
        });
      }
    }
  }

  onVerificationSuccess() {
    this.authModal.close();
    alert('Connexion réussie !')
  }

  loginWithGoogle() {
    window.location.href = `${environment.apiUrl.replace('/api', '')}/oauth2/authorization/google`;
  }
}
