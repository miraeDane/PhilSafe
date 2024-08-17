import { CreateAccountData } from "./create-account-data";
import { Crime } from "./crime";
import { Description } from "./description";
import { Jurisdiction } from "./jurisdiction";

export interface Location {
    locationId?: any;
    province: string;
    municipality: string;
    street: string;
    region: string;
    barangay: string;
    block?: string;
    latitude?: number;
    longitude?: number;
    accountHomeAddresses?: CreateAccountData[];
    accountWorkAddresses?: CreateAccountData[];
    crimes?: Crime[];
    descriptions?: Description[];
    jurisdictions?: Jurisdiction[];
    reports?: Report[];
    zipCode: number;
  }
  