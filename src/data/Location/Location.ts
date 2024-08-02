export interface Location {
    location_id: number;
    province: string;
    municipality: string;
    street: string;
    region: string;
    barangay: string;
    block: string | null;
    latitude: number | null;
    longitude: number | null;
}