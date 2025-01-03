import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JurisdictionPage } from './jurisdiction.page';

describe('JurisdictionPage', () => {
  let component: JurisdictionPage;
  let fixture: ComponentFixture<JurisdictionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(JurisdictionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
