import { IIamportCardPayment } from "./IIamportCardPayment";
import { IIamportPaymentCancel } from "./IIamportPaymentCancel";
import { IIamportTransferPayment } from "./IIamportTransferPayment";
import { IIamportVBankPayment } from "./IIamportVBankPayment";

/**
 * 결제 정보.
 * 
 * `IIamportPayment` 는 아임포트의 결제 정보를 형상화한 자료구조이자 유니언 타입의 
 * 인터페이스로써, if condition 을 통하여 method 값을 특정하면, 파생 타입이 자동으로
 * 지정된다.
 * 
 * ```typescript
 * if (payment.pay_method === "card")
 *    payment.card_number; // payment be IIamportCardPayment
 * ```
 * 
 * @author Jeongho Nam - https://github.com/samchon
 */
export type IIamportPayment 
    = IIamportCardPayment
    | IIamportTransferPayment
    | IIamportVBankPayment
    | IIamportPayment.IBase<Exclude<
        IIamportPayment.PayMethod, 
        "card"|"samsung"|"trans"|"vbank">>

export namespace IIamportPayment
{
    /**
     * 웹훅 데이터.
     */
    export interface IWebhook
    {
        /**
         * 결제 정보 {@link IIamportPayment} 의 식별자 키.
         */
        imp_uid: string;

        /**
         * 주문 식별자 키.
         * 
         * 아임포트 서버가 아닌, 이를 사용하는 서비스가 자체적으로 발급하고 관리한다.
         */
        merchant_uid: string;

        /**
         * 현재 상태.
         */
        status: Status;
    }

    /**
     * 결제 기본 (공통) 정보.
     */
    export interface IBase<Method extends PayMethod>
    {
        // IDENTIFIER
        pay_method: Method;

        /**
         * 결제 정보 {@link IIamportPayment} 의 식별자 키.
         */
        imp_uid: string;

        // ORDER INFO
        /**
         * 주문 식별자 키.
         * 
         * 아임포트 서버가 아닌, 이를 사용하는 서비스가 자체적으로 발급하고 관리한다.
         */
        merchant_uid: string;

        /**
         * 주문명, 누락 가능.
         */
        name: string | null;

        /**
         * 결제 총액.
         */
        amount: number;

        /**
         * 결제 취소, 환불 총액.
         */
        cancel_amount: number;

        /**
         * 통화 단위.
         */
        currency: IIamportPayment.Currency;

        /**
         * 영수증 URL
         */
        receipt_url: string;

        /**
         * 현금 영수증 발행 여부.
         */
        cash_receipt_issue: boolean;

        // PAYMENT PRVIDER INFO
        channel: string;
        pg_provider: string;
        emb_pg_provider: string | null;
        pg_id: string;
        pg_tid: string;
        escrow: boolean;
        
        // BUYER
        buyer_name: string | null;
        buyer_email: string | null;
        buyer_tel: string | null;
        buyer_addr: string | null;
        buyer_postcode: string | null;
        customer_uid: string | null;
        customer_uid_usage: string | null;
        custom_data: string | null;
        user_agent: string | null;
        
        // PROPERTIES
        /**
         * 결제의 현재 (진행) 상태.
         */
        status: IIamportPayment.Status;

        /**
         * 결제 신청 일시.
         * 
         * 리눅스 타임이 쓰임.
         */
        started_at: number;

        /**
         * 결제 (지불) 완료 일시.
         * 
         * 리눅스 타임이 쓰이며, `null` 대신 0 을 씀.
         */
        paid_at: number;

        /**
         * 결제 실패 일시.
         * 
         * 리눅스 타임이 쓰이며, `null` 대신 0 을 씀.
         */
        failed_at: number;

        /**
         * 결제 취소 일시.
         * 
         * 리눅스 타임이 쓰이며, `null` 대신 0 을 씀.
         */
        cancelled_at: number;

        // CANCELLATIONS
        fail_reason: string | null;
        cancel_reason: string | null;
        cancel_history: IIamportPaymentCancel[];

        /**
         * @internal
         */
        notice_url?: string;
    }

    export type PayMethod 
        = "card"
        | "trans"
        | "vbank"
        | "phone"
        | "samsung"
        | "kpay"
        | "kakaopay"
        | "payco"
        | "lpay"
        | "ssgpay"
        | "tosspay"
        | "cultureland"
        | "smartculture"
        | "happymoney"
        | "booknlife"
        | "point";
    export type Status = "paid" | "ready" | "failed" | "cancelled";
    export type Currency = "KRW" | "USD" | "EUR" | "JPY";
}