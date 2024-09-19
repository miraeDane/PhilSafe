import { BasePerson, ContactDetails, Address, Description, Occupation } from './0common.model';

export interface Complainant extends BasePerson {
  contactDetails: ContactDetails;
  homeAddress: Address;
  workAddress: Address;
  description: Description;
  occupation: Occupation;
}