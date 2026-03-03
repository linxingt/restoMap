import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateRestaurant } from './validate-restaurant';

describe('ValidateRestaurant', () => {
  let component: ValidateRestaurant;
  let fixture: ComponentFixture<ValidateRestaurant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidateRestaurant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidateRestaurant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
