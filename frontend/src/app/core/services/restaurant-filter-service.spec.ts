import { TestBed } from '@angular/core/testing';

import { RestaurantFilterService } from './restaurant-filter-service';

describe('RestaurantFilter', () => {
  let service: RestaurantFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestaurantFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
