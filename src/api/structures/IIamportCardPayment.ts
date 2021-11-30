import { IIamportPayment } from "./IIamportPayment";

export interface IIamportCardPayment
    extends IIamportPayment.IBase<"card"|"samsung">
{
    card_code: string;
    card_name: string;
    card_number: string;

    /**
     * 할부 개월 수
     */
    card_quota: number;

    /**
     * 카드사 승인번호.
     */
    apply_num: string;
}