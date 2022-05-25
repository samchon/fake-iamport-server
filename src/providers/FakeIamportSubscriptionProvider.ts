import { v4 } from "uuid";

import { IIamportSubscription } from "../api/structures/IIamportSubscription";

import { FakeIamportStorage } from "./FakeIamportStorage";
import { RandomGenerator } from "../utils/RandomGenerator";

export namespace FakeIamportSubscriptionProvider {
    export function store(
        customer_uid: string,
        input: IIamportSubscription.IStore,
    ): IIamportSubscription {
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
            updated: 0,
        };
        FakeIamportStorage.subscriptions.set(customer_uid, subscription);

        return subscription;
    }
}
