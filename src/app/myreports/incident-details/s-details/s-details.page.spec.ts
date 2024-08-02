import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SDetailsPage } from './s-details.page';

describe('SDetailsPage', () => {
  let component: SDetailsPage;
  let fixture: ComponentFixture<SDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
