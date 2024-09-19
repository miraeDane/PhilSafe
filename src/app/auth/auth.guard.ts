import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AccountService } from '../services/account.service';
import { LoginService } from '../services/login.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: LoginService, 
    private router: Router
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    
    const authenticatedString = localStorage.getItem('authenticated');
    const isAuthenticated = authenticatedString ? !!Number(authenticatedString) : false;


  // console.log('Authenticated state:', authenticatedString);
  // console.log('Is Authenticated:', isAuthenticated);

    if (isAuthenticated) {
      // console.log('Authenticated state:', localStorage.getItem('authenticated'));
      // console.log('Authenticated pero ambot nganong dili mo home page');
      return true;
    
    } else {
      // console.log('Authenticated state:', localStorage.getItem('authenticated'));
      // console.log('User is not authenticated, redirecting to login.');
      this.router.navigate(['/login']); 
      return false; 
    }
  }
}


