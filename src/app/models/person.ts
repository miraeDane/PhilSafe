import { Citizen } from "./citizen";
import { CreateAccountData } from "./create-account-data";
import { Description } from "./description";
import { Police } from "./police";
import { PoliceArchive } from "./police-archive";
import { Relationship } from "./relationship";
import { Suspect } from "./suspect";
import { Victim } from "./victim";
import { Witness } from "./witness";

export interface Person {
    personId?: any;
    firstname: string;
    middlename: string;
    lastname: string;
    sex: string;
    birthdate?: string; 
    bioStatus: boolean;
    civilStatus?: string;
    deathDate?: string;
  
    accounts?: CreateAccountData[];
    citizens?: Citizen[];
    descriptions?: Description[];
    policeArchives?: PoliceArchive[];
    polices?: Police[];
    relationshipPerson1Navigations?: Relationship[];
    relationshipPerson2Navigations?: Relationship[];
    suspects?: Suspect[];
    victims?: Victim[];
    witnesses?: Witness[];
  }