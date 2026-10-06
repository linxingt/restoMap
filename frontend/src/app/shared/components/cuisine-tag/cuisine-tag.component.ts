import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-cuisine-tag',
  imports: [],
  templateUrl: './cuisine-tag.component.html',
})
export class CuisineTagComponent {
  label = input.required<string>();
  active = input<boolean>(false);
  onClick = output<string>();
}
