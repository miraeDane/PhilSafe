

export interface Region {
    region_id: number;
    region_name: string;
    region_description: string;
    FIELD4: "";
}

export interface Province {
    province_id: number;
    region_id: number;
    province_name: string;
}




export interface Municipality {
    municipality_id: number;
    province_id: number;
    municipality_name: string;
}

export interface Barangay {
    barangay_id: number;
    municipality_id: number;
    barangay_name: string;
}