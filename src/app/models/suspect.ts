import { Description } from './description'; 
import { Person } from './person';
import { SuspectHasCrime } from './suspect-has-crime'; 

export interface Suspect {
  suspectId: number;
  personId?: number;
  gangAffiliation?: string;
  reward?: number;
  isCaught?: boolean;
  datetimeOfCaught?: Date;
  descriptions?: Description[];
  person?: Person;
  suspectHasCrimes?: SuspectHasCrime[];
}
