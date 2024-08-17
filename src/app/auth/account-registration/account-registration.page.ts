import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateAccountData } from 'src/app/models/create-account-data';
import { AccountService } from 'src/app/services/account.service';


@Component({
  selector: 'app-account-registration',
  templateUrl: './account-registration.page.html',
  styleUrls: ['./account-registration.page.scss'],
})
export class AccountRegistrationPage implements OnInit {

  accountData: CreateAccountData = {
    
    email: '',
    password: '',
    telNum: '',
    contactNum: '',
    homeAddressId: 0,
    workAddressId:0,
    role: 'user',
    personId: 0 
  };

  confirmPassword: string = '';
  termsAccepted: boolean = false;
  profilePicUrl: string | ArrayBuffer | null = null;
  profilePicFile: File | null = null;
 

  constructor(
    private createAccountService: AccountService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
    
  ) {
   
  }

  ngOnInit(): void {
    this.createAccountService;
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.accountData = navigation.extras.state['accountData'];
      console.log('Received account data:', this.accountData); 
    }
   
  }

  createAccount() {
    if (!this.termsAccepted) {
      console.error('You must accept the terms and conditions');
      return;
    }
    if (this.accountData.password !== this.confirmPassword) {
      console.error('Passwords do not match');
      return;
    }
    if (this.accountData.password.length < 8) {
      console.error('Password must be at least 8 characters long');
      return;
    }

    // this.createAccountService.postAccount(this.accountData).subscribe(
    //   (response) => {
    //     alert('Registration successful');
    //     console.log(this.accountData);
    //     this.router.navigate(['/tabs/home']);x 
    //   },
    //   (error) => {
    //     console.error('Failed to register account', error);
    //     console.log(this.accountData);


    //   });
  }

  
 
}
