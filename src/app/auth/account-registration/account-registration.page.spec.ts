import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountRegistrationPage } from './account-registration.page';

describe('AccountRegistrationPage', () => {
  let component: AccountRegistrationPage;
  let fixture: ComponentFixture<AccountRegistrationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountRegistrationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
