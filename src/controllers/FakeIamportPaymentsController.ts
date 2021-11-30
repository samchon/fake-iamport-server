import express from "express";
import * as helper from "encrypted-nestjs";
import * as nest from "@nestjs/common";

import { IIamportResponse } from "../api/structures/IIamportResponse";
import { IIamportPayment } from "../api/structures/IIamportPayment";

import { FakeIamportStorage } from "../providers/FakeIamportStorage";
import { FakeIamportUserAuth } from "../providers/FakeIamportUserAuth";
import { FakeIamportResponseProvider } from "../providers/FakeIamportResponseProvider";

@nest.Controller("payments")
export class FakeIamportPaymentsController
{
    @helper.TypedRoute.Get(":imp_uid")
    public at
        (
            @nest.Request() request: express.Request,
            @helper.TypedParam("imp_uid", "string") imp_uid: string
        ): IIamportResponse<IIamportPayment>
    {
        FakeIamportUserAuth.authorize(request);

        const payment: IIamportPayment = FakeIamportStorage.payments.get(imp_uid);
        return FakeIamportResponseProvider.returns(payment);
    }
}