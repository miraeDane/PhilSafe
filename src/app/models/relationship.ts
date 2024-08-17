import { Person } from "./person";

export interface Relationship {
    relationshipId: number;
    name: string;
    person1: number;
    person2: number;
  
    person1Navigation?: Person; 
    person2Navigation?: Person;
  }
  