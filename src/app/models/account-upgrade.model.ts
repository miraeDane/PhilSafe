import { CreateAccountData } from "./create-account-data";
import { Person } from "./person";
import { Location } from "./location";
import { Address } from "./0common.model";


export interface UpgradeAccount {
   
    firstname: string;
    middlename: string;
    lastname: string;
    sex: string;
    birthdate?: string; 
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
    profile_pic?:  any;
    profile_ext?: string;

    homeAddress: Address
    workAddress: Address
}