export interface AudioTestimony {
    witness_id: number | null;
    audiotestimony_id: number;
    content: string;
    crime_id: number;
    datetime_obtained: string | null;
    obtained_by: number | null;
    obtainer: string | null;
}