export interface ReportRequest {
    reportBody: string;
    citizenId: number;
    reportSubCategoryId: number;
    locationId: number | null;
    stationId: number;
    crimeId: number | null;
    reportedDate: string;
    blotterNum: string;
    hasAccount: boolean; 
    eSignature: File; 
}