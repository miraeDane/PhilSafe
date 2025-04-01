import { BasePerson, ContactDetails, Address, Description, Occupation } from './0common.model';
import { Victim } from './victim';

export interface VictimCommon extends BasePerson {
  contactDetails?: ContactDetails;
  homeAddress: Address;
  workAddress: Address;
  description?: Description | null;
  occupation?: Occupation;
  victim: Victim
}