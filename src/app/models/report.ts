import { Citizen } from "./citizen";
import { Crime } from "./crime";
import { Medium } from "./medium";
import { ReportSubCategory } from "./report-sub-category";
import { Transaction } from "./transaction";

export interface Report {
    reportId: number;
    reportBody: string;
    citizenId: number;
    reportSubCategoryId: number;
    locationId?: number; 
    stationId: number;
    crimeId?: number; 
    reportedDate: string; 
    blotterNum: string;
    eSignature: Uint8Array; 
    signatureExt: string;
    hasAccount: boolean;
  
    citizen?: Citizen; 
    crime?: Crime; 
    location?: Location; 
    media?: Medium[]; 
    reportSubCategory?: ReportSubCategory; 
    transactions?: Transaction[];
  }