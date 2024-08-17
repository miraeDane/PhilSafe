import { Person } from './person'; 
import { Description } from './description';
import { AudioTestimony } from './audio-testimony';
import { TextTestimony } from './text-has-testimony';


export interface Witness {
  witnessId: number;
  personId: number;
  audioTestimonies: AudioTestimony[];
  descriptions: Description[];
  person: Person;
  textTestimonies: TextTestimony[];
}
