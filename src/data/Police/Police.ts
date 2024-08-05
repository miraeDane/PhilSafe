export interface Police{
    police_id: number;
    unit: string;
    role: string;
    badge_number: string;
    debut_date: string;
    station_id: number;
    person_id: number;
    pfp_id: number;
    rank_id: number;
    rank_full: string;
    rank_abbr: string;
    firstname: string;
    middlename: string;
    lastname: string;
    sex: string;
    created_by: string | null;
    datetime_created: string | null;
}