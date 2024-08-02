export interface AccountRequestDto {
    email: string;
    telNum: string | null;
    password: string;
    contactNum: string;
    homeAddressId: number;
    workAddressId: number;
    personId: number;
}