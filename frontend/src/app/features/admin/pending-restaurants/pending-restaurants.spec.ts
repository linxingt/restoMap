import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingRestaurants } from './pending-restaurants';

describe('PendingRestaurants', () => {
  let component: PendingRestaurants;
  let fixture: ComponentFixture<PendingRestaurants>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingRestaurants]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingRestaurants);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
