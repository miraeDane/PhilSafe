import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyreportsPage } from './myreports.page';

describe('MyreportsPage', () => {
  let component: MyreportsPage;
  let fixture: ComponentFixture<MyreportsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyreportsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
