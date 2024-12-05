import { TransactionLink } from "./transaction-link";

export interface Transaction {
  transactionId: number;
  transcLinkId: number;
  paymentAmount: number;
  citizenId: number;
  reportId: number;
  transactionLink: TransactionLink
}
