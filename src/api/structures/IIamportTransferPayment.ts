import { IIamportPayment } from "./IIamportPayment";

export interface IIamportTransferPayment
    extends IIamportPayment.IBase<"trans">
{
    bank_code: string;
    bank_name: string;
}