export interface TextTestimonyRequestDto {
    witnessId: number | null;
    content: string;
    crimeId: number;
    datetimeObtained: string | null;
    obtainedBy: number | null;
}