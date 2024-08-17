import { Crime } from './crime'; 
import { Police } from './police'; 
import { Witness } from './witness'; 

export interface TextTestimony {
  witnessId?: number; 
  textTestimonyId: number;
  content: string;
  crimeId: number;
  datetimeObtained?: Date; 
  obtainedBy?: number; 
  crime: Crime;
  textTestimonyNavigation: Police;
  witness?: Witness;
}
