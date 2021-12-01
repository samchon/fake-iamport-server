import { IIamportPayment } from "./IIamportPayment";

/**
 * 카드 결제 정보.
 * 
 * @author Jeongho Nam - https://github.com/samchon
 */
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