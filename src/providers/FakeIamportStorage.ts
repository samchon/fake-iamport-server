import { IIamportCertification } from "../api/structures/IIamportCertification";
import { IIamportPayment } from "../api/structures/IIamportPayment";
import { IIamportReceipt } from "../api/structures/IIamportReceipt";
import { IIamportSubscription } from "../api/structures/IIamportSubscription";
import { IIamportUser } from "../api/structures/IIamportUser";

import { FakeIamportConfiguration } from "../FakeIamportConfiguration";
import { VolatileMap } from "../utils/VolatileMap";

export namespace FakeIamportStorage {
    export const certifications: VolatileMap<string, IIamportCertification> =
        new VolatileMap(FakeIamportConfiguration.STORAGE_EXPIRATION);
    export const payments: VolatileMap<string, IIamportPayment> =
        new VolatileMap(FakeIamportConfiguration.STORAGE_EXPIRATION);
    export const receipts: VolatileMap<string, IIamportReceipt> =
        new VolatileMap(FakeIamportConfiguration.STORAGE_EXPIRATION);
    export const subscriptions: VolatileMap<string, IIamportSubscription> =
        new VolatileMap(FakeIamportConfiguration.STORAGE_EXPIRATION);
    export const users: VolatileMap<string, IIamportUser> = new VolatileMap(
        FakeIamportConfiguration.STORAGE_EXPIRATION,
    );
    export const webhooks: VolatileMap<string, IIamportPayment.IWebhook> =
        new VolatileMap(FakeIamportConfiguration.STORAGE_EXPIRATION);
}
