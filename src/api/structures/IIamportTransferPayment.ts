import { IIamportPayment } from "./IIamportPayment";

/**
 * 계좌 이체 결제 정보.
 * 
 * @author Jeongho Nam - https://github.com/samchon
 */
export interface IIamportTransferPayment
    extends IIamportPayment.IBase<"trans">
{
    bank_code: string;
    bank_name: string;
}