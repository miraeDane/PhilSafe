export interface Victim {
    victim_id: number;
    person_id: number;
    vicmethod_id: number;
    datetime_of_death: string | null;
    firstname: string;
    middlename: string;
    lastname: string;
    sex: string;
    birthdate: string;
    bio_status: boolean;
    civil_status: string | null;
    method_name: string | null;
    method_abbrv: string | null;
}