import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuisineTagComponent } from './cuisine-tag.component';

describe('CuisineTagComponent', () => {
  let component: CuisineTagComponent;
  let fixture: ComponentFixture<CuisineTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuisineTagComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuisineTagComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
