import { Person } from "./person";
import { Portrait } from "./portrait";
import { Rank } from "./rank";

export class PoliceArchive {
}
export interface PoliceArchive {
    policeId: number;
    role: string;
    badgeNumber: string;
    debutDate: string; 
    stationId: number;
    personId: number;
    pfpId: number;
    rankId: number;
    createdBy?: string;
    deletedBy?: string;
  
    person?: Person; 
    pfp?: Portrait; 
    rank?: Rank; 
  }