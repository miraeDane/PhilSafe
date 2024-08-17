import { AudioTestimony } from "./audio-testimony";
import { IncidentType } from "./incident-type";
import { Jurisdiction } from "./jurisdiction";
import { Medium } from "./medium";
import { Police } from "./police";
import { SuspectHasCrime } from "./suspect-has-crime";
import { TextTestimony } from "./text-has-testimony";
import { Victim } from "./victim";

export interface Crime {
    crimeId: number;
    title: string;
    offenseType?: string;
    citeNumber: string;
    datetimeReported?: string; 
    datetimeCommitted?: string; 
    description?: string;
    status: string;
    incidenttypeId: number;
    datetimeCreated?: string; 
    lastModified?: string; 
    createdBy?: string;
    modifiedBy?: string;
    locationId?: number;
    stationId?: number;
  
    audioTestimonies?: AudioTestimony[];
    incidenttype?: IncidentType;
    location?: Location;
    media?: Medium[];
    reports?: Report[];
    station?: Jurisdiction;
    suspectHasCrimes?: SuspectHasCrime[];
    textTestimonies?: TextTestimony[];
    policePolices?: Police[];
    victimVictims?: Victim[];
  }
  
 