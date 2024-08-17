import { AudioTestimony } from "./audio-testimony";
import { Crime } from "./crime";
import { Jurisdiction } from "./jurisdiction";
import { Person } from "./person";
import { Portrait } from "./portrait";
import { Rank } from "./rank";
import { TextTestimony } from "./text-has-testimony";

export interface Police {
    policeId: number;
    unit: string;
    role: string;
    badgeNumber: string;
    debutDate: string; 
    stationId: number;
    personId: number;
    pfpId: number;
    rankId: number;
    createdBy?: string;
    datetimeCreated?: string; 
  
    audioTestimonies?: AudioTestimony[];
    jurisdictions?: Jurisdiction[]; 
    person?: Person; 
    pfp?: Portrait; 
    rank?: Rank; 
    station?: Jurisdiction; 
    textTestimony?: TextTestimony; 
    crimeCrimes?: Crime[]; 
  }