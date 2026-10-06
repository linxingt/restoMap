import { Component, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentService } from '../../../core/services/comment-service';
import { AuthService } from '../../../core/services/auth-service';
import { AuthModalService } from '../../../core/services/auth-modal-service';
import { Comment } from '../../../shared/models/comment';
import { LucideThumbsUp,LucideThumbsDown } from '@lucide/angular';
@Component({
  selector: 'app-comment-form',
  imports: [ReactiveFormsModule, LucideThumbsUp, LucideThumbsDown ],
  templateUrl: './comment-form.component.html',
})
export class CommentFormComponent {
  restaurantId = input.required<string>();
  commentAdded = output<Comment>();

  private fb = inject(FormBuilder).nonNullable;
  private commentService = inject(CommentService);
  private authService = inject(AuthService);
  private authModal = inject(AuthModalService);

  hoveredStar = signal<number | null>(null);
  isSubmitting = signal(false);
  availableTags = ['Service rapide', 'Romantique', 'Bon rapport Q/P', 'Options véganes', 'En famille'];

  commentForm = this.fb.group({
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    pricePerPerson: [<number | null>null, [Validators.min(0)]],
    isGood: [true, [Validators.required]],
    content: ['', [Validators.maxLength(500)]],
    selectedTags: [<string[]>[]],
  });

  get activeRating(): number {
    return this.hoveredStar() ?? this.commentForm.controls.rating.value;
  }

  get contentLength(): number {
    return this.commentForm.controls.content.value.length;
  }

  setRating(rating: number): void {
    this.commentForm.controls.rating.setValue(rating);
  }

  toggleIsGood(): void {
    const current = this.commentForm.controls.isGood.value;
    this.commentForm.controls.isGood.setValue(!current);
  }

  isTagSelected(tag: string): boolean {
    return this.commentForm.controls.selectedTags.value.includes(tag);
  }

  toggleTag(tag: string): void {
    const currentTags = this.commentForm.controls.selectedTags.value;
    const exists = currentTags.includes(tag);
    const updated = exists
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];

    this.commentForm.controls.selectedTags.setValue(updated);
  }

  submitComment(): void {
    if (!this.authService.isLoggedIn()) {
      this.authModal.openLogin();
      return;
    }
    if (this.commentForm.invalid) {
      this.commentForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const formValues = this.commentForm.getRawValue();

    let finalContent = formValues.content.trim();
    if (formValues.selectedTags.length > 0) {
      finalContent += (finalContent ? '\n\n' : '') + `Point(s) fort(s) : ${formValues.selectedTags.join(', ')}`;
    }

    const payload: Partial<Comment> = {
      content: finalContent,
      rating: formValues.rating,
      pricePerPerson: formValues.pricePerPerson ?? undefined,
      isGood: formValues.isGood,
    };

    this.commentService.addComment(this.restaurantId(), payload).subscribe({
      next: (createdComment) => {
        this.commentForm.reset({
          rating: 5,
          isGood: true,
          pricePerPerson: null,
          content: '',
          selectedTags: [],
        });
        this.hoveredStar.set(null);
        this.isSubmitting.set(false);
        this.commentAdded.emit(createdComment);
      },
      error: () => {
        this.isSubmitting.set(false);
      }
    });
  }
}
