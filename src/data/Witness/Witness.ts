export interface Witness {
    witness_id: number;
    person_id: number;
    firstname: string;
    middlename: string;
    lastname: string;
    sex: string;
    birthdate: string;
    bio_status: boolean;
    civil_Status: string | null;
}