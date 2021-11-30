import { IIamportPayment } from "../api/structures/IIamportPayment";
import { IIamportSubscription } from "../api/structures/IIamportSubscription";
import { IIamportUser } from "../api/structures/IIamportUser";
import { Configuration } from "../Configuration";
import { VolatileMap } from "../utils/VolatileMap";

export namespace FakeIamportStorage
{
    export const payments: VolatileMap<string, IIamportPayment> = new VolatileMap(Configuration.STORAGE_EXPIRATION);
    export const subscriptions: VolatileMap<string, IIamportSubscription> = new VolatileMap(Configuration.STORAGE_EXPIRATION);
    export const users: VolatileMap<string, IIamportUser> = new VolatileMap(Configuration.STORAGE_EXPIRATION);
    export const webhooks: VolatileMap<string, IIamportPayment.IWebhook> = new VolatileMap(Configuration.STORAGE_EXPIRATION);
}