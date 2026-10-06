import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-rating-badge',
  imports: [DecimalPipe],
  templateUrl: './rating-badge.component.html'
})
export class RatingBadgeComponent {
  rating = input<number | undefined | null>();
}
