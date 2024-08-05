export interface ReportDto {
    report_id: number;
    report_body: string;
    citizen_id: number;
    report_subcategory_id: number;
    location_id: number | null;
    jurisdiction_id: number;
    crime_id: number | null;
    reported_date: string;
    blotter_num: string;
    subcategory_name: string | null;
    category_name: string | null;
    e_signature: string; 
}