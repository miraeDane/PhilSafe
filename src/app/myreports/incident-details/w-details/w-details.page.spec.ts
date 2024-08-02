import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WDetailsPage } from './w-details.page';

describe('WDetailsPage', () => {
  let component: WDetailsPage;
  let fixture: ComponentFixture<WDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
