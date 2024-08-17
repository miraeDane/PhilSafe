import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateAccountPage } from './create-account.page';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

describe('CreateAccountPage', () => {
  let component: CreateAccountPage;
  let fixture: ComponentFixture<CreateAccountPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
