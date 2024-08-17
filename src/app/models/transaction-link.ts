import { Transaction } from './transaction'; 
export interface TransactionLink {
  transcLinkId: number;
  gatewayUrl: string;
  methodType?: string;
  brand: string;
  transactions: Transaction[];
}
