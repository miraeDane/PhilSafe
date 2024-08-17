import { CreateAccountData } from "./create-account-data";

export interface Admin {
    adminId: number;
    registrationDate: Date; 
    accountId: number;
    account?: CreateAccountData; 
  }
  