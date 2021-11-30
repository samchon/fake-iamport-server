import { IIamportCardPayment } from "./IIamportCardPayment";
import { IIamportPaymentCancel } from "./IIamportPaymentCancel";
import { IIamportTransferPayment } from "./IIamportTransferPayment";
import { IIamportVirtualBankPayment } from "./IIamportVirtualBankPayment";

/**
 * 결제 정보.
 */
export type IIamportPayment 
    = IIamportCardPayment
    | IIamportTransferPayment
    | IIamportVirtualBankPayment
    | IIamportPayment.IBase<Exclude<
        IIamportPayment.PayMethod, 
        "card"|"samsung"|"trans"|"vbank">>

export namespace IIamportPayment
{
    export interface IAccessor
    {
        merchant_uid: string;
    }

    export interface IWebhook extends IAccessor
    {
        imp_uid: string;
        status: Status;
    }

    export interface IBase<Method extends PayMethod>
        extends IAccessor
    {
        // TYPE INFO
        pay_method: Method;

        // ORDER INFO
        imp_uid: string;
        name?: string;
        amount: number;
        cancel_amount: number;
        currency: IIamportPayment.Currency;
        receipt_url: string;
        cash_receipt_issue: boolean;

        // PAYMENT PRVIDER INFO
        channel: string;
        pg_provider: string;
        emb_pg_provider?: string;
        pg_id: string;
        pg_tid: string;
        escrow: boolean;
        
        // BUYER
        buyer_name?: string;
        buyer_email?: string;
        buyer_tel?: string;
        buyer_addr?: string;
        buyer_postcode?: string;
        customer_uid?: string;
        customer_uid_usage?: string;
        custom_data?: string;
        user_agent?: string;
        
        // TIMESTAMPS
        status: IIamportPayment.Status;
        started_at: number;
        paid_at?: number;
        failed_at?: number;
        cancelled_at?: number;

        // CANCELLATIONS
        fail_reason?: SVGStringList;
        cancel_reason?: string;
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