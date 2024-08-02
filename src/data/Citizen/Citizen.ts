export interface Citizen {
    citizen_id: number;
    person_id: number;
    mugshot_id: number | null;
    citizen_proof: string | null;
    firstname: string;
    middlename: string;
    lastname: string;
    sex: string;
    birthdate: string;
    bio_status: boolean;
    civil_status: string | null;
    deathdate: string | null;
}