import { Description } from "./description";

export interface Occupation {
    occupationId: number;
    name: string;
    
    descriptions?: Description[]; 
  }