import express from "express";
import * as helper from "encrypted-nestjs";
import * as nest from "@nestjs/common";
import { assertType } from "typescript-is";
import { v4 } from "uuid";

import { IIamportResponse } from "../../api/structures/IIamportResponse";
import { IIamportSubscription } from "../../api/structures/IIamportSubscription";

import { FakeIamportStorage } from "../../providers/FakeIamportStorage";
import { FakeIamportUserAuth } from "../../providers/FakeIamportUserAuth";
import { FakeIamportResponseProvider } from "../../providers/FakeIamportResponseProvider";
import { RandomGenerator } from "../../utils/RandomGenerator";

@nest.Controller("subscribe/consumers")
export class FakeIamportSubscribeConsumersController 
{
    /**
     * 
     * @param request 
     * @param customer_uid 
     * @param input 
     * @returns 
     */
    @helper.TypedRoute.Post(":customer_uid")
    public store
        (
            @nest.Request() request: express.Request,
            @helper.TypedParam("customer_uid", "string") customer_uid: string,
            @nest.Body() input: IIamportSubscription.IStore
    ): IIamportResponse<IIamportSubscription>
    {
        // VALIDATE
        assertType<typeof input>(input);
        FakeIamportUserAuth.authorize(request);

        // ENROLLMENT
        const subscription: IIamportSubscription = {
            customer_uid,
            pg_provider: "pg-of-somewhere",
            pg_id: v4(),
            card_type: "card",
            card_code: v4(),
            card_name: RandomGenerator.name(),
            card_number: input.card_number,
            customer_name: RandomGenerator.name(),
            customer_tel: RandomGenerator.mobile(),
            customer_addr: "address-of-somewhere",
            customer_email: RandomGenerator.alphabets(8) + "@samchon.org",
            customer_postcode: "11122",
            inserted: 1,
            updated: 0
        };
        FakeIamportStorage.subscriptions.set(customer_uid, subscription);

        // RETURNS
        return FakeIamportResponseProvider.returns(subscription);
    }

    /**
     * 
     * @param request 
     * @param customer_uid 
     * @returns 
     */
    @helper.TypedRoute.Delete(":customer_uid")
    public erase
        (
            @nest.Request() request: express.Request,
            @helper.TypedParam("customer_uid", "string") customer_uid: string,
        ): IIamportResponse<IIamportSubscription>
    {
        // VALIDATE
        FakeIamportUserAuth.authorize(request);

        // ERASE RECORD
        const subscription = FakeIamportStorage.subscriptions.get(customer_uid);
        FakeIamportStorage.subscriptions.erase(customer_uid);

        // RETURNS
        return FakeIamportResponseProvider.returns(subscription);
    }
}