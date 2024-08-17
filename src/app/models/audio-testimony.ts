import { Crime } from "./crime";
import { Police } from "./police";
import { Witness } from "./witness";

export interface AudioTestimony {
    witnessId?: number;
    audioTestimonyId: number;
    content: Uint8Array; 
    crimeId: number;
    datetimeObtained?: Date; 
    obtainedBy?: number;
    ext: string;
  
    crime?: Crime; 
    obtainedByNavigation?: Police; 
    witness?: Witness; 
  }
  