export interface CitizenVerificationRequest {
    personId: number;
    mugshotId: number | null;
    proof: FormData;
}