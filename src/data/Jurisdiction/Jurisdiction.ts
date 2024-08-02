export interface Jurisdiction {
    station_id: number;
    hq: string;
    location_id: number;
    abbr: string | null;
    rank: string | null;
    officer_in_charge_id: number | null;
    province: string;
    municipality: string;
    street: string;
    region: string;
    barangay: string;
    latitude: number | null;
    longitude: number | null;
}