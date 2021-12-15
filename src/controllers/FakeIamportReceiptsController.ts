import express from "express";
import helper from "nestia-helper";
import * as nest from "@nestjs/common";
import { v4 } from "uuid";

import { IIamportReceipt } from "../api/structures/IIamportReceipt";
import { IIamportResponse } from "../api/structures/IIamportResponse";
import { FakeIamportUserAuth } from "../providers/FakeIamportUserAuth";
import { IIamportPayment } from "../api/structures/IIamportPayment";
import { FakeIamportStorage } from "../providers/FakeIamportStorage";
import { FakeIamportResponseProvider } from "../providers/FakeIamportResponseProvider";

@nest.Controller("receipts/:imp_uid")
export class FakeIamportReceiptsController
{
    /**
     * 현금 영수증 조회하기.
     * 
     * @param imp_uid 귀속 결제의 {@link IIamportPayment.imp_uid}
     * @returns 현금 영수증 정보
     * 
     * @author Jeongho Nam - https://github.com/samchon
     */
    @helper.TypedRoute.Get()
    public at
        (
            @nest.Request() request: express.Request,
            @helper.TypedParam("imp_uid", "string") imp_uid: string
        ): IIamportResponse<IIamportReceipt>
    {
        FakeIamportUserAuth.authorize(request);

        const receipt: IIamportReceipt = FakeIamportStorage.receipts.get(imp_uid);
        return FakeIamportResponseProvider.success(receipt);
    }

    /**
     * 현금 영수증 발행하기.
     * 
     * @param imp_uid 귀속 결제의 {@link IIamportPayment.imp_uid}
     * @param input 현금 영수증 입력 정보
     * @returns 현금 영수증 정보
     * 
     * @author Jeongho Nam - https://github.com/samchon
     */
    @helper.TypedRoute.Post()
    public store
        (
            @nest.Request() request: express.Request,
            @helper.TypedParam("imp_uid", "string") imp_uid: string,
            @nest.Body() input: IIamportReceipt.IStore
        ): IIamportResponse<IIamportReceipt>
    {
        FakeIamportUserAuth.authorize(request);

        const payment: IIamportPayment = FakeIamportStorage.payments.get(imp_uid);
        if (!payment.paid_at)
            throw new nest.UnprocessableEntityException("Not paid yet.");
        else if (FakeIamportStorage.receipts.has(imp_uid) === true)
        {
            const oldbie: IIamportReceipt = FakeIamportStorage.receipts.get(imp_uid);
            if (oldbie.cancelled_at === null)
                throw new nest.UnprocessableEntityException("Already issued.");
        }

        const receipt: IIamportReceipt = {
            imp_uid,
            receipt_uid: v4(),
            apply_num: v4(),
            type: input.type || "person",
            amount: payment.amount,
            vat: payment.amount * 0.1,
            receipt_url: "https://github.com/samchon/fake-iamport-server",
            applied_at: Date.now() / 1000,
            cancelled_at: 0
        };
        FakeIamportStorage.receipts.set(imp_uid, receipt);
        payment.cash_receipt_issue = true;

        return FakeIamportResponseProvider.success(receipt);
    }

    /**
     * 현금 영수증 취소하기.
     * 
     * @param imp_uid 귀속 결제의 {@link IIamportPayment.imp_uid}
     * @returns 취소된 현금 영수증 정보
     * 
     * @author Jeongho Nam - https://github.com/samchon
     */
    @helper.TypedRoute.Delete()
    public erase
        (
            @nest.Request() request: express.Request,
            @helper.TypedParam("imp_uid", "string") imp_uid: string,
        )
    {
        FakeIamportUserAuth.authorize(request);

        const payment: IIamportPayment = FakeIamportStorage.payments.get(imp_uid);
        const receipt: IIamportReceipt = FakeIamportStorage.receipts.get(imp_uid);

        if (receipt.cancelled_at !== null)
            throw new nest.UnprocessableEntityException("Already cancelled.");

        payment.cash_receipt_issue = false;
        receipt.cancelled_at = Date.now() / 1000;

        return FakeIamportResponseProvider.success(receipt);
    }
}