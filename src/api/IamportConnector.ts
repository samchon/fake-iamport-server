import { SharedLock } from "tstl/thread/SharedLock";
import { SharedMutex } from "tstl/thread/SharedMutex";
import { UniqueLock } from "tstl/thread/UniqueLock";
import { users } from "./functional";

import { IConnection } from "./IConnection";
import { IIamportResponse } from "./structures/IIamportResponse";
import { IIamportUser } from "./structures/IIamportUser";

export class IamportConnector
{
    private readonly mutex_: SharedMutex;
    private token_: IIamportUser | null;

    public constructor
        (
            public readonly host: string,
            public readonly accessor: IIamportUser.IAccessor
        )
    {
        this.mutex_ = new SharedMutex();
        this.token_ = null;
    }

    public async get(): Promise<IConnection>
    {
        return {
            host: this.host,
            headers: {
                Authorization: await this.getToken()
            },
        };
    }

    private async getToken(): Promise<string>
    {
        if (this.token_ === null || Date.now() >= this.token_.expired_at * 1000 - 15_000)
        {
            const locked: boolean = await UniqueLock.try_lock(this.mutex_, async () =>
            {
                const output: IIamportResponse<IIamportUser> = await users.getToken
                (
                    { host: this.host },
                    this.accessor
                );
                this.token_ = output.response;
            });
            if (locked === false)
                await SharedLock.lock(this.mutex_, () => {});
        }
        return this.token_!.access_token;
    }
}