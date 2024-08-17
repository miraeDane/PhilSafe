import { Ego } from "./ego";
import { Occupation } from "./occupation";
import { Person } from "./person";
import { Suspect } from "./suspect";
import { Victim } from "./victim";
import { Witness } from "./witness";

export interface Description {
    descriptionId: number;
    alias?: string;
    ethnicity?: string;
    isBalikBayan?: boolean;
    isTourist?: boolean;
    otherMark?: string;
    distinguishingMark?: string;
    hairColor?: string;
    eyeColor?: string;
    alcohol?: boolean;
    drug?: boolean;
    height?: number;
    weight?: number;
    personId?: number;
    occupationId?: number;
    witnessId?: number;
    victimId?: number;
    suspectId?: number;
    locationId?: number;
    egoId?: number;
    datetimeCreated?: string; 
    lastModified?: string; 
    createdBy?: string;
    modifiedBy?: string;
    datetimeLastSeen?: string; 
    placeLastSeen?: string;
    bloodType?: string;
  
    ego?: Ego; 
    location?: Location; 
    occupation?: Occupation;
    person?: Person; 
    suspect?: Suspect; 
    victim?: Victim;
    witness?: Witness; 
  }

  export type Nationalities = string[];

  