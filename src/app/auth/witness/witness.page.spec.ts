import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WitnessPage } from './witness.page';

describe('WitnessPage', () => {
  let component: WitnessPage;
  let fixture: ComponentFixture<WitnessPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WitnessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
