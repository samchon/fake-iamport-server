import express from "express";
import * as nest from "@nestjs/common";
import { v4 } from "uuid";

import { IIamportUser } from "../api/structures/IIamportUser";

import { Configuration } from "../Configuration";
import { FakeIamportStorage } from "./FakeIamportStorage";

export namespace FakeIamportUserAuth
{
    export function issue(accessor: IIamportUser.IAccessor): IIamportUser
    {
        if (Configuration.authorize(accessor) === false)
            throw new nest.ForbiddenException("Wrong authorization key values.");

        const user: IIamportUser = {
            now: Date.now() / 1000,
            expired_at: (Date.now() + Configuration.USER_EXPIRATION_TIME) / 1000,
            access_token: v4()
        };
        FakeIamportStorage.users.set(user.access_token, user);

        return user;
    }

    export function authorize(request: express.Request): void
    {
        const token: string | undefined = request.headers.authorization;
        if (token === undefined)
            throw new nest.ForbiddenException("No authorization token exists.");

        const user: IIamportUser = FakeIamportStorage.users.get(token);
        if (new Date(user.expired_at * 1000).getTime() > Date.now())
            throw new nest.ForbiddenException("The token has been expired.");
    }
}