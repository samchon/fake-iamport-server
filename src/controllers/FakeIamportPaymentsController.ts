import express from "express";
import helper from "nestia-helper";
import * as nest from "@nestjs/common";

import { IIamportResponse } from "../api/structures/IIamportResponse";
import { IIamportPayment } from "../api/structures/IIamportPayment";

import { FakeIamportStorage } from "../providers/FakeIamportStorage";
import { FakeIamportUserAuth } from "../providers/FakeIamportUserAuth";
import { FakeIamportResponseProvider } from "../providers/FakeIamportResponseProvider";
import { IIamportPaymentCancel } from "../api/structures/IIamportPaymentCancel";
import { FakeIamportPaymentProvider } from "../providers/FakeIamportPaymentProvider";

@nest.Controller("payments")
export class FakeIamportPaymentsController {
    /**
     * 결제 기록 열람하기.
     *
     * 아임포트를 통하여 발생한 결제 기록을 열람한다.
     *
     * @param imp_uid 대상 결제 기록의 {@link IIamportPayment.imp_uid}
     * @returns 결제 정보
     *
     * @author Jeongho Nam - https://github.com/samchon
     */
    @helper.TypedRoute.Get(":imp_uid")
    public at(
        @nest.Request() request: express.Request,
        @helper.TypedParam("imp_uid", "string") imp_uid: string,
    ): IIamportResponse<IIamportPayment> {
        FakeIamportUserAuth.authorize(request);

        const payment: IIamportPayment =
            FakeIamportStorage.payments.get(imp_uid);
        return FakeIamportResponseProvider.success(payment);
    }

    /**
     * 결제 취소하기.
     *
     * 만약 가상 계좌를 통한 결제였다면, 반드시 환불 계좌 정보를 입력해줘야 한다.
     *
     * @param input 결제 취소 입력 정보
     * @returns 취소된 결제 정보
     *
     * @author Jeongho Nam - https://github.com/samchon
     */
    @helper.TypedRoute.Post("cancel")
    public cancel(
        @nest.Request() request: express.Request,
        @helper.TypedBody() input: IIamportPaymentCancel.IStore,
    ): IIamportResponse<IIamportPayment> {
        FakeIamportUserAuth.authorize(request);

        const payment: IIamportPayment = FakeIamportStorage.payments.get(
            input.imp_uid,
        );
        FakeIamportPaymentProvider.cancel(payment, input);

        return FakeIamportResponseProvider.success(payment);
    }
}
