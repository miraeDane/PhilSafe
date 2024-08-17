import { Crime } from "./crime";

export interface IncidentType {
    incidenttypeId: number;
    name: string;
    abbrv?: string; 
    category: string;
  
    crimes?: Crime[]; 
  }