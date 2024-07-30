import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarouselPage } from './carousel.page';

describe('CarouselPage', () => {
  let component: CarouselPage;
  let fixture: ComponentFixture<CarouselPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CarouselPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
