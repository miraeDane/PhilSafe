import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountSignInFromContactDto, AccountSignInFromEmailDto } from 'src/app/models/login';
import { LoadingService } from 'src/app/services/loading.service';
import { LoginService } from 'src/app/services/login.service';
import { SmtpService } from 'src/app/services/smtp.service';

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
  em_password: string = '';
  con_password: string = '';
  loading: boolean = false;
  passwordVisible: boolean = false;
  showValidationMessages = false;
  

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
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private loadingService: LoadingService,
    private smtpService: SmtpService 
  ) { }

  ngOnInit() {
    
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  async login() {
    this.showValidationMessages = true;

    if (this.SignInType === 'Email') {

      if (!this.isValidEmail(this.email)) {
        console.error('Invalid email address');
        return;
    }
      if (!this.email) {
        alert('Please provide your username (email).');
        return;
      }
      if (this.em_password.length < 8) {
        console.error('Password must be at least 8 characters');
        return;
    }
  
      if (!this.em_password) {
        alert('Please provide your password.');
        return;
      }
    } else if (this.SignInType === 'Contact_Number') {
      if (!this.contactNum.startsWith('09')) {
        console.error('Contact number must start with 09');
        return;
    }
    if (this.con_password.length < 8) {
      console.error('Password must be at least 8 characters');
      return;
  }
      if (!this.contactNumString) {
        alert('Please provide your contact number.');
        return;
      }
      if (!this.con_password) {
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
        this.withEmail.password = this.em_password;

        response = await this.loginService.loginByEmail(this.withEmail).toPromise();
     

      } else if (this.SignInType === 'Contact_Number') {

        this.withContactNum.SignInType = 'Contact_Number';
        this.withContactNum.contactNum = this.contactNumString;
        this.withContactNum.password = this.con_password;

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
          this.loadingService.triggerRefresh();
          this.loading = false;
          
          
              if (sessionStorage.getItem('userData')) {
                console.log('UserData stored successfully');
                alert("Login Successful");
              
                
                this.router.navigate(['/tabs']);
              } else {
                console.error('Failed to store session data');
                alert('Login Failed');
           
                
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
      setTimeout(() => {
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      }, 0);
    }
  }

  // storeSession(sessionId: string) {
  //   const expirationTime = new Date().getTime() + 30 * 60 * 1000;
  //   const sessionData = { sessionId, expirationTime };
  //   localStorage.setItem('sessionData', JSON.stringify(sessionData));
  // }

  // clearSession() {
  //   localStorage.removeItem('sessionData');
  // }

  resetPass(){

this.smtpService.sendOtpCode(this.withEmail.email)
    .subscribe(
      (response) => {
        console.log('OTP sent successfully:', response);
        alert('An OTP has been sent to your email address.');
      },
      (error) => {
        console.error('Error sending OTP:', error);
        alert('Failed to send OTP. Please try again later.');
      }
    );
  }

  isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}




}





