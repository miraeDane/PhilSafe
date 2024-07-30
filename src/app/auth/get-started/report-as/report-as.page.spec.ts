import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportAsPage } from './report-as.page';

describe('ReportAsPage', () => {
  let component: ReportAsPage;
  let fixture: ComponentFixture<ReportAsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportAsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
