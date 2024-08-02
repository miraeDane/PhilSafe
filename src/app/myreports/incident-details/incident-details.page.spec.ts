import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncidentDetailsPage } from './incident-details.page';

describe('IncidentDetailsPage', () => {
  let component: IncidentDetailsPage;
  let fixture: ComponentFixture<IncidentDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
