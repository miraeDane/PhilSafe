import { Suspect } from "./suspect";

export interface NavigationState {
    returnPage?: string;
    newSuspect?: Suspect;
}