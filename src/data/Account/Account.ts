export interface Account {
    acc_id: number;
    email: string;
    tel_num: string | null;
    contact_num: string;
    home_address_id: number;
    work_address_id: number;
    personId: number;
    first_name: string;
    middle_name: string;
    last_name: string;
    sex: string;
    birth_date: string;
}