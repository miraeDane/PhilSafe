export interface PersonRequest{
    firstname: string;
    middlename: string;
    lastname: string;
    sex: string;
    birthdate: string;
    bio_status: boolean;
    civil_status: string | null;
    death_date: string | null;
}