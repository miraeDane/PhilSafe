import { Admin } from "./admin";
import { Person } from "./person";
import { Location } from "./location";
export interface CreateAccountData {

  email: string;
  password: string;
  telNum?: string;
  contactNum: string;
  homeAddressId: number;
  workAddressId: number;
  personId?: number;
  role: string;

}
