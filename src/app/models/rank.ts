import { Police } from "./police";
import { PoliceArchive } from "./police-archive";

export interface Rank {
    rankId: number;
    rankFull: string;
    rankAbbr: string;
  
    policeArchives?: PoliceArchive[]; 
    polices?: Police[]; 
  }