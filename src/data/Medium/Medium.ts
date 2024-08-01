export interface Medium {
    media_id: number;
    content: string;
    content_type: string;
    description: string | null;
    report_id: number | null;
    crime_id: number | null;
    filename: string;
}