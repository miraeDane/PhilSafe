export interface PoliceRequest {
    unit: string;
    role: string;
    badgeNumber: string;
    debutDate: string;
    stationId: number;
    personId: number;
    pfpId: number;
    rankId: number;
    createdBy: string | null;
    datetimeCreated: string | null;
}