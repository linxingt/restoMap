import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthModalService } from '../../../core/services/auth-modal-service';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-auth-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './auth-modal.component.html',
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

  onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value;

      if (this.authModal.isLoginMode()) {
        this.authService.login(formData).subscribe({
          next: () => {
            alert('Connexion réussie !');
            this.authModal.close();
          },
          error: (err) => alert("Erreur de connexion : " + err.error)
        });
      } else {
        this.authService.register(formData).subscribe({
          next: () => {
            alert("Inscription réussie ! Vous pouvez vous connecter.");
            this.authModal.isLoginMode.set(true);
            this.updateUsernameValidation();
          },
          error: (err) => alert("Erreur d'inscription : " + err.error)
        });
      }
    }
  }
}
