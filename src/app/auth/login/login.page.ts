import { HttpClient } from '@angular/common/http';
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

  withContactNum: AccountSignInFromContactDto = {
    SignInType: '',
    contactNum: 0,
    password: ''

  }

  withEmail: AccountSignInFromEmailDto = {
    SignInType: '',
    email: '',
    password: ''

  }

  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  


  //   login() {
  //     this.withContactNum.contactNum = Number(this.contactNumString);

  //     let isValid = false;
  //     let data: any;
      
  //     if (this.SignInType === 'Email') {
  //       const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  //       isValid = emailPattern.test(this.withEmail.email);
  //       if (isValid) {
  //         data = this.withEmail; // This should match AccountSignInFromEmailDto
  //       } else {
  //         alert("Invalid email format.");
  //         return;
  //       }
  //     } else if (this.SignInType === 'Contact') {
  //       const contactPattern = /^(09|\+639|639)\d{9}$/;
  //       isValid = contactPattern.test(this.contactNumString);
  //       if (isValid) {
  //         data = this.withContactNum; // This should match AccountSignInFromContactDto
  //       } else {
  //         alert("Invalid contact number format.");
  //         return;
  //       }
  //     }
      
  //     if (isValid) {
  //       this.loginService.login(data).subscribe(
  //         (response) => {
  //           if (response) {
  //             console.log('Login Successful:', response);
  //             alert("Login Successful");
  //             this.router.navigate(['/home']);
  //           } else {
  //             alert("Login Failed: Invalid credentials.");
  //           }
  //         },
  //         (error) => {
  //           console.error('Login error:', error);
  //           alert("Login Failed: An error occurred. Please try again.");
  //         }
  //       );
  //   }

  // }

  login() {
    if (this.SignInType === 'Email') {
      // Prepare the email sign-in data
      this.withEmail.SignInType = 'Email';
      this.withEmail.email = this.email;
      this.withEmail.password = this.password;

      // Call the login service
      this.loginService.login(this.withEmail).subscribe(
        (response) => {
          console.log('Login Successful:', response);
          alert("Login Successful");
          this.router.navigate(['/home']); 
          console.log(this.withEmail);
        },
        (error) => {
          console.error('Login error:', error);
          alert(`Login Failed: ${error.error.message || 'An unknown error occurred'}`);
          console.log(this.withEmail);
        }
      );
    } else if (this.SignInType === 'Contact_Number') {
      
      this.withContactNum.SignInType = 'Contact_Number';
      this.withContactNum.contactNum = Number(this.contactNum);
      this.withContactNum.password = this.password;


      this.loginService.login(this.withContactNum).subscribe(
        (response) => {
          console.log('Login Successful:', response);
          alert("Login Successful");
          this.router.navigate(['/home']); 
          console.log(this.withEmail);
        },
        (error) => {
          console.error('Login error:', error);
          alert(`Login Failed: ${error.error.message || 'An unknown error occurred'}`);
          console.log(this.withEmail);
        }
      );
    } else {
      alert('Invalid sign-in type');
    }
  }
}



