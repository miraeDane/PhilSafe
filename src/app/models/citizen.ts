import { Mugshot } from "./mugshot";
import { Person } from "./person";
import { Transaction } from "./transaction";

export interface Citizen {
    citizenId: number;
    personId: number;
    mugshotId?: number;
    citizenProof?: Uint8Array; 
    proofExt?: string;
  
    mugshot?: Mugshot; 
    person: Person; 
    reports?: Report[]; 
    transactions?: Transaction[]; 
  }
  