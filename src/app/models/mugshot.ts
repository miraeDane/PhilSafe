import { Citizen } from "./citizen";

export interface Mugshot {
    mugshotId: number;
    front: Uint8Array; 
    leftSide: Uint8Array; 
    rightSide: Uint8Array; 
    fullFrontal: Uint8Array; 
    frontExt: string;
    leftExt: string;
    rightExt: string;
    fullFrontExt: string;
  
    citizens?: Citizen[]; 
  }