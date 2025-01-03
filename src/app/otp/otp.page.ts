import { Component, OnInit } from '@angular/core';
import { SmtpService } from '../services/smtp.service';
import { interval, Subscription } from 'rxjs';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.page.html',
  styleUrls: ['./otp.page.scss'],
})
export class OtpPage implements OnInit {

  email: string = '';
  SignInType: string = '';
  loading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  otpTimer: number = 300; 
  timerSubscription!: Subscription;
  isOtpExpired: boolean = false;

  otpCode: string = '';
  verifiedCode: string = '';
  confirmPassword: string = '';
  oldPassword: string = '';
  newPassword: string = '';
  oldPasswordVisible: boolean = false;
  newPasswordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;

  step: number = 1;

  constructor(
    private smtpService: SmtpService,
    private accountService: AccountService 
  ) { }

  ngOnInit() {
  }

  togglePasswordVisibility() {
    this.oldPasswordVisible = !this.oldPasswordVisible;
    this.newPasswordVisible = !this.newPasswordVisible;
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  startOtpTimer() {
    this.isOtpExpired = false;
    this.otpTimer = 300; // Reset to 5 minutes

    // Start the countdown
    this.timerSubscription = interval(1000).subscribe(() => {
      this.otpTimer--;
      if (this.otpTimer <= 0) {
        this.timerSubscription.unsubscribe();
        this.resendOtp();
      }
    });
  }

  resendOtp() {
    this.isOtpExpired = true;
    this.successMessage = 'Your OTP has expired. A new OTP has been sent.';

    console.log('Resending OTP...');
    this.sendOTP(); 

    this.startOtpTimer();
  }

  sendOTP(){
    //this.step = 2;

    this.smtpService.sendOtpCode(this.email)
        .subscribe(
          (response) => {
            console.log('OTP sent successfully:', response);
            setTimeout(() => {
              this.loading = false;
              this.successMessage = 'OTP has been sent to your email!';
              this.errorMessage = '';
              this.step = 2;
              this.startOtpTimer();
            }, 2000);
          },
          (error) => {
            console.error('Error sending OTP:', error);
            alert('Failed to send OTP. Please try again later.');
          }
        );
      }

      validateOtp() {
        //this.step = 3;
        if (this.otpCode.trim() === '') {
          this.errorMessage = 'Please enter the OTP.';
          return;
        }

        this.smtpService.validateOtpCode(this.email, this.otpCode)
          .subscribe(
            (response) => {
              console.log('OTP verified successfully:', response);
              this.successMessage = 'OTP verified successfully!';
              this.errorMessage = '';
              this.step = 3; 
              this.timerSubscription.unsubscribe(); 
            },
            (error: any) => {
              console.log('Invalid OTP please try again', error);
              this.errorMessage = 'Invalid OTP. Please try again.';
              this.successMessage = '';
            }
          )
      }
    
      resetPassword() {
        if (this.newPassword !== this.confirmPassword) {
          this.errorMessage = 'Passwords do not match!';
          return;
        }
    
        const requestData = {
          password: this.newPassword,
          email: this.email,
          SignInType:  "Email"
        };
    
        this.accountService.resetPassword(requestData).subscribe(
          (response) => {
            this.successMessage = 'Password reset successful!';
            console.log(response);
          },
          (error) => {
            this.errorMessage = 'Error resetting password. Please try again.';
            console.error(error);
          }
        );
      }
      
    

}
