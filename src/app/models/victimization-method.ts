import { Victim } from './victim'; 

export interface VictimizationMethod {
  vicMethodId: number;
  methodName: string;
  methodAbbrv?: string;
  victims: Victim[];
}
