import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddWitnessPage } from './add-witness.page';

describe('AddWitnessPage', () => {
  let component: AddWitnessPage;
  let fixture: ComponentFixture<AddWitnessPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWitnessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
