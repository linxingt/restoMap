import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuisineBadge } from './cuisine-badge';

describe('CuisineBadge', () => {
  let component: CuisineBadge;
  let fixture: ComponentFixture<CuisineBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuisineBadge]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuisineBadge);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
