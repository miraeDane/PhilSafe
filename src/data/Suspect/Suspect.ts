export interface SuspectDto {
    suspect_id: number;
    person_id: number;
    affliated_gang: string | null;
    reward: number | null;
    is_caught: boolean;
    datetime_of_caught: string | null;
    first_name: string;
    middle_name: string;
    last_name: string;
    sex: string;
    birth_date: string;
    bio_status: boolean;
    civil_status: string | null;
}