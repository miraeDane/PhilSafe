import { CreateAccountData } from "./create-account-data";
import { Person } from "./person";
import { Location } from "./location";


export interface UpgradeAccount {
   
    firstname: string;
    middlename: string;
    lastname: string;
    sex: string;
    birthdate: string; 
    bioStatus: boolean ;
    civilStatus?: string;
    deathDate?: string;
    email: string;
    password: string;
    telNum?: string;
    contactNum: string;
    homeAddressId: number;
    workAddressId: number;
    personId?: number;
    role: string;
    profile_pic?:  Uint8Array | null;
    profile_ext?: string;
}