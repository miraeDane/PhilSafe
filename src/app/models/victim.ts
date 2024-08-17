import { Description } from './description'; 
import { Person } from './person'; 
import { VictimizationMethod } from './victimization-method'; 
import { Crime } from './crime'; 

export interface Victim {
  victimId: number;
  personId: number;
  vicMethodId: number;
  datetimeOfDeath?: Date;
  descriptions: Description[];
  person: Person;
  vicMethod: VictimizationMethod;
  crimeCrimes: Crime[];
}
