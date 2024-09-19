import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountSignInFromContactDto, AccountSignInFromEmailDto } from 'src/app/models/login';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

 
  contactNum: string = '';
  contactNumString: string = ''
  SignInType: string = 'Email';
  email: string = '';
  password: string = '';
  loading: boolean = false;
  passwordVisible: boolean = false;
  

  withContactNum: AccountSignInFromContactDto = {
   
    contactNum: 0,
    password: '',

  }

  withEmail: AccountSignInFromEmailDto = {
  
    email: '',
    password: ''
  
  }

  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  async login() {
    
    if (this.SignInType === 'Email') {
      if (!this.email) {
        alert('Please provide your username (email).');
        return;
      }
      if (!this.password) {
        alert('Please provide your password.');
        return;
      }
    } else if (this.SignInType === 'Contact_Number') {
      if (!this.contactNumString) {
        alert('Please provide your contact number.');
        return;
      }
      if (!this.password) {
        alert('Please provide your password.');
        return;
      }
    } else {
      alert('Invalid sign-in type');
      return;
    }

    this.loading = true;

    try {
      let response;
      if (this.SignInType === 'Email') {

        this.withEmail.email = this.email;
        this.withEmail.SignInType = 'Email';
        this.withEmail.password = this.password;

        response = await this.loginService.loginByEmail(this.withEmail).toPromise();

      } else if (this.SignInType === 'Contact_Number') {

        this.withContactNum.SignInType = 'Contact_Number';
        this.withContactNum.contactNum = this.contactNumString;
        this.withContactNum.password = this.password;

        response = await this.loginService.loginByContactNumber(this.withContactNum).toPromise();
        console.log("Contact Number Log in details", this.withContactNum)
      }

      
      console.log('Login Successful:', response);
      // sessionStorage.setItem('userData', JSON.stringify(response));
  
      // localStorage.setItem('authenticated', '1');
      // localStorage.setItem('personId', response.personId);

      // console.log('Authenticated state:', localStorage.getItem('authenticated'));
      // alert("Login Successful");
      // this.router.navigate(['/tabs/home'], { queryParams: { personId: response.personId } });

      if (response) {
        // Verify that response contains personId
        if (response.personId) {
          sessionStorage.setItem('userData', JSON.stringify(response));
          localStorage.setItem('authenticated', '1');
          localStorage.setItem('personId', response.personId.toString());
          
              if (sessionStorage.getItem('userData')) {
                console.log('UserData stored successfully');
                alert("Login Successful");
                this.router.navigate(['/tabs']);
              } else {
                console.error('Failed to store session data');
                alert('Login Failed: Unable to store session data');
              }

          } else {
            console.error('Response does not contain personId:', response);
            alert('Login Failed: Missing person ID');
          }
      } else {
        console.error('Response is undefined or null');
        alert('Login Failed: No response from server');
      }
  
    } catch (error: any) {
      console.error('Login error:', error);
      alert(`Login Failed: ${error.message || 'An unknown error occurred'}`);
    } finally {
      this.loading = false;
    }
  }

  storeSession(sessionId: string) {
    const expirationTime = new Date().getTime() + 30 * 60 * 1000;
    const sessionData = { sessionId, expirationTime };
    localStorage.setItem('sessionData', JSON.stringify(sessionData));
  }

  clearSession() {
    localStorage.removeItem('sessionData');
  }

}



