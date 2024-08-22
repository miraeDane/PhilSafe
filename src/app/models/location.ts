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


  export interface Coordinates {
    longitude: number;
    latitude: number;
    eventTime?: string;
  }


  export interface Cluster {
    cluster_label: number;
    density: number;
    centroid: {
        longitude: number;
        latitude: number;
        event_time: string;
    };
    coordinates: Coordinates[];
  }
  
  