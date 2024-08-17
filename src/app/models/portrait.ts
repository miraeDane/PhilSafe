import { Police } from "./police";
import { PoliceArchive } from "./police-archive";

export interface Portrait {
    pfpId: number;
    facePortrait: Uint8Array; 
    bustPortrait: Uint8Array; 
    fullPortrait: Uint8Array; 
    faceExt: string;
    bustExt: string;
    fullExt: string;
  
    policeArchives?: PoliceArchive[]; 
    polices?: Police[]; 
  }