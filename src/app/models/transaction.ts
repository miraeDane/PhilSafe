import { Citizen } from './citizen'; 
import { Report } from './report'; 
import { TransactionLink } from './transaction-link'; 

export interface Transaction {
  transactionId: number;
  transcLinkId: number;
  paymentAmount: number;
  citizenId: number;
  reportId: number;
  citizen: Citizen;
  report: Report;
  transcLink: TransactionLink;
}
