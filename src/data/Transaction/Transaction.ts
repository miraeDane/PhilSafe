export interface Transaction {
    trans_id: number;
    method_type: string | null;
    brand: string;
    amount: number;
    cit_id: number;
    rep_id: number;
}