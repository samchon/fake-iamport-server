import { IIamportPayment } from "./IIamportPayment";

export interface IIamportVirtualBankPayment
    extends IIamportPayment.IBase<"vbank">
{
    vbank_code: string;
    vbank_name: string;
    vbank_num: string;
    vbank_holder: string;
    vbank_date: number;
    vbank_issued_at: number;
}