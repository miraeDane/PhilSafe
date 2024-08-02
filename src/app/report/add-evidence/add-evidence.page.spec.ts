import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddEvidencePage } from './add-evidence.page';

describe('AddEvidencePage', () => {
  let component: AddEvidencePage;
  let fixture: ComponentFixture<AddEvidencePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEvidencePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
