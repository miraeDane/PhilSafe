export interface Crime {
    crime_id: number;
    title: string;
    offense_type: string | null;
    cite_number: string;
    datetime_reported: string | null;
    datetime_committed: string | null;
    description: string | null;
    status: string;
    incident_type_id: number;
    datetime_created: string | null;
    last_modified: string | null;
    created_by: string | null;
    modified_by: string | null;
    location_id: number | null;
    station_id: number | null;
}