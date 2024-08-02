export interface SuspectRequest {
    personId: number;
    gangaffliation: string | null;
    reward: number | null;
    isCaught: boolean;
    datetimeOfCaught: string | null;
}