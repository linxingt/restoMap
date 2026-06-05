import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantFilterComponent } from './restaurant-filter.component';

describe('RestaurantFilterComponent', () => {
  let component: RestaurantFilterComponent;
  let fixture: ComponentFixture<RestaurantFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantFilterComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
