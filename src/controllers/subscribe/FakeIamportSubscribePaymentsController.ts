import express from "express";
import * as helper from "encrypted-nestjs";
import * as nest from "@nestjs/common";
import { assertType } from "typescript-is";
import { v4 } from "uuid";

import { IIamportCardPayment } from "../../api/structures/IIamportCardPayment";
import { IIamportResponse } from "../../api/structures/IIamportResponse";
import { IIamportSubscription } from "../../api/structures/IIamportSubscription";

import { FakeIamportResponseProvider } from "../../providers/FakeIamportResponseProvider";
import { FakeIamportStorage } from "../../providers/FakeIamportStorage";
import { FakeIamportSubscriptionProvider } from "../../providers/FakeIamportSubscriptionProvider";
import { FakeIamportUserAuth } from "../../providers/FakeIamportUserAuth";
import { RandomGenerator } from "../../utils/RandomGenerator";
import { FakeIamportPaymentProvider } from "../../providers/FakeIamportPaymentProvider";

@nest.Controller("subscribe/payments")
export class FakeIampotSubscribePaymentsController
{
    /**
     * 
     * @param input 카드 결제 신청 정보
     * @returns 카드 결제 정보
     */
    @helper.TypedRoute.Post("onetime")
    public onetime
        (
            @nest.Request() request: express.Request,
            @nest.Body() input: IIamportSubscription.IOnetime
        ): IIamportResponse<IIamportCardPayment>
    {
        assertType<typeof input>(input);
        FakeIamportUserAuth.authorize(request);

        if (input.customer_uid)
            FakeIamportSubscriptionProvider.store
            (
                input.customer_uid, 
                input as IIamportSubscription.IStore
            );

        const pg_id: string = v4();
        const payment: IIamportCardPayment = {
            card_code: v4(),
            card_name: RandomGenerator.name(),
            card_number: input.card_number,
            card_quota: input.card_quota || 0,
            apply_num: v4(),

            // ORDER INFO
            pay_method: "card",
            currency: input.currency || "KRW",
            merchant_uid: input.merchant_uid,
            imp_uid: v4(),
            name: input.name,
            amount: input.amount,
            cancel_amount: 0,
            receipt_url: "https://github.com/samchon/fake-iamport-server",
            cash_receipt_issue: true,
            
            // PAYMENT PROVIDER INFO
            channel: Math.random() < .5 ? "pc" : "mobile",
            pg_provider: "somewhere",
            pg_id,
            pg_tid: pg_id,
            escrow: false,

            // BUYER
            buyer_name: input.buyer_name,
            buyer_tel: input.buyer_tel,
            buyer_email: input.buyer_email,
            buyer_addr: input.buyer_addr,
            customer_uid: input.customer_uid,
            customer_uid_usage: input.customer_uid ? "issue" : undefined,
            custom_data: input.custom_data,
            user_agent: "Test Automation",

            // TIMESTAMPS
            status: "paid",
            started_at: Date.now() / 1000,
            paid_at: Date.now() / 1000,
            cancel_history: [],

            // HIDDEN
            notice_url: input.notice_url
        };
        FakeIamportPaymentProvider.store(payment);

        return FakeIamportResponseProvider.returns(payment);
    }

    /**
     * 
     * @param input 미리 등록한 카드를 이용한 결제 신청 정보
     * @returns 카드 결제 정보
     */
    @helper.TypedRoute.Post("again")
    public again
        (
            @nest.Request() request: express.Request,
            @nest.Body() input: IIamportSubscription.IAgain
        ): IIamportResponse<IIamportCardPayment>
    {
        assertType<typeof input>(input);
        FakeIamportUserAuth.authorize(request);

        const subscription: IIamportSubscription = FakeIamportStorage.subscriptions.get(input.customer_uid);
        
        const pg_id: string = v4();
        const payment: IIamportCardPayment = {
            card_code: subscription.card_code,
            card_name: subscription.card_name,
            card_number: subscription.card_number,
            card_quota: input.card_quota || 0,
            apply_num: v4(),

            // ORDER INFO
            pay_method: "card",
            currency: input.currency || "KRW",
            merchant_uid: input.merchant_uid,
            imp_uid: v4(),
            name: input.name,
            amount: input.amount,
            cancel_amount: 0,
            receipt_url: "https://github.com/samchon/fake-iamport-server",
            cash_receipt_issue: true,
            
            // PAYMENT PROVIDER INFO
            channel: Math.random() < .5 ? "pc" : "mobile",
            pg_provider: "somewhere",
            pg_id,
            pg_tid: pg_id,
            escrow: false,

            // BUYER
            buyer_name: input.buyer_name || subscription.customer_name,
            buyer_tel: input.buyer_tel || subscription.customer_tel,
            buyer_email: input.buyer_email || subscription.customer_email,
            buyer_addr: input.buyer_addr || subscription.customer_addr,
            customer_uid: subscription.customer_uid,
            customer_uid_usage: "issue",
            custom_data: input.custom_data,
            user_agent: "Test Automation",

            // TIMESTAMPS
            status: "paid",
            started_at: Date.now() / 1000,
            paid_at: Date.now() / 1000,
            cancel_history: [],

            // HIDDEN
            notice_url: input.notice_url,
        };
        FakeIamportPaymentProvider.store(payment);

        return FakeIamportResponseProvider.returns(payment);
    }
}