/**
 * 결제 취소 정보.
 * 
 * @author Jeongho Nam - https://github.com/samchon
 */
export interface IIamportPaymentCancel
{
    pg_id: string;
    pg_tid: string;
    amount: number;
    cancelled_at: number;
    reason: string;
    receipt_url: string;
}
export namespace IIamportPaymentCancel
{
    /**
     * 결제 취소 입력 정보.
     */
    export interface IStore
    {
        imp_uid: string;
        merchant_uid: string;
        amount: number;
        tax_free: number;
        checksum: number;
        reason: string;

        refund_holder?: string;
        refund_bank?: string;
        refund_account?: string;
        refund_tel?: string;
    }
}