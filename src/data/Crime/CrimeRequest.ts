export interface CrimeRequest {
    title: string;
    offenseType: string | null;
    citeNumber: string;
    datetimeReported: string | null;
    datetimeCommitted: string | null;
    description: string | null;
    status: string;
    incidenttypeId: number;
    datetimeCreated: string | null;
    lastModified: string | null;
    createdBy: string | null;
    modifiedBy: string | null;
    locationId: number | null;
    stationId: number | null;
    victim_id_list: number[] | null;
    suspect_id_list: number[] | null;
    police_id_list: number[] | null;
}