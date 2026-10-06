import { Component, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RestaurantService } from '../../../core/services/restaurant-service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Restaurant } from '../../../shared/models/restaurant';

@Component({
  selector: 'app-restaurant-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './restaurant-form.component.html'
})
export class RestaurantFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private restaurantService = inject(RestaurantService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  restaurantForm!: FormGroup;
  editing = signal(false)
  restaurantId?: string;
  isLoading = false;

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  private initForm(): void {
    this.restaurantForm = this.fb.group({
      restaurants: this.fb.array([this.createRestaurantFormGroup()])
    });
  }

  get restaurantsFormArray(): FormArray {
    return this.restaurantForm.get('restaurants') as FormArray;
  }

  createRestaurantFormGroup(restaurant?: Restaurant): FormGroup {
    const cuisines = restaurant?.cuisineTypes ? restaurant.cuisineTypes.join(', ') : '';

    return this.fb.group({
      name: [restaurant?.name || '', [Validators.required, Validators.minLength(2)]],
      address: [restaurant?.address || '', [Validators.required]],
      cuisineTypes: [cuisines, [Validators.required]],
    });
  }

  addRestaurantField(): void {
    this.restaurantsFormArray.push(this.createRestaurantFormGroup());
  }

  removeRestaurantField(index: number): void {
    if (this.restaurantsFormArray.length > 1) {
      this.restaurantsFormArray.removeAt(index);
    }
  }

  private checkEditMode(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.editing.set(true);
      this.restaurantId = idParam;
      this.loadRestaurant(this.restaurantId);
    }
  }

  private loadRestaurant(id: string): void {
    this.isLoading = true;
    this.restaurantService.getRestaurantById(id).subscribe({
      next: (restaurant) => {
        this.restaurantsFormArray.clear();
        this.restaurantsFormArray.push(this.createRestaurantFormGroup(restaurant));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement du restaurant', err);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.restaurantForm.invalid) {
      this.restaurantForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formsValue = this.restaurantsFormArray.value;

    const mappedRestaurants: Partial<Restaurant>[] = formsValue.map((val: { name: string, address: string, cuisineTypes: string }) => ({
      name: val.name,
      address: val.address,
      cuisineTypes: val.cuisineTypes ? val.cuisineTypes.split(',').map((c: string) => c.trim()).filter((c: string) => c) : [],
    }));

    if (this.editing() && this.restaurantId) {
      this.restaurantService.updateRestaurant(this.restaurantId, mappedRestaurants[0]).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['']);
        },
        error: (err) => {
          console.error('Erreur de modification', err);
          this.isLoading = false;
        }
      });
    } else {
      if (mappedRestaurants.length === 1) {
        this.restaurantService.createRestaurant(mappedRestaurants[0]).subscribe({
          next: () => {
            this.isLoading = false;
            this.router.navigate(['']);
          },
          error: (err) => {
            console.error('Erreur de création simple', err);
            this.isLoading = false;
          }
        });
      } else {
        this.restaurantService.createManyRestaurants(mappedRestaurants).subscribe({
          next: () => {
            this.isLoading = false;
            this.router.navigate(['']);
          },
          error: (err) => {
            console.error('Erreur de création multiple', err);
            this.isLoading = false;
          }
        });
      }
    }
  }
}
