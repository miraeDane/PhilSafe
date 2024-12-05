import { Citizen } from "./citizen";
import { Location } from "./location";
import { Crime } from "./crime";
import { Medium } from "./medium";
import { ReportSubCategory } from "./report-sub-category";
import { Transaction } from "./transaction";

export interface Report {
    reportId: number;
    reportBody: string;
    citizenId: number;
    incidentDate: string,
    reportSubCategoryId: number;
    locationId?: number; 
    stationId: number;
    crimeId?: number; 
    reportedDate?: string; 
    blotterNum: string;
    eSignature: number[] | Uint8Array | Blob; 
    signatureExt: string;
    hasAccount: boolean;
  
    citizen?: Citizen; 
    crime?: Crime; 
    location?: Location; 
    media?: Medium[]; 
    reportSubCategory?: ReportSubCategory; 
    transactions?: Transaction[];
  }