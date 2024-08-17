import { Crime } from './crime'; 
import { Suspect } from './suspect'; 

export interface SuspectHasCrime {
  suspectId: number;
  crimeId: number;
  motiveShort?: string;
  motiveLong?: string;
  crime: Crime;
  suspect: Suspect;
}
