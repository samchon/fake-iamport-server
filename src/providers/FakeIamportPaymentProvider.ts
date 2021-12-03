import { DomainError } from "tstl/exception/DomainError";

import { IIamportPayment } from "../api/structures/IIamportPayment";
import { IIamportPaymentCancel } from "../api/structures/IIamportPaymentCancel";
import { IIamportVBankPayment } from "../api/structures/IIamportVBankPayment";

import { FakeIamportConfiguration } from "../FakeIamportConfiguration";
import { FakeIamportStorage } from "./FakeIamportStorage";

export namespace FakeIamportPaymentProvider
{
    export function store(payment: IIamportPayment): void
    {
        FakeIamportStorage.payments.set(payment.imp_uid, payment);
        webhook(payment).catch(() => {});
    }

    export function deposit(payment: IIamportVBankPayment): void
    {
        payment.status = "paid";
        payment.paid_at = Date.now() / 1000;
        webhook(payment).catch(() => {});
    }

    export function cancel(payment: IIamportPayment, input: IIamportPaymentCancel.IStore): void
    {
        // VALIDATION
        if (payment.pay_method === "vbank" && 
            (!input.refund_holder || !input.refund_bank || !input.refund_account))
            throw new DomainError("가상계좌 취소는 계좌번호, 예금주, 은행명을 입력해야 합니다.");
        else if (!payment.cancel_amount)
            payment.cancel_amount = 0;
        
        // ARCHIVE CANCEL HISTORY
        payment.cancel_amount += input.amount;
        payment.cancel_reason = input.reason;
        payment.cancelled_at = Date.now() / 1000;
        payment.cancel_history.push({
            pg_id: payment.pg_id,
            pg_tid: payment.pg_tid,
            amount: input.amount,
            cancelled_at: Date.now() / 1000,
            reason: input.reason,
            receipt_url: payment.receipt_url
        });
        
        // INFORM THE EVENT
        payment.status = "cancelled";
        webhook(payment).catch(() => {});
    }

    export async function webhook(payment: IIamportPayment): Promise<void>
    {
        const webhook: IIamportPayment.IWebhook = {
            imp_uid: payment.imp_uid,
            merchant_uid: payment.merchant_uid,
            status: payment.status,
        };
        FakeIamportStorage.webhooks.set(webhook.imp_uid, webhook);

        await fetch(payment.notice_url || FakeIamportConfiguration.WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(webhook),
        })
    }
}