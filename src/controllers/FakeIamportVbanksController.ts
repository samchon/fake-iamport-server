import express from "express";
import * as helper from "encrypted-nestjs";
import * as nest from "@nestjs/common";
import { assertType } from "typescript-is";
import { randint } from "tstl/algorithm/random";
import { v4 } from "uuid";

import { IIamportPayment } from "../api/structures/IIamportPayment";
import { IIamportResponse } from "../api/structures/IIamportResponse";
import { IIamportVBankPayment } from "../api/structures/IIamportVBankPayment";

import { FakeIamportUserAuth } from "../providers/FakeIamportUserAuth";
import { FakeIamportPaymentProvider } from "../providers/FakeIamportPaymentProvider";
import { FakeIamportResponseProvider } from "../providers/FakeIamportResponseProvider";
import { FakeIamportStorage } from "../providers/FakeIamportStorage";
import { RandomGenerator } from "../utils/RandomGenerator";

@nest.Controller("vbanks")
export class FakeIamportVbanksController
{
    /**
     * 가상 계좌 발급하기.
     * 
     * @param input 가상 계좌 입력 정보
     * @returns 가상 계좌 결제 정보
     */
    @helper.TypedRoute.Post()
    public store
        (
            @nest.Request() request: express.Request,
            @nest.Body() input: IIamportVBankPayment.IStore
        ): IIamportResponse<IIamportVBankPayment>
    {
        // VALIDATE
        assertType<typeof input>(input);     
        FakeIamportUserAuth.authorize(request);
        
        // CONSTRUCTION
        const pg_id: string = v4();
        const payment: IIamportVBankPayment = {
            // VIRTUAL-BANK INFO
            vbank_code: input.vbank_code,
            vbank_name: RandomGenerator.name(2) + "은행",
            vbank_num: randint(100000000, 999999999).toString(),
            vbank_holder: RandomGenerator.name(),
            vbank_date: input.vbank_due,
            vbank_issued_at: Date.now(),

            // ORDER INFO
            pay_method: "vbank",
            currency: "KRW",
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
            customer_uid: v4(),
            customer_uid_usage: "issue",
            custom_data: input.custom_data,
            user_agent: "Test Automation",

            // TIMESTAMPS
            status: "ready",
            started_at: Date.now() / 1000,
            cancel_history: [],

            // HIDDEN
            notice_url: input.notice_url
        };
        FakeIamportPaymentProvider.store(payment);

        // RETURNS
        return FakeIamportResponseProvider.returns(payment);
    }

    /**
     * 가상 계좌 편집하기.
     * 
     * @param input 가상 계좌 편집 입력 정보
     * @returns 편집된 가상 계좌 결제 정보
     */
    @helper.TypedRoute.Put()
    public update
        (
            @nest.Request() request: express.Request,
            @nest.Body() input: IIamportVBankPayment.IUpdate
        ): IIamportResponse<IIamportVBankPayment>
    {
        // VALIDATE
        assertType<typeof input>(input);
        FakeIamportUserAuth.authorize(request);

        // GET PAYMENT RECORD
        const payment: IIamportPayment = FakeIamportStorage.payments.get(input.imp_uid);
        if (payment.pay_method !== "vbank")
            throw new nest.UnprocessableEntityException("Not a virtual bank payment.");

        // MODIFY
        if (input.amount)
            payment.amount = input.amount;
        if (input.vbank_due)
            payment.vbank_date = input.vbank_due;

        // RETURNS WITH INFORM
        FakeIamportPaymentProvider.webhook(payment);
        return FakeIamportResponseProvider.returns(payment);
    }
}