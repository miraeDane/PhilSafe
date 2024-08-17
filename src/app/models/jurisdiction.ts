import { Crime } from "./crime";
import { Police } from "./police";

export interface Jurisdiction {
    stationId: number;
    hq: string;
    locationId: number;
    abbr?: string; 
    rank?: string;
    officerInChargeId?: number; 
  
    crimes?: Crime[]; 
    location: Location; 
    officerInCharge?: Police; 
    polices?: Police[]; 
  }