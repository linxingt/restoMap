import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-verification-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './verification-modal.component.html'
})
export class VerificationModalComponent {
  private authService = inject(AuthService);

  @Input() email: string = '';
  @Output() success = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  code: string = '';
  errorMessage: string = '';

  onSubmit() {
    if (!this.code || this.code.length !== 6) {
      this.errorMessage = "Le code doit comporter exactement 6 caractères.";
      alert(this.errorMessage);
      return;
    }

    this.authService.verifyCode({ email: this.email, code: this.code }).subscribe({
      next: (res) => {
        this.success.emit(res);
      },
      error: (err) => {
        this.errorMessage = typeof err.error === 'string'
          ? err.error
          : (err.error?.detail || err.error?.message || err.error?.error || "Code incorrect ou compte bloqué temporairement.");
          alert(this.errorMessage);
      }
    });
  }

  onCancel() {
    this.cancel.emit();
  }
}
