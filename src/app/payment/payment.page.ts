import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { loadScript } from "@paypal/paypal-js";
import axios from 'axios';
import { Router } from '@angular/router';
import { TransactionService } from '../services/transaction.service';
import { Transaction } from '../models/transaction';
import { TransactionLink } from '../models/transaction-link';
import { SmtpService } from '../services/smtp.service';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
  recipientEmail: string = '';
  amount: number = 0;
  currency: string = 'PHP';
  note: string = '';
  showToast: boolean = false;
  isModalOpen: boolean = false;
  selectedPaymentMethod: string = 'paypal';
  loadingMessage: string = '';
  loading: boolean = false; 
  transactionId: number = 0;

  paypal: any;

  transaction: Transaction = {
    transactionId: 0,
    transcLinkId: 0,
    paymentAmount: 0,
    citizenId: 0,
    reportId: 0
  }



  

  constructor(
    private toastController: ToastController, 
    private http: HttpClient,
    private router: Router,
    private transactionService: TransactionService,
    private smtpService: SmtpService 
  ) {}

  ngOnInit(){
    // Retrieve state data
        const navigation = this.router.getCurrentNavigation();
        const state = navigation?.extras.state as { citizenId: number; reportId: number };

        if (state) {
          console.log('Citizen ID:', state.citizenId);
          console.log('Report ID:', state.reportId);

          this.transaction.citizenId = state.citizenId;
          this.transaction.reportId = state.reportId;
        }
  }
 

  onPaymentMethodChange() {
    console.log('Selected Payment Method:', this.selectedPaymentMethod);
  }

  async getAccessToken() {
    const clientId = 'AUMV-zuzcOD_56XbY0H_U-6N5MBXEZAuR0Z6WzWIxC1dWHL7UXRBYkNbH3e-TaV00Pn7SGAqEifwZAH3';
    const secret = 'EAcmUE4nIkB10vRyfio2TlWz-ytLuvsZ5vcmdrCQf-ZWpd4pjrKDDZH0Wm-g9JLk2iGMI89yWcG3iHE6';
  
    // Encode clientId:secret in Base64
    const base64 = btoa(`${clientId}:${secret}`);
  
    try {
      const response = await axios.post('https://api.sandbox.paypal.com/v1/oauth2/token', 
        new URLSearchParams({ grant_type: 'client_credentials' }), 
        {
          headers: {
            'Authorization': `Basic ${base64}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        });
  
      console.log('Access Token', response.data.access_token);
      return response.data.access_token;
    } catch (error:any) {
      console.error('Error obtaining access token:', error.message);
      throw error;
    }
  }

  async submitPayment() {
    this.loadingMessage = 'Processing payment...';
    this.loading = true;
  
    if (this.selectedPaymentMethod === 'paypal') {
      const accessToken = await this.getAccessToken();
      this.transaction.transcLinkId = 1
  
      const payoutData = {
        sender_batch_header: {
          sender_batch_id: Math.random().toString(36).substring(9),
          email_subject: 'You have a payment',
        },
        items: [
          {
            recipient_type: 'EMAIL',
            amount: {
              value: this.amount.toString(),
              currency: this.currency,
            },
            receiver: this.recipientEmail,
            note: this.note,
            sender_item_id: Math.random().toString(36).substring(9),
          },
        ],
      };
  
      try {
        const response = await this.http.post('https://api.sandbox.paypal.com/v1/payments/payouts', payoutData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        }).toPromise();
  
        console.log('PayPal payment successful:', response);
        this.sendTransactionToBackend('paypal', 'https://api.sandbox.paypal.com', 'PayPal');
        this.sendEmailDetails();
        // this.retrieveReceipt();
        // this.paymentSuccessPage();

      
      } catch (error) {
        console.error('Error processing PayPal payment:', error);
        this.loading = false;
      }
    } else if (this.selectedPaymentMethod === 'mastercard') {
      this.transaction.transcLinkId = 2
      console.log('Processing Mastercard payment...');
      // Implement Mastercard API logic
      this.sendTransactionToBackend('mastercard', 'https://api.mastercard.com', 'Mastercard');
    } else if (this.selectedPaymentMethod === 'gcash') {
      this.transaction.transcLinkId = 3
      console.log('Processing GCash payment...');
      // Implement GCash API logic
      this.sendTransactionToBackend('gcash', 'https://api.gcash.com', 'GCash');
    }
  }
  

  async sendTransactionToBackend(paymentMethod: string, gatewayUrl: string, brand: string) {
    // Set transaction details
    this.transaction.paymentAmount = this.amount;
   
  
    // Call the backend service
    // this.transactionService.transactBlotter(this.transaction).subscribe({
    //   next: (result) => {
    //     console.log('Transaction successfully posted:', result);
    //     this.loading = false;
    //     this.showToast = true;
    //     setTimeout(() => {
    //       this.isModalOpen = true;
    //     }, 3000);
    //   },
    //   error: (error) => {
    //     console.error('Error posting transaction:', error);
    //     this.loading = false;
    //   },
    // });
    this.transactionService.transactBlotter(this.transaction).subscribe({
      next: (result) => {
        console.log('Transaction successfully posted:', result);
        this.loading = false;
        this.showToast = true;
        this.transactionId = result.id;
        console.log("Saved Transaction ID: ", this.transactionId)
        setTimeout(() => {
          this.isModalOpen = true;
        }, 3000);
      },
      error: (error) => {
        console.error('Error posting transaction:', error);
        this.loading = false;
    
        // Look for the "Duplicate key value" in the error message
        if (error?.error?.toString().includes("Duplicate key value") || error?.code === 500) {
          alert("You've already made payment for this report.");
        // } else {
        //   alert("An unexpected error occurred. Please try again.");
        // }
        }  
      }
    });
  }

  sendEmailDetails() {
    this.smtpService.sendEmailDetails(this.transaction.reportId, this.transaction.citizenId).subscribe({
      next: (response) => {
        console.log('Email sent successfully:', response);
      },
      error: (error) => {
        console.error('Error sending email details:', error);
      },
    });
  }

  retrieveReceipt() {
    this.smtpService.retrieveReceipt(this.transaction.reportId, this.transaction.citizenId).subscribe({
      next: (response) => {
        console.log('Receipt retrieved successfully:', response);
      },
      error: (error) => {
        console.error('Error retrieving receipt:', error);
      },
    });
  }
  

  closeModal() {
    this.isModalOpen = false; 
  }
  
  goBack() {
    this.closeModal(); 
    setTimeout(() => {
      this.router.navigate(['/tabs/home']);
    }, 100);
  }

  paymentSuccessPage(){
    this.loading = false;
    this.router.navigate(['/payment-success'], {
      state: {
    
        citizenId: this.transaction.citizenId,
        reportId: this.transaction.reportId,
        trans_id: this.transactionId,
      },
    });
  }
  
}