import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddSuspectPage } from './add-suspect.page';

describe('AddSuspectPage', () => {
  let component: AddSuspectPage;
  let fixture: ComponentFixture<AddSuspectPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSuspectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
