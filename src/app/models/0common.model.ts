export interface BasePerson {
    personId?: number;
    firstname: string;
    middlename: string;
    lastname: string;
    sex: string;
    birthdate: string;
    civilStatus?: string;
    bioStatus: boolean;
  }
  
  export interface ContactDetails {
    email: string;
    mobileNum: string;
    telNum?: string;
  }
  
  export interface Address {
    locationId: number;
    province: string;
    municipality: string;
    street: string;
    region: string;
    block?: string,
    barangay: string;
    zipCode: number;
  }
  
  export interface Description {
    descriptionId: number;
    ethnicity: string;
    height?: number;
    weight?: number;
    hairColor?: string;
    eyeColor?: string;
    alcohol?: boolean;
    drug?: boolean;
    victimId?: number;
    witnessId?: number;
    suspectId?: number;
    personId?: number;
    distinguishingMark?: string;
    occupation?: Occupation
  }
  
  export interface Occupation {
    occupationId: number;
    name: string;
  }