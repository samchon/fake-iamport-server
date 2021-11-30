import { IIamportPayment } from "./IIamportPayment";

/**
 * 계좌 이체 결제 정보.
 */
export interface IIamportTransferPayment
    extends IIamportPayment.IBase<"trans">
{
    bank_code: string;
    bank_name: string;
}