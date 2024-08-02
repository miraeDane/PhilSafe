import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EDetailsPage } from './e-details.page';

describe('EDetailsPage', () => {
  let component: EDetailsPage;
  let fixture: ComponentFixture<EDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
