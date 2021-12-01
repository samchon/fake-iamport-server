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
     * 간편 결제 카드 등록하기.
     * 
     * `subscribe.consumers.stoer` 는 고객이 자신의 카드를 서버에 등록해두고, 매번 결제가
     * 필요할 때마다 카드 정보를 반복 입력하는 일 없이, 간편하게 결제를 진행하고자 할 때
     * 사용하는 API 함수이다.
     * 
     * 참고로 `subscribe.consumers.store` 는 클라이언트 어플리케이션이 아임포트가 제공하는 
     * 간편 결제 카드 등록 창을 사용하는 경우, 귀하의 백엔드 서버가 이를 실 서비스에서 호출하는 
     * 일은 없을 것이다. 다만, 고객이 간편 결제 카드를 등록하는 상황을 시뮬레이션하기 위하여, 
     * 테스트 자동화 프로그램 수준에서 사용될 수는 있다.
     * 
     * @param customer_uid 고객 (간편 결제 카드) 식별자 키
     * @param input 카드 입력 정보
     * @returns 간편 결제 카드 정보
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
     * 간편 결제 카드 삭제하기.
     * 
     * 간편 결제를 위하여 등록한 카드를 제거한다.
     * 
     * @param customer_uid 고객 (간편 결제 카드) 식별자 키
     * @returns 삭제된 간편 결제 카드 정보
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